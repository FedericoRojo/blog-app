import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

function LoginPage({error, setError, setLoggedIn}  ) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async(event) => {
        event.preventDefault();
        try{
            
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password})
            });

            if(!response.ok){
                throw new Error('Login failed');
            }
            
            const data = await response.json();
            
            localStorage.setItem('token', data.token);
            
            setLoggedIn(data.result);

            navigate('/');
        }catch(error){
            setError(error.message);
        }

    }

    return(
        <div className="login-page-container">
            {error && <h2 className="error-message">{error}</h2>}
            <div className="login-form-container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="form-submit-button">Log in</button>
                </form>
            </div>
        </div>
    )
}

export default LoginPage;