import { useEffect, useState } from 'react';
import { signup } from './apiUser';
import { nameValidator, emailValidator, passwordValidator } from '../core/validator';

function Signup(){
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [repassword,setRepassword] = useState('');
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        nameValidator(name, formErrors, setFormErrors);
        formErrors.name = '';
    }, [name]);

    useEffect(() => {   
        emailValidator(email, formErrors, setFormErrors)
        formErrors.email = ''
    }, [email]);

    useEffect(() => {
        passwordValidator(password, formErrors, setFormErrors)
        formErrors.password = '';
    }, [password]);

    function handleSubmit(e){
        e.preventDefault();
        nameValidator(name, formErrors, setFormErrors);
        emailValidator(email, formErrors, setFormErrors);
        passwordValidator(password, formErrors, setFormErrors);
        if(password === repassword){
            signup(name, email, password).then(data => {
                if(data.error) console.log(data.error);
            })
        }
    }

    return(
        <div className='container'>
            <h1>Hey new user !!!</h1>
            <form onSubmit={handleSubmit}>
                <label>Name <input type='text' placeholder='Enter your name' onChange={(e) => {setName(e.target.value)}}/></label><br/>
                <label>Email <input type='text' placeholder='Enter your email' onChange={(e) => {setEmail(e.target.value)}}/></label><br/>
                <label>Password 
                    <input type='password' placeholder='Enter password' onChange={(e) => {setPassword(e.target.value)}}/> <br/>
                    <input type='password' placeholder='Re-enter your password' onChange={(e) => {setRepassword(e.target.value)}}/>
                </label><br/><br/>
                <input type='submit' value='Get register' />
            </form>
        </div>
    );
}

export default Signup;