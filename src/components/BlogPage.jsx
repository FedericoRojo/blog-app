import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import FooterBlogPage from './FooterBlogPage';
import '../styles/BlogPage.css';


function BlogPage({ error, setError, loggedIn }){
    const navigate = useNavigate();


    const [blogPosts, setBlogPosts] = useState([]);
    const [tags, setTags] = useState([]);
    const [actualPage, setActualPage] = useState(0);
    const [limit, setLimit] = useState(2);

    const [totalCountPosts, setTotalCountPosts] = useState(0);
    const [limitPostsReached, setLimitPostsReached] = useState(false);
    const [fetchCount, setFetchCount] = useState(false);
    const [fetchDone, setFetchDone] = useState(false);
    const [filteredByTag, setFilteredByTag] = useState(null);
    const [resetFetch, setResetFetch] = useState(false);
    const [resetSearch, setResetSearch] = useState(false);

    const [personalInfo, setPersonalInfo] = useState(null);


    useEffect(() => {
       
        countTotalPosts();
        if (tags.length === 0) {
            fetchTags();
        }
    }, []);

    useEffect(() => {
        if(resetSearch){
            countTotalPosts();
            setResetSearch(false);
        }
    }, [resetSearch]);
    
    async function countTotalPosts() {
        if (filteredByTag == null) {
            await fetchTotalPostsCount();
        } else {
            await fetchTotalFilteredPostsCount(filteredByTag);
        }
        setFetchCount(true);
    }
    
    useEffect(() => {
        if (fetchCount) {
            if (filteredByTag == null) {
                fetchBlogPosts();
            } else {   
                fetchPostsByTag(filteredByTag);
            }
            fetchPersonalInfo();
            setFetchDone(true);
        }
    }, [fetchCount, actualPage]);
    
    useEffect(() => {   
        if (fetchDone) {
            checkLimitPostReached();
            setFetchDone(false);
        }
    }, [fetchDone]);


useEffect(() => {
    if (resetFetch) {
        console.log('aca');
        setActualPage(0);
        setTotalCountPosts(0);
        setFetchCount(false);
        setFetchDone(false);
        setFilteredByTag(null);
        setLimitPostsReached(false);

        setResetFetch(false); 
        setResetSearch(true);
    }
}, [resetFetch]);


    function checkLimitPostReached(){
        if( actualPage + limit >= totalCountPosts ){
            setLimitPostsReached(true);
        }
    }
    
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

    async function fetchTotalPostsCount() {
        try{
            
        const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/getCount`, {
            method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
        });
        
        if (!response.ok) {
            throw new Error(response.status);
        }else{
            const json = await response.json();
        
            setTotalCountPosts(json.totalCount);
            if( actualPage + limit > json.totalCount ){
                setLimitPostsReached(true);
            }
        }
        }catch(error){
            setError(error.message);
        }
    }

    async function fetchTotalFilteredPostsCount(tag){
        try{
            
            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/${tag.id}/getCount`);
            
            if (!response.ok) {
                throw new Error(response.status);
            }else{
                const json = await response.json();
                setTotalCountPosts(json.totalCount);
                if( actualPage + limit > json.totalCount ){
                    setLimitPostsReached(true);   
                }
            }
            }catch(error){
                setError(error.message);
        }
    }

    const fetchBlogPosts = async () => {
        try{
            
            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/posts?limit=${limit}&offset=${actualPage}`);
            
            if (!response.ok) {
                const errorData = await response.json(); 
                
                if (response.status === 400) {
                    
                    setLimitPostsReached(true);
                    setActualPage(actualPage - limit); // Go back if we exceed the number of posts
                   
                }else{
                    setError(errorData.error || 'Network response was not ok ' + response.status);
                }
            }else{
                const json = await response.json();
                setBlogPosts(json.result);
            }
        }catch(error){
            setError(error.message);
        }
    }

    const fetchTags = async () => {
        try{
            
            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/tags`);
            if(!response.ok){
                throw new Error('Netwoork response was not ok '+response.status);
            }
            const json = await response.json();
            
            setTags(json.result);
        }catch(error){
            setError(error.message);
        }
    }
    
    async function fetchPostsByTag(tag) {
        try{
            
            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/search/${tag.id}?limit=${limit}&offset=${actualPage}`);
            if(!response.ok){
                throw new Error('Netwoork response was not ok '+response.status);
            }
            const json = await response.json();
            setBlogPosts(json.result);
        }catch(error){
            setError(error.message);
        }
    }

    function handleRemoveSearchByTag(){
        setResetFetch(true);
    }

    function handeSearchByTag(elem) {
        setActualPage(0);
        setTotalCountPosts(0);
        setFetchCount(false);
        setFetchDone(false);
        setLimitPostsReached(false);

        setFilteredByTag(elem);
        setResetSearch(true);
    }

    
    return(
        <>
        <div className='blog-page-container'>
            <div className='blog-page-content'>
                {filteredByTag != null && 
                    <div className='blog-page-filter-container'>
                        Filtered by tag: {filteredByTag.title}
                        <button onClick={handleRemoveSearchByTag}>Remove filter</button>
                    </div>
                }
                {blogPosts.map( elem => {
                    return(<div className='blog-card' key={elem.id}>
                                <img src={elem.img} alt={elem.title_heading}></img>
                                <div className='blog-card-content'>
                                    <div className='blog-card-content-main'>
                                        <h1>{elem.title_heading}</h1>
                                        <h4>{elem.title_description}, {elem.timestamp_creation}</h4>
                                        <p>{elem.description}</p>
                                    </div>
                                    <div className='blog-card-content-footer'>
                                        <button onClick={() => navigate(`/posts/${elem.id}`)}>Read More</button>
                                        <span>Comments ({elem.amountcomments})</span>
                                    </div>
                                </div>
                            </div>)
                })}
            </div>
            <div className='blog-page-aux-content'>
                <div className='personal-card'>
                    {personalInfo != null && (
                        <>
                            <img src={personalInfo.img} alt='Personal info image'></img>
                            <div className='personal-card-description'>
                                <h2>{personalInfo.fullname}</h2>
                                <p>{personalInfo.description}</p>
                            </div>
                        </>
                    )}
                    
                </div>
                <div className='tags-container'>
                    <div className='tags-container-title'>
                        <h4>Tags</h4>
                    </div>
                    <div className='tags-content'>
                        { tags.map( elem => {
                            return (<span key={elem.id} onClick={() => handeSearchByTag(elem)}>{elem.title}</span>)
                        })}
                    </div>
                </div>
            </div>
        </div>
        <FooterBlogPage actualPage={actualPage} setActualPage={setActualPage} limit={limit} 
                limitPostsReached={limitPostsReached} setLimitPostsReached={setLimitPostsReached} 
                totalCountPosts={totalCountPosts} />
        </>
    )

}

export default BlogPage;