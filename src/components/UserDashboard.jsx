import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import '../styles/UserDashboard.css';


function UserDashboard({error, setError}){
    const navigate = useNavigate();
    const [comments, setComments] = useState(null);
    const [likes, setLikes] = useState(null);
    const [content, setContent] = useState('');
    const [editCommentId, setEditCommentId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(null);
    const [deleteTimeoutId, setDeleteTimeoutId] = useState(null);
    const [isLikeDeleting, setIsLikeDeleting] = useState(null);
    const [likeDeleteTimeoutId, setLikeDeleteTimeoutId] = useState(null);

    const token = localStorage.getItem('token');

    useEffect( () => {
        fetchComments();
        fetchLikes();
    }, []);
   
    async function fetchComments(){
        try{
            
            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/comments/user`, {
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

    function handleEdit(id, content){
        setEditCommentId(id);
        setContent(content);
    }

    function handleCancel(){
        setEditCommentId(null);
        setContent('');
    }

    async function handleSave(cId, pId){
        try{
            
            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/${pId}/comments/${cId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({content: content})
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

    async function handleDelete(commentId, postId){
        setIsDeleting(true);

        const timeoutId = setTimeout( () => {
            deleteComment(commentId, postId);
            setIsDeleting(false);
        }, 3000);

        setDeleteTimeoutId(timeoutId);
    }

    function handleUndoDelete(){
        clearTimeout(deleteTimeoutId);
        setIsDeleting(false);
    }

    async function deleteComment(commentId, postId) {
        try{
            
            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/${postId}/comments/${commentId}`, {
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

    async function fetchLikes() {
        try{
            
            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/likes/user`, {
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

    function handleLikeDelete(likeId, postId){
        setIsLikeDeleting(true);

        const timeoutId = setTimeout( () => {
            deleteLike(likeId, postId);
            setIsLikeDeleting(false);
        }, 3000);

        setLikeDeleteTimeoutId(timeoutId);
    }

    function handleUndoLikeDelete(){
        clearTimeout(likeDeleteTimeoutId);
        setLikeDeleteTimeoutId(null);
        setIsLikeDeleting(false);
    }

    async function deleteLike(postId){
        try{
            
            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/${postId}/likes`, {
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
            fetchLikes();
        }catch(error){
            setError(error.message);
        }
    }



    return(
        <div className='user-dashboard-container'>
            { comments != null && 
                <div className='user-comments-container'>
                <h2>Comments</h2>
                { comments.map(elem => { 
                    return( <div className='user-comments-card' key={elem.commentid}>
                                        <img 
                                            src={elem.img} 
                                            alt={elem.title_heading}
                                            onClick={() => navigate(`/posts/${elem.post_id}`)} ></img>
                                        { (  elem.commentid == editCommentId ) ? (
                                                    <>
                                                        <textarea
                                                            className='user-textarea'  
                                                            value={content} 
                                                            onChange={(e) => setContent(e.target.value)} 
                                                            required 
                                                        />
                                                        <div className='user-comments-card-buttons'>
                                                            <button className="user-button" onClick={() => handleSave(elem.commentid, elem.post_id)}>Save</button>
                                                            <button className="user-button" onClick={handleCancel}>Cancel</button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                    <div className='user-comments-card-content'>
                                                        <p>{elem.content}</p>
                                                        <div className='user-comments-card-buttons'>
                                                            <button className="user-button" onClick={() => handleEdit(elem.commentid, elem.content)}>Edit</button>
                                                            <button className="user-button" onClick={() => handleDelete(elem.commentid,  elem.post_id)}>Delete</button>
                                                        </div>
                                                    </div>
                                                    {isDeleting && (
                                                            <div className="undo-delete-message">
                                                                <p>Comment will be deleted in 3 seconds.</p>
                                                                <button className="user-button" onClick={handleUndoDelete}>Undo</button>
                                                            </div>
                                                    )}
                                                    </>
                                        )}
                            </div>);
                })}
                </div>
            }
            { likes != null && (
                <div className='user-likes-container'>
                    <h2>Likes</h2>
                    {likes.map( elem => {
                        return(
                            <div key={elem.id}>
                                <img
                                 src={elem.img} 
                                 alt={elem.title_heading}
                                 onClick={() => navigate(`/posts/${elem.post_id}`)}
                                ></img>
                                <div>
                                    <button className="user-button" onClick={() => handleLikeDelete(elem.id,  elem.post_id)}>Delete</button>    
                                </div>
                                {isLikeDeleting && (
                                            <div className="undo-delete-message">
                                                <p>Like will be deleted in 3 seconds.</p>
                                                <button onClick={handleUndoLikeDelete}>Undo</button>
                                            </div>
                                )}    
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )

}

export default UserDashboard;