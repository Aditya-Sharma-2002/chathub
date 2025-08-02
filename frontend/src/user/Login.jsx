import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { emailValidator, passwordValidator } from '../core/validator';
import { login } from './apiUser';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 new state
  const navigate = useNavigate();

  const error = {};

  function handleSubmit(e) {
    e.preventDefault();
    emailValidator(email, error, setFormErrors);
    passwordValidator(password, error, setFormErrors);

    if (Object.keys(error).length === 0) {
      login(email, password).then(response => {
        if (response.status === 400) {
          setStatus(response.response.data.message);
        } else {
          localStorage.setItem('token', JSON.stringify(response.data));
          navigate('/home');
        }
      });
    } else {
      setFormErrors(error);
    }
  }

  function handleEmail(e) {
    setEmail(e.target.value);
    if (touched.email) {
      emailValidator(e.target.value, formErrors, setFormErrors);
    }
  }

  function handlePassword(e) {
    setPassword(e.target.value);
    if (touched.password) {
      passwordValidator(e.target.value, formErrors, setFormErrors);
    }
  }

  function handleBlur(field, value) {
    setTouched({ ...touched, [field]: true });
    if (field === 'email') emailValidator(value, formErrors, setFormErrors);
    else if (field === 'password') passwordValidator(value, formErrors, setFormErrors);
  }

  return (
    <div className="login-container">
      <h1>Welcome to ChatHub</h1>
      <div className="auth-box neumorphic">
        <form onSubmit={handleSubmit}>
          <h2 className="auth-title">Log In</h2>

          <div className="form-group">
            <label>Email</label>
            <input
              className="auth-input"
              type="text"
              placeholder="Enter your email"
              onChange={handleEmail}
              onBlur={() => handleBlur('email', email)}
            />
            {formErrors.email && <span className="error-text">{formErrors.email}</span>}
          </div>

          <div className="form-group password-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                className="auth-input"
                type={showPassword ? "text" : "password"} // 👈 toggle type
                placeholder="Enter password"
                onChange={handlePassword}
                onBlur={() => handleBlur('password', password)}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <i className="fa-solid fa-eye-slash"></i> // 👈 eye-slash icon
                ) : (
                  <i className="fa-solid fa-eye"></i>       // 👈 eye icon
                )}
              </button>
            </div>
            {formErrors.password && <span className="error-text">{formErrors.password}</span>}
          </div>

          {status && <p className="error-text">{status}</p>}

          <button type="submit" className="auth-button">Log In</button>

          <div className="auth-links">
            <Link to="/forgot" state={{ emailO: email }}>Forgot Password?</Link>
            <Link to="/signup">Don't have an account?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
