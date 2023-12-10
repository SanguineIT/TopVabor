import { API_URL } from "./apiUrl";

export const userSignin = `${API_URL}user/login`;
export const userSignup = `${API_URL}user/signup`;
export const userResetpassword = `${API_URL}user/reset-password`;
export const userChangepassword = `${API_URL}user/change-password`;
export const userForgotpassword = `${API_URL}user/forget-password`;
export const userVerifyotp = `${API_URL}user/verify-otp`;

export const carDetialPagination = `${API_URL}car-details/pagination`;

export const tourPagination = `${API_URL}tour-tickts/pagination`;
export const categoryPagination = `${API_URL}category/pagination`;
export const categoryGetAll = `${API_URL}category/get-All`;
export const userTerms = `${API_URL}dashboard/UserTerms`;

export const updateBookingStatus = `${API_URL}booking/Booking-Confirmation/{id}`;
export const bookingCreate = `${API_URL}booking/create-or-update`;
export const stripeLink = `${API_URL}/stripe/payment-link`;
export const userAbout = `${API_URL}dashboard/Terms-About`;

// tour api

export const stripeTourLink = `${API_URL}stripe/tour-payment-link`;
export const craeteTourbooking = `${API_URL}booking/create-tour-booking`;

export const rejectCarBooking = `${API_URL}booking/Reject-Booking/{id}`;
export  const visaDetails = `${API_URL}visa-detail/create-or-update`;
export  const visaList   =`${API_URL}visa-detail/user-visa/pagination`;
export  const bookingPagination   =`${API_URL}booking/users-booking/pagination`;

