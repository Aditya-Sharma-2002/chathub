import { useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import { emailValidator, passwordValidator } from '../core/validator'
import { login } from './apiUser';

function Login()
{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setFormErrors] = useState({});

    function handleSubmit(e){
        e.preventDefault();
        emailValidator(email, formErrors, setFormErrors)
        passwordValidator(password, formErrors, setFormErrors)
        if(Object.keys(formErrors).length === 0)
            login(email, password).then(data => {
                if(data.error) console.log(data.error);
            })
        else
            alert("Errors")
    }

    useEffect(() => {
        emailValidator(email, formErrors, setFormErrors);
    }, [email])

    useEffect(() => {
        passwordValidator(password, formErrors, setFormErrors)
    }, [password])

    function handleEmail(e){
        setEmail(e.target.value)
    }

    function handlePassword(e){        
        setPassword(e.target.value)
    }

    return(
    <div className="container">
        <h1>WELCOME</h1>
        <form onSubmit={handleSubmit}>
            <label>Email</label><br/>
            <input type="text" placeholder="Enter your email id" onChange={(e) => {handleEmail(e)}}/><br/>
            <text style={{color: 'red'}}>{formErrors.email}</text><br/><br/>

            <label>Password</label><br/>
            <input type="password" placeholder="Enter passsword" onChange={(e) => handlePassword(e)}/><br/>  
            <text style={{color: 'red'}}>{formErrors.password}</text><br/><br/>
            <button type="submit">LogIn</button>
        </form>
        <label><Link to='/forgot'>Forgot Password</Link></label><br></br>
        <label><Link to='/signup'>Don&apos;t have an account</Link></label>
    </div>
)}

export default Login;