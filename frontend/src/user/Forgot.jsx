import { useState, useEffect } from "react";
import { forgot } from './apiUser';
import { emailValidator, passwordValidator } from '../core/validator';
import { useLocation } from "react-router-dom";

function Forgot() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [serverOTP, setServerOTP] = useState(''); // for storing OTP from server
    const [active, setActive] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const location = useLocation();
    const { emailO } = location.state || {};

    useEffect(() => {
        if (email.length > 0 && otp.length > 0 && password === repassword && password.length > 0) {
            setActive(true);
        } else {
            setActive(false);
        }
    }, [email, otp, password, repassword]);

    function handleSubmit(e) {
        e.preventDefault();

        const errors = {};

        // validate all fields
        emailValidator(email, formErrors, (newErrors) => Object.assign(errors, newErrors));
        passwordValidator(password, formErrors, (newErrors) => Object.assign(errors, newErrors));

        if (password !== repassword) {
            errors.repassword = "Passwords do not match";
        }

        if (otp !== serverOTP) {
            errors.otp = "Invalid OTP";
        }

        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            console.log("Success: Ready to call password reset API");
            // API call here...
        }
    }

    async function getOTP(e) {
        e.preventDefault();
        const response = await forgot(email);
        if (response && response.otp) {
            setServerOTP(response.otp);
            console.log("OTP sent:", response.otp);
        } else {
            setFormErrors({ email: response.error || "Failed to send OTP" });
        }
    }

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                {!active ? (
                    <>
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter email"
                            defaultValue={emailO || ''}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {formErrors.email && <p className="error">{formErrors.email}</p>}
                        <br /><br />
                    </>
                ) : (
                    <>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            disabled
                        />
                        <br /><br />
                    </>
                )}

                {active && (
                    <>
                        <label>OTP</label>
                        <input type="text" placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} />
                        {formErrors.otp && <p className="error">{formErrors.otp}</p>}
                        <br /><br />

                        <label>New Password</label>
                        <input type="password" placeholder="Enter new password" onChange={(e) => setPassword(e.target.value)} />
                        {formErrors.password && <p className="error">{formErrors.password}</p>}
                        <br /><br />

                        <label>Re-enter Password</label>
                        <input type="password" placeholder="Re-enter your password" onChange={(e) => setRepassword(e.target.value)} />
                        {formErrors.repassword && <p className="error">{formErrors.repassword}</p>}
                        <br /><br />
                    </>
                )}

                {active ? (
                    <button type="submit">Change Password</button>
                ) : (
                    <button onClick={getOTP}>Send OTP</button>
                )}
            </form>
        </div>
    );
}

export default Forgot;
