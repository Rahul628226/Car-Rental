import React, { useState } from "react";
import styled from "styled-components";
import {
    FaEnvelope,
    FaLock,
} from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ReCAPTCHA from "react-google-recaptcha";
import { postVendor } from "../../../Redux/Slicer/Vendor/VendorReg/VendorReg";

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #fff;
  color: #000;
  font-family: "Arial", sans-serif;
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

const CreateAdminUser = () => {


    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const dispatch = useDispatch();
    const [userId, setUserId] = useState(null);
    const { loading, success, error } = useSelector((state) => state.email);

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
            const vendorData = { firstName, lastName, email, password, Role:'Admin',verify:true };
            const response = await dispatch(postVendor(vendorData));
            const userId = response.payload._id;
            setUserId(userId);
        } catch (error) {
            console.log(`Error registering user: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
        


                    <FormWrapper>
                        <InputRow>
                            <InputField>
                                <label>First Name</label>
                                <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </InputField>
                            <InputField>
                                <label>Last Name</label>
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
                    </FormWrapper>
          
        </Container>
    );
};

export default CreateAdminUser;