import {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import '../styles/PostEditor.css';


function PostEditor({error, setError}){
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const {id} = useParams();
    const [post, setPost] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [titleDescription, setTitleDescription] = useState('');
    const [tagId, setTagId] = useState(null);
    const [published, setPublished] = useState(false);
    const [img, setImg] = useState('');
    const [newImg, setNewImg] = useState(null);
    const [tags, setTags] = useState([]);
    const [success, setSuccess] = useState(false);

    useEffect( () => {
        if(post == null){
            fetchPost();
        }
        if( tags.length == 0 ){
            fetchTags();
        }
        }, []);
    useEffect(() => {
        if(success){
            setSuccess(false);
        }
        
    }, [id, post, title, description, titleDescription, tagId, published, img, tags])

    async function fetchPost(){
        try{
            
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/${id}`);
            if(!response.ok){
                setError(response.status);
            }else{
                const json = await response.json();
                console.log(json);
                setPost(json.result);
                setTitle(json.result.title_heading);
                setImg(json.result.img);
                setDescription(json.result.description);
                setTitleDescription(json.result.title_description);
                setPublished(json.result.published);
                setTagId(json.result.tag);
            }
        }catch(error){
            setError(error.message);
        }
    }

    async function fetchTags() {
        try{
            
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/tags`);
            if(!response.ok){
                setError(response.status);
            }else{
                const json = await response.json();
                console.log(json);
                setTags(json.result);
            }
        }catch(error){
            setError(error.message);
        }
    }


    async function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData();
        formData.append('title_heading', title);
        formData.append('file', newImg);  
        formData.append('title_description', titleDescription);
        formData.append('description', description);
        formData.append('tagId', tagId);
        formData.append('published', published);

        try{
            
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/${id}`,{
                method: 'PUT',
                headers: {
                    'Authorization': token
                },
                body: formData
            });
            if (!response.ok) {
                throw new Error('Failed to update the post. Please try again.');
            }
    
            const json = await response.json();

            setImg(json.result);
            setSuccess('Correctly updated');
            navigate('/admindashboard');
            
        }catch(error){
            setError(error.message)
        }
    }

    return(
        <div className="post-editor-container">
            {success && (<h2>{success}</h2>) }
            {post != null && (
                <form className="post-editor-form" onSubmit={handleSubmit}>
                    <label htmlFor="title_heading">Title Heading:</label>
                    <input
                        type="text"
                        id="title_heading"
                        name="title_heading"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                

                    {img && <img src={img} alt="Current" width="100" />}
                    <label htmlFor="file">Image:</label>
                    <input
                        type="file"
                        id="file"
                        name="file"
                        onChange={e => setNewImg(e.target.files[0])}  
                    />
                
                    <label htmlFor="title_description">Title Description:</label>
                    <input
                        type="text"
                        id="title_description"
                        name="title_description"
                        value={titleDescription}
                        onChange={e => setTitleDescription(e.target.value)}
                    />
                
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />

                    <label className="toggle-label">
                            Published:
                            <input
                                type="checkbox"
                                id="published"
                                name="published"
                                checked={published}
                                onChange={(e) => setPublished(e.target.checked)}
                            />
                            <span className="slider"></span>
                    </label>

                    <label htmlFor="Tag">Tag:</label>
                    <select id="tag" name="tag" 
                            value={tagId} 
                            onChange={(e) => setTagId(e.target.value)}>
                        <option value="">Select a tag</option> 
                        {   (tags != null) && 
                            tags.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.title}
                            </option>
                        ))}
                    </select>
                
                    <button type="submit">Save</button>
                </form>
            ) }
        </div>
       
    
    )

}

export default PostEditor;