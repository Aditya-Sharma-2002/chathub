import { useState } from 'react';
import { signup } from './apiUser';

function Signup(){

    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [repassword,setRepassword] = useState('');

    function handleSubmit(e){
        e.preventDefault();
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