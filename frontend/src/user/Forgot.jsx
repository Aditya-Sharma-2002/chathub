import { useState, useEffect } from "react";
import { forgot } from './apiUser';

function Forgot(){

    const [email,setEmail] = useState('');
    const [otp,setOtp] = useState();
    const [password,setPassword] = useState('');
    const [repassword,setRepassword] = useState('');
    const [active,setActive] = useState(false);

    useEffect(() => {
        if (email.length > 0 && otp.length > 0 && password === repassword && password.length > 0) {
            setActive(true);
        } else {
            setActive(false);
        }
    }, [email, otp, password, repassword]);

    function handleSubmit(e){
        e.preventDefault();
        if(email.length != 0 && otp === OTP && password === repassword)
            setActive(true);
    }

    const OTP = forgot().then(data => {
        if(data.error)
            console.log(data.error);        
    });

    return(
        <div className="container">
            <form onSubmit={handleSubmit}>
                <label>Email <input type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)}/></label><br/>
                <label>OTP <input type="number" placeholder="Enter otp" onChange={(e) => setOtp(e.target.value)}/></label><br/>
                <label>New Password <input type="password" placeholder="Enter new password" onChange={(e) => setPassword(e.target.value)}/></label><br/>
                <label>Re-enter Password <input type="password" placeholder="Re-enter your password" onChange={(e) => setRepassword(e.target.value)}/></label><br/>
                <button disabled={active}>Change Password</button>
            </form>
        </div>
    );
}

export default Forgot;