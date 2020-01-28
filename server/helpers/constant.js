import dotenv from 'dotenv';
dotenv.config();

export const EMAIL_VERIFY_MSG = ({ first_name, token, url }) => `Hi ${first_name},<br/>Your have been successfully registered with Edugate. Please Click <a href=${url}user/verify/?token=${token}>here</a> to get your account verified.<br/> Congratulations once again!!!! Thank you.`;

export const EMAIL_VERIFY_SUBJECT = 'Veriy your account';

export const EMAIL_VERIFY_ERROR_MSG = 'Sorry, your account is not verified. A verification email has been sent to you. Please click the link to get verified. Thank you';