import {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import '../styles/PostEditor.css';


function NewPost({error, setError}){
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [titleDescription, setTitleDescription] = useState('');
    const [tagId, setTagId] = useState(null);
    const [published, setPublished] = useState(false);
    const [img, setImg] = useState('');
    const [tags, setTags] = useState([]);
    const [success, setSuccess] = useState(false);

    useEffect( () => {
        
        if( tags.length == 0 ){
            fetchTags();
        }
        }, []);

    useEffect(() => {
        if(success){
            setSuccess(false);
        }
        
    }, [title, description, titleDescription, tagId, published, img, tags])

    async function fetchTags() {
        try{
            const response = await fetch('http://localhost:3000/posts/tags');
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


    async function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('title_heading', title);
        formData.append('file', img);  
        formData.append('title_description', titleDescription);
        formData.append('description', description);
        formData.append('tagId', tagId);
        formData.append('published', published);

        try{
            const response = await fetch(`http://localhost:3000/posts`,{
                method: 'POST',
                headers: {
                    'Authorization': token
                },
                body: formData
            });
            if (!response.ok) {
                throw new Error('Failed to update the post. Please try again.');
            }
    
            const json = await response.json();
            console.log(json);
            setSuccess('Correctly created');
            navigate('/admindashboard');
        }catch(error){
            setError(error.message)
        }
    }

    return(
      
        <div className="post-editor-container">
            {success && (<h2>{success}</h2>) }
                <form className="post-editor-form" onSubmit={handleSubmit}>
                    <label htmlFor="title_heading">Title Heading:</label>
                    <input
                        type="text"
                        id="title_heading"
                        name="title_heading"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                
                    <label htmlFor="file">Image:</label>
                    <input
                        type="file"
                        id="file"
                        name="file"
                        onChange={e => setImg(e.target.files[0])}  
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
                            value={tagId != null ? tagId : ''} 
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
        </div>
       
    
    )

}

export default NewPost;