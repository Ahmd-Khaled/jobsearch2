import cron from "node-cron";
import * as dbService from "../DB/dbService.js";
import { asyncHandler } from "../utils/error_handling/asyncHandler.js";
import { UserModel } from "../DB/Models/user.model.js";

// CRON Job to delete expired OTPs every 6 hours

cron.schedule(
  "0 */6 * * *", // 1Minute === '*/1 * * * *'
  async () => {
    console.log(
      ".......................Running CRON job to delete expired OTPs..."
    );
    try {
      const users = await dbService.findWithoutPaginate({
        model: UserModel,
        filter: { OTP: { $exists: true, $ne: [] } },
      });

      for (let user of users) {
        // Filter out expired OTPs
        const updatedOTP = user.OTP.filter((otp) => otp.expiresIn > new Date());

        // If there are changes, update the user document
        if (updatedOTP.length !== user.OTP.length) {
          user.OTP = updatedOTP;
          await user.save();
          console.log(`Deleted expired OTPs for user: ${user.email}`);
        }
      }

      console.log("CRON job finished successfully");
    } catch (error) {
      console.error("Error in CRON job:", error);
    }
  },
  {
    timezone: "Africa/Cairo",
  }
);
