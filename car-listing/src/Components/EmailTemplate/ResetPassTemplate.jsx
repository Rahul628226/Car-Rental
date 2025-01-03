import React from 'react';

const ResetPassTemplate = ({ userId, token }) => `
  <div>
    <h1>Password Reset</h1>
    <p>We received a request to reset your password. Please click the link below to reset your password:</p>
    <a href="https://emexuae.ae/password-reset/${userId}/${token}">Click here to reset your password</a>
  </div>
`;

export default ResetPassTemplate;
