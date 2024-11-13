import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterPage.css';

function RegisterPage(  {error, setError}) {
    const navigate = useNavigate();

    const handleSubmit = async(event) => {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const username = formData.get('username');
        const fullname = formData.get('fullname');
        const email = formData.get('email');
        const password = formData.get('password');
        

        try{
            const response = await fetch('http://localhost:3000/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, fullname, email, password})
            });

            if(!response.ok){
                throw new Error('Register failed');
            }

            const data = await response.json();

            navigate('/');

        }catch(error){
            setError(error.message);
        }

    }

    return (
        <div className="register-page-container">
            {error && <h2 className="error-message">{error}</h2>}
            <div className="register-form-container">
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label>Username:</label>
                        <input type="text" name="username" required />
                    </div>
                    <div className="form-field">
                        <label>Fullname:</label>
                        <input type="text" name="fullname" required />
                    </div>
                    <div className="form-field">
                        <label>Email:</label>
                        <input type="email" name="email" required />
                    </div>
                    <div className="form-field">
                        <label>Password:</label>
                        <input type="password" name="password" required />
                    </div>
                    <button type="submit" className="form-submit-button">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;