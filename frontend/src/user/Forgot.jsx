import { useState } from "react";
import { forgot } from './apiUser';
import { emailValidator, passwordValidator } from '../core/validator';
import { useLocation } from "react-router-dom";
import './Forgot.css';

function Forgot() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [serverOTP, setServerOTP] = useState('');
    const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
    const [formErrors, setFormErrors] = useState({});
    const location = useLocation();
    const { emailO } = location.state || {};

    async function handleGetOTP(e) {
        e.preventDefault();
        const errors = {};
        emailValidator(email, errors, setFormErrors);

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const response = await forgot(email);
        if (response && response.otp) {
            setServerOTP(response.otp);
            setStep(2); // move to OTP step
        } else {
            setFormErrors({ email: "Failed to send OTP" });
        }
    }

    function handleOTPSubmit(e) {
        e.preventDefault();
        if (otp !== serverOTP) {
            setFormErrors({ otp: "Invalid OTP" });
            return;
        }
        setStep(3); // move to password reset step
    }

    function handlePasswordSubmit(e) {
        e.preventDefault();
        const errors = {};
        passwordValidator(password, errors, setFormErrors);

        if (password !== repassword) {
            errors.repassword = "Passwords do not match";
        }

        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            console.log("Password reset successful!");
        }
    }

    return (
        <div className="forgot-container">
            <div className="forgot-box neumorphic">
                <h2 className="forgot-title">Forgot Password</h2>

                <form>
                    {step === 1 && (
                        <>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    className="auth-input"
                                    type="email"
                                    placeholder="Enter your email"
                                    defaultValue={emailO || ''}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled
                                />
                                {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                            </div>
                            <button className="auth-button" onClick={handleGetOTP}>
                                Send OTP
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="form-group">
                                <label>OTP</label>
                                <input
                                    className="auth-input"
                                    type="text"
                                    placeholder="Enter OTP"
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                                {formErrors.otp && <span className="error-text">{formErrors.otp}</span>}
                            </div>
                            <button className="auth-button" onClick={handleOTPSubmit}>
                                Verify OTP
                            </button>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    className="auth-input"
                                    type="password"
                                    placeholder="Enter new password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {formErrors.password && <span className="error-text">{formErrors.password}</span>}
                            </div>

                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input
                                    className="auth-input"
                                    type="password"
                                    placeholder="Re-enter your password"
                                    onChange={(e) => setRepassword(e.target.value)}
                                />
                                {formErrors.repassword && <span className="error-text">{formErrors.repassword}</span>}
                            </div>

                            <button className="auth-button" onClick={handlePasswordSubmit}>
                                Reset Password
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}

export default Forgot;
