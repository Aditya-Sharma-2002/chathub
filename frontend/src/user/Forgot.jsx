import { useState, useEffect } from "react";
import { forgot } from './apiUser';
import { nameValidator, emailValidator, passwordValidator } from '../core/validator';
import { useLocation } from "react-router-dom";

function Forgot(){

    const [email,setEmail] = useState('');
    const [otp,setOtp] = useState('');
    const [password,setPassword] = useState('');
    const [repassword,setRepassword] = useState('');
    const [active,setActive] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const location = useLocation();
    const { emailO } = location.state || {};

    useEffect(() => {
        if (email.length > 0 && otp.length > 0 && password === repassword && password.length > 0) {
            setActive(true);
        } else {
            setActive(false);
        }
    }, [email, otp, password, repassword])

    function handleSubmit(e){
        e.preventDefault();        
        
        if(email.length != 0 && otp === OTP && password === repassword)
            setActive(true);
    }

    function getOTP(e){
        e.preventDefault();
        const OTP = forgot(email).then(data => {
            console.log(data);
            if(data.error)
                console.log(data.error);        
        });
        setActive(true);
    }

    return(
        <div className="container">
            <form onSubmit={handleSubmit}>
                {!active ? <label>Email <input type="email" placeholder="Enter email" value={location.state.emailO} onChange={(e) => setEmail(e.target.value)}/><br/><br/></label> : <label>Email <input disabled type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)}/><br/><br/></label>}
                <p></p>
                {active ? <label>OTP <input type="text" placeholder="Enter otp" onChange={(e) => setOtp(e.target.value)}/><br/><br/></label> : ''}
                {active ? <label>New Password <input type="password" placeholder="Enter new password" onChange={(e) => setPassword(e.target.value)}/><br/><br/></label> : ''}
                {active ? <label>Re-enter Password <input type="password" placeholder="Re-enter your password" onChange={(e) => setRepassword(e.target.value)}/><br/><br/></label> : ''}
                {active ? <button type='submit' disabled={active}>Change Password</button> : <button onClick={getOTP}>Send OTP</button>}
                
            </form>
        </div>
    );
}

export default Forgot;