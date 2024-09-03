import { Link } from "react-router-dom";

function Login()
{
    return(
    <div className="container">
        <h1>WELCOME</h1>
        <form>
            <label>Username</label><br></br>
            <input type="text" placeholder="enter your name"/><br></br>
            <label>Password</label><br></br>
            <input type="text" placeholder="enter passsword"/><br></br>
            <button type="submit">LogIn</button>
        </form>
        <label><Link to='/forgot'>Forget Password</Link></label><br></br>
        <label><Link to='/signup'>Don't have an account</Link></label>
    </div>
)}

export default Login;