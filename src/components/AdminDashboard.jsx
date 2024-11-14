import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

import '../styles/AdminDashboard.css';


function AdminDashboard({error, setError, setLoggedIn, loggedIn}){
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const [totalCountPosts, setTotalCountPosts] = useState(0);
    const [posts, setPosts] = useState([]);
    const [limit, setLimit] = useState(8);
    const [offset, setOffset] = useState(0);
    const [limitReached, setLimitReachead] = useState(false);
    const [tags, setTags] = useState([]);

    const [deletedPost, setDeletedPost] = useState(false);
    const [deletedTag, setDeletedTag] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [tagId, setTagId] = useState('');
    const [tagCreated, setTagCreated] = useState(false);
    const [showEditingForm, setShowEditingForm] = useState(false);
    const [tagContent, setTagContent] = useState('');

    const [personalInfo, setPersonalInfo] = useState(null);
    const [fullname, setFullName] = useState('');
    const [description, setDescription] = useState('');
    const [img, setImg] = useState('');
    const [newImg, setNewImg] = useState(null);
    const [showPersonalForm, setShowPersonalForm] = useState(false);
    const [showEditingPersonalForm, setShowEditingPersonalForm] = useState(false);
    const [personalInfoCreated, setPersonalInfoCreated] = useState(false);

    useEffect(() => {
        if(loggedIn != null){
            fetchPosts();
            fetchPersonalInfo();
        }else{
            console.log(loggedIn);
        }
    },[]);

    useEffect(() => {
        fetchPosts();
        checkLimitReached();
        if(deletedPost){
            setDeletedPost(false);
        }
        
    }, [offset, deletedPost])

    useEffect(() => {
        if(loggedIn != null){
            fetchTags();
            if(tagCreated){
                setTagCreated(false);
            }
            if(deletedTag){
                setDeletedTag(false);
            }
        }
    }, [tagCreated, deletedTag])


    useEffect(() => {
        if(personalInfoCreated){
            setPersonalInfoCreated(false);
            fetchPersonalInfo();
        }
    },[personalInfoCreated]);

    useEffect(() => {
        return () => {
            if (img) {
                URL.revokeObjectURL(img);
            }
        };
    }, [img]);
    

    async function fetchPersonalInfo() {
        try{
            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/users/personal-info`);
            if(!response.ok){
                setError(response.status);
            }else{
                const json = await response.json();
                setPersonalInfo(json.result);
            }
        }catch(error){
            setError(error.message);
        }
    }

    async function fetchTags() {
        try{
            
            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/tags`);
            if(!response.ok){
                setError(response.status);
            }else{
                const json = await response.json();
                setTags(json.result);
            }
        }catch(error){
            setError(error.message);
        }
    }

    

    async function fetchPosts() {
        try{
            
            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/admin/posts?limit=${limit}&offset=${offset}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });

            if(!response.ok){
                setError(response.status);
            }else{
                const json = await response.json();
                setTotalCountPosts(json.totalCount);
                setPosts(json.result);
            }
        }catch(error){
            setError(error.message);
        }
    }

    async function handleDelete(id){
        console.log(id);
        try{
            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/${id}`, {
                method: "DELETE",
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': token
                }
            });
            if(!response.ok){
                setError(response.status);
            }else{
                const json = await response.json();
                
                setDeletedPost(true);
            }
        }catch(error){
            setError(error.message)
        }
    }

    async function handleSubmitTagForm(e){
        e.preventDefault();
        try{
            
            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/tags`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({title: tagContent})
            });
            if(!response.ok){
                setError(response.status);
            }else{
                const json = await response.json();
                setTagCreated(true);
                setTagContent('');
                setShowForm(false);
            }
        }catch(error){
            setError(error.message)
        }
    }

    async function handleSubmitEditTagForm(e) {
        e.preventDefault();
        const id = tagId;
        try{
            
            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/tags/${id}`, {
                method: "PUT",
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({title: tagContent})
            });
            if(!response.ok){
                setError(response.status);
            }else{
                const json = await response.json();
                setTagCreated(true);
                setTagId('');
                setTagContent('');
                setShowEditingForm(false);
            }
        }catch(error){
            setError(error.message)
        }
    }

    function checkLimitReached(){
        if(offset + limit > totalCountPosts){
            setLimitReachead(true);
        }
    }

    function handleNext(){
        if(offset + limit <= totalCountPosts){
            setOffset(offset+limit);
        }
    }

    function handlePrev(){
        if(offset-limit > 0){
            setOffset(offset-limit);
            setLimitReachead(false);
        }
    }

    function handleShowForm(){
        if( showEditingForm == false){
            setShowForm(prevState => !prevState);
        }else{
            setShowEditingForm(false);
        }
    }

    async function handleDeleteTag(id) {
        try{
            
            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/tags/${id}`, {
                method: "DELETE",
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': token
                }
            });
            if(!response.ok){
                const rjson = await response.json();
                setError(rjson.error);
            }else{
                const json = await response.json();
                setDeletedTag(true);
            }
        }catch(error){
            
            setError(error.message)
        }
    }

    function handleEditTag(id, content) {
        setTagId(id);
        setTagContent(content);
        setShowEditingForm(true);
    }

    async function handleSubmitPersonalForm(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('fullname', fullname);
        formData.append('description', description);  
        formData.append('file', newImg);

        try{
            
            const response = await fetch( `${import.meta.env.VITE_APP_API_BASE_URL}/posts/tags/${id}`, {
                method: "POST",
                headers: {
                    'Authorization': token
                },
                body: formData
            });
            if(!response.ok){
                setError(response.status);
            }else{
                const json = await response.json();
                setPersonalInfoCreated(true);
                setFullName('');
                setNewImg(null);
                setDescription('');
                setShowPersonalForm(false);
            }
        }catch(error){
            setError(error.message)
        }
    }

    async function handleSubmitEditPersonalForm(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('fullname', fullname);
        formData.append('description', description);  
        formData.append('file', newImg);

        try{
            
            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/users/personal-info`, {
                method: "PUT",
                headers: {
                    'Authorization': token
                },
                body: formData
            });
            if(!response.ok){
                setError(response.status);
            }else{
                const json = await response.json();
                setPersonalInfoCreated(true);
                setFullName('');
                setNewImg(null);
                setDescription('');
                setShowEditingPersonalForm(false);
            }
        }catch(error){
            setError(error.message)
        }
    }

    function handleShowPersonalForm(){
        setShowPersonalForm(prevState => !prevState);
    }

    function handleShowEditingPersonalForm(){
        setShowEditingPersonalForm(prevState => !prevState);
        setFullName(personalInfo.fullname);
        setDescription(personalInfo.description);
        setImg(personalInfo.img);
    }

    return(
        <div className='admindash-container'>
            { ( loggedIn != null ) && (
            <>
                { error && <p>{error}</p>}
                <div className='a-posts-container'>
                    <div>
                        <h2>Posts</h2>
                        <button onClick={() => navigate('/post/new')}>Create Post</button>
                        <div className='a-posts-content'>
                            { (posts != null && posts.length > 0) && (
                                posts.map( elem => {
                                    return (
                                        <div className='a-post-card' key={elem.id}>
                                            <img src={elem.img} alt={elem.heading_description}></img>
                                            <div className='a-post-card-btns'>
                                                <button onClick={() => navigate(`/post/edit/${elem.id}`)}>Edit</button>
                                                <button onClick={() => handleDelete(elem.id)}>Delete</button>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                    <div className='a-posts-buttons'>
                        <button disabled={limitReached} onClick={handleNext}>Next</button>
                        <button disabled={offset - limit < 0} onClick={handlePrev}>Prev</button>
                    </div>
                </div>
                <div className='a-tags-container'>
                    <h2>Tags</h2>
                    <div className='create-tag-container'>
                            <button className='handle-show-btn' onClick={handleShowForm}>
                                {showForm || showEditingForm ? "Cancel" : "Create tag"}
                            </button>
                            { (showEditingForm) ? (
                                        <form className='admin-form' onSubmit={handleSubmitEditTagForm}>
                                            <label htmlFor="tagvalue">Tag:</label>
                                            <input
                                                type="text"
                                                id="tagvalue"
                                                name="tagvalue"
                                                value={tagContent}
                                                onChange={e => setTagContent(e.target.value)}
                                            />
                                            <button type="submit">Submit</button>
                                        </form>
                                ) : (
                                    (showForm) ? (
                                        <form className='admin-form' onSubmit={handleSubmitTagForm}>
                                            <label htmlFor="tagvalue">Tag:</label>
                                            <input
                                                type="text"
                                                id="tagvalue"
                                                name="tagvalue"
                                                value={tagContent}
                                                onChange={e => setTagContent(e.target.value)}
                                            />
                                            <button type="submit">Submit</button>
                                        </form>
                                    ) : (<></>)
                                )
                            }
                    </div>
                        <div className='tags-container-admin'>
                            { tags.map( elem => {
                                return (
                                <div className='tag-content' key={elem.id}>
                                    <span >{elem.title}</span>
                                    <div className='a-tags-buttons'>
                                        <button onClick={() => handleEditTag(elem.id, elem.title)}>Edit</button>
                                        <button onClick={() => handleDeleteTag(elem.id)}>Delete</button>
                                    </div>
                                </div>
                                )
                            })}
                        </div>
                </div>
                <div className='a-personal-description-container'>
                        {personalInfo == null ? (
                            <button className='show-form-button' onClick={handleShowPersonalForm}>
                                {showPersonalForm ? "Cancel" : "Create personal description"}
                            </button>
                        ): (
                            <button  className='show-form-button' onClick={handleShowEditingPersonalForm}>
                                {showEditingPersonalForm ? "Cancel" : "Edit personal description"}
                            </button>
                        )}
                        
                        { (showEditingPersonalForm) ? (
                                        <form className='admin-form' onSubmit={handleSubmitEditPersonalForm}>
                                            <label htmlFor="fullname">FullName:</label>
                                            <input
                                                type="text"
                                                id="fullname"
                                                name="fullname"
                                                value={fullname}
                                                onChange={e => setFullName(e.target.value)}
                                            />
                                            
                                            {img && <img src={img} alt="Current" width="400" />}
                                            <label htmlFor="file">Image:</label>
                                            <input
                                                type="file"
                                                id="file"
                                                name="file"
                                                onChange={(e) => {
                                                    setNewImg(e.target.files[0]);
                                                    setImg(URL.createObjectURL(e.target.files[0]));
                                                }}  
                                            />
                                            <label htmlFor="description">Description:</label>
                                            <textarea
                                                id="description"
                                                name="description"
                                                value={description}
                                                onChange={e => setDescription(e.target.value)}
                                            />
                                            <button type="submit">Submit</button>
                                        </form>
                                ) : (
                                    (showPersonalForm) ? (
                                        <form className='admin-form' onSubmit={handleSubmitPersonalForm}>
                                            <label htmlFor="fullname">FullName:</label>
                                            <input
                                                type="text"
                                                id="fullname"
                                                name="fullname"
                                                value={fullname}
                                                onChange={e => setFullName(e.target.value)}
                                            />
                                        
                                            {img && <img src={img} alt="Current" width="400" />}
                                            <label htmlFor="file">Image:</label>
                                            <input
                                                type="file"
                                                id="file"
                                                name="file"
                                                onChange={(e) => {
                                                    setNewImg(e.target.files[0]);
                                                    setImg(URL.createObjectURL(e.target.files[0]));
                                                }}  
                                            />

                                            <label htmlFor="description">Description:</label>
                                            <textarea
                                                id="description"
                                                name="description"
                                                value={description}
                                                onChange={e => setDescription(e.target.value)}
                                            />
                                            <button type="submit">Submit</button>
                                        </form>
                                    ) : (<></>)
                                )
                            }
                        <div className='a-personal-content'>
                            { personalInfo != null && (
                                <>
                                <img src={personalInfo.img} alt={'Personal info img'} width="400" ></img>
                                <h2>{personalInfo.fullname}</h2>
                                <p>{personalInfo.description}</p>
                                </>
                            )}
                        </div>
                </div>
            </>)}

        </div>
    )

}

export default AdminDashboard;