import React from 'react';
import '../styles/Footer.css';

const FooterBloPage = ({actualPage, setActualPage, limit, limitPostsReached, setLimitPostsReached, totalCountPosts}) => {

    const nextPage = () => {
        setActualPage(actualPage + limit);
    }

    const prevPage = () => {
        if(limitPostsReached){
            setLimitPostsReached(false);
        }
        if( actualPage - limit >= 0){
            setActualPage(actualPage-limit);
        }
    }

    return (
        <footer className="footer">
            <div className='footer-btn-container'>
                <button disabled={ (actualPage - limit < 0) ? true : false} onClick={prevPage}>{'Prev'}</button>
                <button disabled={limitPostsReached} onClick={nextPage}>{'Next'}</button>
            </div>
            <h3>Created by Federico Rojo</h3>
        </footer>
    );
};

export default FooterBloPage;
