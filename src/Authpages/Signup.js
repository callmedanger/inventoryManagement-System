// pages/Signup.js
import React from 'react';
import '../Authpages/Auth.css'

function Signup() {
  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <form className="auth-form">
        <input type="text" placeholder="Full Name" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <input type="number" placeholder="Mobile Number" required />

        <button type="submit">Signup</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}

export default Signup;
