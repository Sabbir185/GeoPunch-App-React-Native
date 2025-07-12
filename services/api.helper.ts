import { del, get, patch, post, postForm, put } from "./api";

type ApiData = Record<string, any>;

// Auth APIs
export const postLogin = (data: ApiData) => post('/auth/login', data);
export const postSignup = (data: ApiData) => post('/auth/signup', data);
export const fetchProfile = (data: ApiData) => get('/profile', data);
export const updateProfile = (data: ApiData) => put('/profile', data);
export const updatePassword = (data: ApiData) => patch('/user/password-change', data);
export const accountDeleteByToken = (data: ApiData) => post('/auth/delete-account', data);

// File Upload APIs
export const uploadProfileImage = (data: ApiData) => postForm('/profile/image', data);
export const uploadSingleFileAsPrivate = (data: ApiData, isCompanyPanel: boolean = false) =>
  postForm(isCompanyPanel ? '/file/upload/private-single/company-panel' : '/file/upload/private-single', data);
export const viewFileAsPrivate = (data: ApiData, isCompanyPanel: boolean = false) =>
  post(isCompanyPanel ? '/file/view/private/company-panel' : '/file/view/private', data);
export const uploadMultipleFile = (data: ApiData) => postForm('/file/multiple-file-upload', data);
export const deleteFile = (data: ApiData, isCompanyPanel: boolean = false) =>
  post(isCompanyPanel ? '/file/delete/company' : '/file/delete', data);

export const verifyOtpCompany = (data: ApiData) => post('otp/verify/profile-update/company-panel', data);
export const postOtpVerify = (data: ApiData) => post('/user/otp-verify', data);
export const fetchAllOtp = (data: ApiData) => get('/otp/list', data);
export const verifyAccount = (data: ApiData) => post('/auth/verify-identifier', data);

// OTP Related (Forgot Password)
export const sendSignUpOtp = (data: ApiData) => post('/auth/signup/otp', data);
export const otpForgetPassword = (data: ApiData) => post('/auth/otp', data);
export const resetPassword = (data: ApiData) => post('/auth/reset-password', data);
export const verifyOTP = (data: ApiData) => post('/auth/otp/verify', data);
export const changePassword = (data: ApiData) => post('/auth/update-password', data);

export const fetchAboutUs = (data?: ApiData) => get('/settings/about-us', data);
export const fetchPrivacyPolicy = (data?: ApiData) => get('/settings/privacy-policy', data);
export const fetchTermsConditions = (data?: ApiData) => get('/settings/terms-conditions', data);

export const requestAutoAttendance = (data: ApiData) => post('/attendance/auto-check', data);
export const requestManualAttendance = (data: ApiData) => post('/attendance/manual-check', data);
export const fetchAttendanceStatus = (data?: ApiData) => get('/attendance/status', data);
export const fetchAttendanceLogs = (data?: ApiData) => get('/attendance/logs', data);
export const fetchAttendanceSummary = (data?: ApiData) => get('/attendance/summary', data);