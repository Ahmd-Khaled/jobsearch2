import * as dbService from "../../DB/dbService.js";
import { ApplicationModel } from "../../DB/Models/application.model.js";
import { CompanyModel } from "../../DB/Models/company.model.js";
import exceljs from "exceljs";
import cloudinary from "cloudinary";
import streamifier from "streamifier";

// Export Applications to Excel Sheet
export const exportCompanyApplications = async (req, res, next) => {
  const { companyId, date } = req.query;
  //   Check the company
  const company = await dbService.findOne({
    model: CompanyModel,
    filter: { _id: companyId },
    populate: [
      {
        path: "jobs",
        populate: [
          {
            path: "_id", // To access the job ID
            model: "Job",
          },
        ],
      },
    ],
  });

  if (!company) {
    return next(new Error("Company not found", { cause: 404 }));
  }

  //  Collect all job IDs
  const jobIds = company.jobs.map((job) => job._id);

  if (jobIds.length === 0) {
    return next(new Error("No jobs found for this company", { cause: 404 }));
  }

  //   Get the the required Day from the date
  const startDate = new Date(date);
  const endDate = new Date(date);
  endDate.setDate(endDate.getDate() + 1);

  // Find all applications related to those jobs
  const applications = await dbService.find({
    model: ApplicationModel,
    filter: {
      jobId: { $in: jobIds },
      createdAt: { $gte: startDate, $lt: endDate },
    },
    populate: [{ path: "userId" }],
  });

  if (!applications || applications.data?.length === 0) {
    return next(
      new Error("No applications found for this company and date", {
        cause: 404,
      })
    );
  }

  //   Format the data to match the Excel sheet structure
  const workbook = new exceljs.Workbook();
  const worksheet = workbook.addWorksheet("Applications");

  worksheet.columns = [
    { header: "Full Name", key: "name", width: 25 },
    { header: "Email", key: "email", width: 30 },
    { header: "Mobile Number", key: "mobileNumber", width: 20 },
    { header: "Gender", key: "gender", width: 10 },
    { header: "DOB", key: "DOB", width: 15 },
    { header: "Applied Date", key: "createdAt", width: 25 },
    { header: "Status", key: "status", width: 10 },
    { header: "CV Link", key: "cvLink", width: 40 },
  ];

  applications.data.forEach((app) => {
    worksheet.addRow({
      name: app.userId.username,
      email: app.userId.email,
      mobileNumber: app.userId.mobileNumber,
      gender: app.userId.gender,
      DOB: app.userId.DOB,
      createdAt: app.createdAt.toISOString(),
      status: app.status,
      cvLink: app.userCV.secure_url,
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();

  const uploadStream = cloudinary.v2.uploader.upload_stream(
    {
      resource_type: "raw",
      folder: "applications",
      public_id: `applications_${company.companyName}_${date}`,
      format: "xlsx",
    },
    (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Cloudinary Upload Error" });
      }
      //   res.status(200).json({ url: result.secure_url });
      res.status(200).json({
        status: true,
        message: "Applications fetched successfully",
        url: result.secure_url,
        ...applications,
      });
    }
  );

  streamifier.createReadStream(buffer).pipe(uploadStream);
};
