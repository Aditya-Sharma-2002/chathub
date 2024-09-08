import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

function Login()
{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {   
        validateEmail()
        formErrors.email = ''
    }, [email])

    useEffect(() => {
        validatePassword()
        formErrors.password = '';
    }, [password])

    function validateEmail(){
        const error = {...formErrors};
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!email)
            error.email = "Email is required"
        else if(!emailRegex.test(email))
            error.email = "Email not valid"
        else
            delete error.email
        setFormErrors(error);
    }

    function validatePassword(){
        const error = {...formErrors};
        if(!password)
            error.password = "Password is required"
        else if(!/^.{8,}$/.test(password))
            error.password = "Minimum length should be 8"
        else if(!/[A-Z]/.test(password))
            error.password = "Atleast one Upper case character should be there"
        else if(!/[a-z]/.test(password))
            error.password = "Atleast one Lower case character should be there"
        else if(!/\d/.test(password))
            error.password = "Atleast one digit should be there"
        else if(!/[@$!%*#?&]/.test(password))
            error.password = "Atleast one special character should be there"
        else
            delete error.password;
        setFormErrors(error);
    }

    function handleSubmit(e){
        e.preventDefault();
    }

    return(
    <div className="container">
        <h1>WELCOME</h1>
        <form onSubmit={handleSubmit}>
            <label>Email</label><br/>
            <input type="text" placeholder="enter your email id" onChange={(e) => setEmail(e.target.value)}/><br/>
            <text style={{color: 'red'}}>{formErrors.email}</text><br/><br/>

            <label>Password</label><br/>
            <input type="password" placeholder="enter passsword" onChange={(e) => setPassword(e.target.value)}/><br/>  
            <text style={{color: 'red'}}>{formErrors.password}</text><br/><br/>
            <button type="submit">LogIn</button>
        </form>
        <label><Link to='/forgot'>Forgot Password</Link></label><br></br>
        <label><Link to='/signup'>Don&apos;t have an account</Link></label>
    </div>
)}

export default Login;