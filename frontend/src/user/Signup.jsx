import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from './apiUser';
import { validateAllFields } from '../core/validator';
import './Signup.css';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();

        const errors = validateAllFields({ name, email, password, repassword });
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            return; // Don't proceed if any errors
        }

        signup(name, email, password).then(response => {
            if (response.error) {
                console.log(response.error);
            } else {
                localStorage.setItem('token', JSON.stringify(response.data));
                navigate('/home/profile');
            }
        });
    }

    return (
        <div className='signup-container'>
            <h1>Hey new user !!!</h1>
            <form className="signup-form" onSubmit={handleSubmit}>
                <label>
                    Name
                    <input
                        type='text'
                        placeholder='Enter your name'
                        onChange={(e) => setName(e.target.value)}
                    />
                    {formErrors.name && <span className="error">{formErrors.name}</span>}
                </label>

                <label>
                    Email
                    <input
                        type='text'
                        placeholder='Enter your email'
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {formErrors.email && <span className="error">{formErrors.email}</span>}
                </label>

                <label>
                    Password
                    <input
                        type='password'
                        placeholder='Enter password'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {formErrors.password && <span className="error">{formErrors.password}</span>}
                </label>

                <label>
                    Confirm Password
                    <input
                        type='password'
                        placeholder='Re-enter your password'
                        onChange={(e) => setRepassword(e.target.value)}
                    />
                    {formErrors.repassword && <span className="error">{formErrors.repassword}</span>}
                </label>

                <button type='submit'>Get Registered</button>
            </form>
        </div>
    );
}

export default Signup;
