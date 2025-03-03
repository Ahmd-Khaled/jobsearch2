export const providersTypes = {
  System: "System",
  Google: "Google",
};

export const genderTypes = {
  Male: "Male",
  Female: "Female",
};

export const roleTypes = {
  Admin: "Admin",
  User: "User",
};

export const typesOfOTP = {
  confirmEmail: "confirmEmail",
  forgetPassword: "forgetPassword",
};

export const employeesRanges = {
  "1-10": "1-10",
  "11-20": "11-20",
  "21-50": "21-50",
  "51-100": "51-100",
  "101-200": "101-200",
  "201-500": "201-500",
  "501-1000": "501-1000",
  "1000+": "1000+",
};

export const exampleDescription =
  "Like what are the actual activities and services provided by the company ?";
export const exampleIndustry = "Like Mental Health care";

export const jobLocations = {
  onsite: "onsite",
  remotely: "remotely",
  hybrid: "hybrid",
};

export const workingTimes = {
  "part-time": "part-time",
  "full-time": "full-time",
};

export const seniorityLevels = {
  Fresh: "Fresh",
  Junior: "Junior",
  "Mid-Level": "Mid-Level",
  Senior: "Senior",
  "Team-Lead": "Team-Lead",
  CTO: "CTO",
};

export const jobDescriptionExample =
  "Identify what is the job and what i will do i accepted";

export const appsStatus = {
  pending: "pending",
  accepted: "accepted",
  viewed: "viewed",
  "in consideration": "in consideration",
  rejected: "rejected",
};

// ---------------------------------------------------------------------
export const OTP_EXPIRATION = 10 * 60 * 1000; // 10 minutes
export const MAX_OTP_REQUESTS = 5; // 5 times to block OTP requests
export const BLOCK_DURATION = 10 * 60 * 1000; // 10 minutes
export const now = Date.now();
// ---------------------------------------------------------------------
export const subject = {
  register: "Register New Account",
  verifyEmail: "Activate Account",
  forgotPassword: "Reset Password",
  changePassword: "Password Changed Successfully",
  regnerateOTP: "New OTP",
  updateEmail: "Update Email",
};
// ------------------------- Default Images----------------------------
export const defaultProfilePic =
  "https://res.cloudinary.com/dxaw2mt91/image/upload/v1738592847/wzjejohdj1ifdharh9gs.png";

export const defaultProfilePicPublicId = "wzjejohdj1ifdharh9gs";

export const defaultCoverPic =
  "https://res.cloudinary.com/dxaw2mt91/image/upload/v1740944893/default_cover_image_pdyhnr.jpg";

export const defaultCoverPicPublicId = "default_cover_image_pdyhnr";

export const defaultLogo =
  "https://res.cloudinary.com/dxaw2mt91/image/upload/v1740976971/default-logo_mffc8z.png";

export const defaultLogoPublicId = "default-logo_mffc8z";
// ------------------------- Default Images----------------------------
