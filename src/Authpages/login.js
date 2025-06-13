// pages/Login.js
import React from 'react';
import '../Authpages/Auth.css'
import { useNavigate } from 'react-router-dom';

function Login({onLoginSuccess}) {

   const navigate = useNavigate();

  const handleLogin = () => {
    // validate login credentials here
    onLoginSuccess();
    navigate('/');
  };
  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form className="auth-form">
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit" onClick={handleLogin}>Login</button>
      </form>
      <p>Don't have an account? <a href="/signup">Signup</a></p>
    </div>
  );
}

export default Login;
