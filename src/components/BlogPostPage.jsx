import {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import '../styles/BlogPostPage.css';
import { jwtDecode } from 'jwt-decode';

const BlogPostPage = ({ error, setError, loggedIn }) => {
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [likes, setLikes] = useState(null);
    
    const [showForm, setShowForm] = useState(false);
    const [commentContent, setCommentContent] = useState('');
    const [userId, setUserId] = useState(null);
    const [alreadyLiked, setAlreadyLiked] = useState(false);

    const {id} = useParams();

    const token = localStorage.getItem('token');

    useEffect( ( ) => {
        if(token){
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.sub);
        }
    }, [token]);

    useEffect( () => {

    }, []);

    useEffect( () => {
        fetchPost();
        if(token != null){
            fetchComments();
            fetchLikes();
            fetchAlreadyLked();
        }
    }, []);


    const handleShowForm = () => setShowForm(prev => !prev);

    const handleSubmit = async(event) => {
        event.preventDefault();

        try{
            
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({content: commentContent})
            });
            
            if(!response.ok){
                throw new Error('Comment submition failed');
            }
            
            const data = await response.json();
            
            setCommentContent('');
            setShowForm(false);
            fetchComments();

        }catch(error){
            setError(error.message);
        }
    }

    const deleteLike = async () => {
        try{
            
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/${id}/likes`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });

            if(!response.ok){
                throw new Error('Netwoork response was not ok '+response.status);
            }

            const json = await response.json();
            
            setAlreadyLiked(false);
            fetchLikes();

        }catch(error){
            setError(error.message);
        }
    }

    const handleLike = async () => {
        try{
            
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/${id}/likes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });

            if(!response.ok){
                throw new Error('Netwoork response was not ok '+response.status);
            }

            const json = await response.json();
            
            setAlreadyLiked(true);
            fetchLikes();

        }catch(error){
            setError(error.message);
        }
    }

    const fetchAlreadyLked = async () => {
        try{
            
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/${id}/liked`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });

            if(!response.ok){
                throw new Error('Netwoork response was not ok '+response.status);
            }

            const json = await response.json();
            
            setAlreadyLiked( (json.result.length != 0 ));
        }catch(error){

            setError(error.message);

        }
    }

    const handleSave = async (commentId) => {
        try{
            
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/${id}/comments/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({content: commentContent})
            });
            
            if(!response.ok){
                throw new Error('Comment submition failed');
            }
            
            const data = await response.json();
            
            handleCancel();
            fetchComments();

        }catch(error){
            setError(error.message);
        }
    }

    const handleEdit = (id, content ) => {
        setEditingCommentId(id);
        setCommentContent(content);
    }

    const handleCancel = () => {
        setEditingCommentId(null);
        setCommentContent('');
    }

    const handleDelete = async (commentId) => {
        try{
            
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/${id}/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });
            
            if(!response.ok){
                
                throw new Error('Comment submition failed');
            }
            
            const data = await response.json();
            fetchComments();
            

        }catch(error){
            setError(error.message);
        }
    }

    async function fetchPost() {
        try{
            
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/${id}`);
            if(!response.ok){
                throw new Error('Netwoork response was not ok '+response.status);
            }
            const json = await response.json();
            setPost(json.result);
        }catch(error){
            setError(error.message);
        }
    }

    async function fetchComments() {
        try{
            
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/${id}/comments`, {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            });
            if(!response.ok){
                throw new Error('Netwoork response was not ok '+response.status);
            }
            const json = await response.json();
            setComments(json.result);
        }catch(error){
            setError(error.message);
        }
    }

        

    async function fetchLikes() {
        try{
            
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/${id}/likes`, {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            });
            if(!response.ok){
                throw new Error('Netwoork response was not ok '+response.status);
            }
            const json = await response.json();
            setLikes(json.result);
        }catch(error){
            setError(error.message);
        }
    }

    return (
        (post != null) && (
            <div className='blog-post-page-container' >
                    <div className='b-p-content'>
                        <h1>{post.title_heading}</h1>
                        <img src={post.img} alt={post.title_heading}></img>
                        <h3>{post.title_description}</h3>
                        <p>{post.description}</p>
                    </div>
                    <div className='b-p-comments'>
                        {token && (
                            <div className='create-comment-container'>
                                <button onClick={handleShowForm}>
                                    {showForm ? "Cancel" : "Create comment"}
                                </button>
                                {showForm && (
                                    <form onSubmit={handleSubmit}>
                                        <textarea 
                                            placeholder="Write your comment here..." 
                                            value={commentContent} 
                                            onChange={(e) => setCommentContent(e.target.value)} 
                                            required 
                                        />
                                        <button type="submit">Submit Comment</button>
                                    </form>
                                )}
                            </div>
                        )}


                        {( loggedIn && comments != null && comments.length != 0) ? (
                            comments.map( elem => (
                                <div className='comments-container' key={elem.id}>
                                    { editingCommentId == elem.id ? (
                                        <div>
                                            <textarea  
                                                value={commentContent} 
                                                onChange={(e) => setCommentContent(e.target.value)} 
                                                required 
                                            />
                                            <button onClick={() => handleSave(elem.id)}>Save</button>
                                            <button onClick={handleCancel}>Cancel</button>
                                        </div>
                                    ) : (
                                        <div className='comment-card-container'>
                                            <p>Username: {elem.username}</p>
                                            <p>{elem.content}</p>
                                            { elem.user_id == userId ? (
                                                <div className='comment-card-buttons'>
                                                <button onClick={() => handleEdit(elem.id, elem.content)}>Edit</button>
                                                <button onClick={() => handleDelete(elem.id)}>Delete</button>
                                                </div>
                                            ) : <></> }
                                        </div>
                                    ) }
                                    
                                </div>
                            ))
                        ) : ( 
                                loggedIn 
                                    ? ( <p>No comments</p> ) 
                                    : ( <p>Log in to see comments</p>)
                                
                            )
                        }
                    </div>
                    <div className='b-p-likes'>
                        { ( loggedIn != null && !alreadyLiked ) && (<button onClick={handleLike}>Like</button>) }
                        { ( loggedIn != null  && alreadyLiked ) && (<button onClick={deleteLike}>Undo Like</button>) }
                        {(loggedIn != null && likes != null && likes.length != 0) ? (
                            
                            likes.map( elem => (
                                <div className="likes-container" key={elem.id}>
                                    <p>{elem.username}</p>
                                </div>
                            ))
                            ) : ( 
                                loggedIn != null
                                    ? ( 
                                    <>
                                        <p>No likes</p>
                                    </> ) 
                                    : ( <p>Log in to see likes</p>)
                            )
                        }
                    </div>
            </div>
        )
    );
};

export default BlogPostPage;
