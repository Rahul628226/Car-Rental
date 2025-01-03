import React, { useState } from "react";
import styled from "styled-components";
import {
    FaGoogle,
    FaGithub,
    FaGitlab,
    FaUserAlt,
    FaEnvelope,
    FaLock,
} from "react-icons/fa";

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { generateTokenWithExpiration } from './GenerateToken/GeneratorToken';
import VerifyEmail from '../EmailTemplate/VerifyEmail';
import { sendVerificationEmail } from '../../Redux/Slicer/Vendor/SendEmail/SendEmail';
import EmailVerificationUi from '../EmailTemplate/EmailVerificationUi';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ReCAPTCHA from "react-google-recaptcha";
import { postVendor } from "../../Redux/Slicer/Vendor/VendorReg/VendorReg";

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #fff;
  color: #000;
  font-family: "Arial", sans-serif;
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  background-color: #e6f7ff;
  color: #000;

   @media (max-width: 700px) {
    display: none;
  }

  h1 {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #007bff;
  }

  p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      display: flex;
      align-items: center;
      margin-bottom: 1.5rem;

      svg {
        color: #007bff;
        margin-right: 0.5rem;
      }
    }
  }
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f8ff;

 
`;


const FormWrapper = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #007bff;
  }
`;

const SocialButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;

  button {
    flex: 1;
    margin: 0 0.5rem;
    padding: 0.5rem;
    background: #007bff;
    border: none;
    border-radius: 4px;
    color: #fff;
    font-size: 0.9rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      margin-right: 0.5rem;
    }

    &:hover {
      background: #0056b3;
    }
  }
`;

const InputRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;

  > div {
    flex: 1;
  }
`;

const RecaptchaWrapper = styled.div`
  margin-top: 1rem;
  width: 100%;

  .g-recaptcha {
    width: 100%;
  }
  
  > div {
    display: flex;
    justify-content: center;
  }
`;


const InputField = styled.div`
  position: relative;
 
  label {
    display: block;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  input {
    width: 100%;
    padding: 0.5rem 0.5rem 0.5rem 2rem;
    // border: 1px solid #ccc;
    border-radius: 4px;
     background:#F6F7F9;
    color: #000;
    font-size: 1rem;
  }

  svg {
    position: absolute;
    left: 0.7rem;
    top: 70%;
    transform: translateY(-50%);
    color: #007bff;
  }
`;

const PasswordField = styled(InputField)`
  svg {
    left: 0.7rem;
  }
    .eye-icon {
  position: absolute;
  top: 70%;
  right: 40px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #888;
}
    margin-bottom:15px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.7rem;
  background: #007bff;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background: #0056b3;
  }
`;

const Footer = styled.p`
  text-align: center;
  font-size: 0.8rem;
  margin-top: 1rem;

  a {
    color: #007bff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const SignUp = () => {


    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailVerificationSent, setIsEmailVerificationSent] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userId, setUserId] = useState(null);
    const { loading, success, error } = useSelector((state) => state.email);

    const googleLogin = () => {
        window.open(`${import.meta.env.VITE_API_URL}/api/google`, '_self');
    };


    const onRecaptchaChange = (token) => {
        setRecaptchaToken(token);
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


        if (!recaptchaToken) {
            toast.error("Please verify you're not a robot");
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (!passwordPattern.test(password)) {
            toast.error('Password must be at least 8 characters, including letters, numbers, and special characters.');
            return;
        }

        setIsLoading(true);

        try {
            const vendorData = { firstName, lastName, email, password, Role:'Vendor' };
            const response = await dispatch(postVendor(vendorData));
            const userId = response.payload._id;
            setUserId(userId);

            const tokenWithExpiration = generateTokenWithExpiration();
            const htmlContent = VerifyEmail({ userId, token: tokenWithExpiration });
            const subject = 'Please verify your email address';

            try {
                await dispatch(sendVerificationEmail({ to: email, userId, html: htmlContent, subject }));
                setIsEmailVerificationSent(true);
                toast.success('User registered successfully! Please verify your email.');

                if (typeof gtag !== 'undefined') {
                    gtag('event', 'sign_up', {
                        method: 'Email',
                    });
                }
            } catch (verificationError) {
                toast.error(`Error sending verification email: ${verificationError.message}`);
            }
        } catch (error) {
            toast.error(`Error registering user: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleresendemail = async () => {
        try {
            const tokenWithExpiration = generateTokenWithExpiration();
            const htmlContent = VerifyEmail({ userId, token: tokenWithExpiration });
            const subject = 'Please verify your email address';
            await dispatch(sendVerificationEmail({ to: email, userId, html: htmlContent, subject }));
            setIsEmailVerificationSent(true);
            toast.success('User registered successfully! Please verify your email.');
        } catch (verificationError) {
            toast.error(`Error sending verification email: ${verificationError.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
           
            <LeftSection>
                <h1>Car List Platform</h1>
                <p>Manage and organize your car inventory with ease:</p>
                <ul>
                    <li>
                        <FaUserAlt /> User-friendly interface
                    </li>
                    <li>
                        <FaEnvelope /> Instant email notifications
                    </li>
                    <li>
                        <FaLock /> Secure data storage
                    </li>
                </ul>
            </LeftSection>
            <RightSection>

                {isEmailVerificationSent ? (
                    <EmailVerificationUi email={email} handleresendemail={handleresendemail} />
                ) : (

                    <FormWrapper>
                        <h2>Sign Up</h2>
                        <SocialButtons>
                            <button onClick={googleLogin}>
                                <FaGoogle /> Google
                            </button>
                        </SocialButtons>
                        <InputRow>
                            <InputField>
                                <label>First Name</label>
                                <FaUserAlt />
                                <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </InputField>
                            <InputField>
                                <label>Last Name</label>
                                <FaUserAlt />
                                <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </InputField>
                        </InputRow>

                        <InputField>
                            <label>Email</label>
                            <FaEnvelope />
                            <input type="email"
                                name="email"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} />
                        </InputField>

                        <PasswordField>
                            <label>Password</label>
                            <FaLock />
                            <input type={isPasswordVisible ? "text" : "password"}
                                name="password"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} />
                            <span onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="eye-icon">
                                {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </PasswordField>


                        <PasswordField>
                            <label>Confirm Password</label>
                            <FaLock />
                            <input type={isConfirmPasswordVisible ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)} />
                            <span onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} className="eye-icon">
                                {isConfirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </PasswordField>


                        <RecaptchaWrapper>
                            <ReCAPTCHA
                                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                                onChange={onRecaptchaChange}
                                onExpired={() => setRecaptchaToken(null)}
                                theme="light"
                                size="normal"
                                badge="bottomright"
                            />
                        </RecaptchaWrapper>


                        <SubmitButton onClick={handleRegister} disabled={isLoading || loading}>{isLoading || loading ? 'Loading...' : 'Sign Up'}</SubmitButton>
                        <Footer>
                            By creating an account, you agree to the <a href="#">Terms of Service</a>. Already have an account? {" "}
                            <a href="#">Login</a>
                        </Footer>
                    </FormWrapper>
                )}
            </RightSection>
        </Container>
    );
};

export default SignUp;