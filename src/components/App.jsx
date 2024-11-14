import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import '../styles/App.css';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import isAuthenticated from '../lib/isAuthenticated';
import BlogPage from './BlogPage'
import Header from './Header';
import Footer from './Footer';
import BlogPostPage from './BlogPostPage'
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';
import PostEditor from './PostEditor.jsx';
import NewPost from './NewPost.jsx';




function App() {
    const [loggedIn, setLoggedIn] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
      const checkAuth = async () => {
          const isAuthenticatedUser = await isAuthenticated();
          setLoggedIn(isAuthenticatedUser);
      };
      checkAuth();
  }, []);

    return (
        <Router>
            <Routes>
              <Route path="/" element={<BlogLayout error={error} setError={setError} setLoggedIn={setLoggedIn} loggedIn={loggedIn}/>} />

              <Route element={<MainLayout error={error} setError={setError} setLoggedIn={setLoggedIn} loggedIn={loggedIn}/>}>
                  <Route path="/register" element={<RegisterPage error={error} setError={setError} />} />
                  <Route path="/login" element={<LoginPage error={error} setError={setError} setLoggedIn={setLoggedIn}/>} />
                  <Route path="/posts/:id" element={<BlogPostPage error={error} setError={setError} loggedIn={loggedIn} /> }/>
                  <Route path="/dashboard" element={<UserDashboard error={error} setError={setError}/>}></Route>
                  <Route path="/admindashboard" element={<AdminDashboard error={error} setError={setError} setLoggedIn={setLoggedIn} loggedIn={loggedIn} />}></Route>
                  <Route path="/post/edit/:id" element={<PostEditor error={error} setError={setError}/>}></Route>
                  <Route path="/post/new" element={<NewPost error={error} setError={setError}  />}></Route>
              </Route>
            </Routes>
        </Router>
    )
 
}

function BlogLayout({error, setError, setLoggedIn, loggedIn}) {
  return (
    <>
      <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
      <BlogPage error={error} setError={setError} loggedIn={loggedIn} />
    </>
  );
}

function MainLayout({error, setError, setLoggedIn, loggedIn}) {
  return (
    <>
      <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
