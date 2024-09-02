import React from "react";

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
        <label><a>Forget Password</a></label><br></br>
        <label><a>Don't have an account</a></label>
    </div>
)}

export default Login;