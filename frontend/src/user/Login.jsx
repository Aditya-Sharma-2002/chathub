import { useState } from 'react';
import { Link } from "react-router-dom";
import { emailValidator, passwordValidator } from '../core/validator'
import { login } from './apiUser';
import { useNavigate } from 'react-router-dom';

function Login()
{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [touched, setTouched] = useState({});
    const navigate = useNavigate();
    const error = {};
    const [status, setStatus] = useState('');

    function handleSubmit(e){
        e.preventDefault();

        emailValidator(email, error, setFormErrors)
        passwordValidator(password, error, setFormErrors)

        if(Object.keys(error).length === 0){
            login(email, password).then(response => {                
                if(response.status === 400){
                    setStatus(response.response.data.message);
                }                    
                else {
                    localStorage.setItem('token', JSON.stringify(response.data))
                    navigate('/home')        
                }
            })
        }
        else{
            setFormErrors(error)
            alert("Error still persists")
        }
    }

    function handleEmail(e){
        setEmail(e.target.value)
        if(touched.email)
            emailValidator(email, formErrors, setFormErrors);            
    }

    function handlePassword(e){        
        setPassword(e.target.value)
        if(touched.password)
            passwordValidator(password, formErrors, setFormErrors)
    }

    function handleBlur(field, value) {
        setTouched({ ...touched, [field]: true });

        if (field === 'email') {
            emailValidator(value, formErrors, setFormErrors);
        } else if (field === 'password') {
            passwordValidator(value, formErrors, setFormErrors);
        }
    }

    return(
    <div className="container">
        <h1>WELCOME</h1>
        <form onSubmit={handleSubmit}>
            <label>Email</label><br/>
            <input type="text" placeholder="Enter your email id" onChange={(e) => handleEmail(e)} onBlur={() => handleBlur('email')}/><br/>
            <p style={{color: 'red'}}>{formErrors.email}</p>

            <label>Password</label><br/>
            <input type="password" placeholder="Enter passsword" onChange={(e) => handlePassword(e)} onBlur={() => handleBlur('password')}/><br/>  
            <p style={{color: 'red'}}>{formErrors.password}</p>
            <button type="submit">Log In</button>            
            <p style={{color: 'red'}}>{status}</p>

        </form>
        <button><Link to='/forgot'>Forgot Password</Link></button><br/>
        <button><Link to='/signup'>Don&apos;t have an account</Link></button>
    </div>
)}

export default Login;