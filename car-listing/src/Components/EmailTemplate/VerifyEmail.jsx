import React from 'react';

const VerifyEmail = ({ userId, token }) => `
  <div>
    <h1>Email Verification</h1>
    <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
    <a href="http://localhost:5173/verify-email/${userId}/${token}">Click here to verify your email</a>
  </div>
`;

export default VerifyEmail;
