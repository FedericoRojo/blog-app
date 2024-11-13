import { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../styles/Header.css';

const Header = ({ loggedIn, setLoggedIn }) => {
    const navigate = useNavigate(); 

    async function handleLogOut() {
        localStorage.removeItem("token");
        setLoggedIn(null);
        navigate('/');
    }

    return (
        <header className="header">
            <div className="dropdown">
                <button className="dropbtn" aria-haspopup="true" aria-expanded="false">Dropdown</button>
                <div className="dropdown-content">
                    <button onClick={() => navigate('/register')}>Register</button>
                    { loggedIn != null && 
                        <>
                            <button onClick={() => navigate('/dashboard')}>UserDashboard</button>
                            { loggedIn == 1 && <button onClick={() => navigate('/admindashboard')}>AdminDashboard</button> }
                            <button onClick={handleLogOut}>Logout</button>
                        </>
                    }
                    { loggedIn == null &&
                        <button onClick={() => navigate('/login')}>Login</button>
                    }
                    <button onClick={() => navigate('/')}>Home</button>
                </div>
            </div>
            <div className='header-title'>
                <h1 className="title">My blog</h1>
                <h2>Welcome to Name's Blog</h2>
            </div>
        </header>
    );
};

export default Header;
