import { Link } from 'react-router-dom';
import styles from './PostDetail.module.css';

import React from 'react';

const PostDetail = ({ post }) => {
    return (
        // APLIQUE A CLASSE AQUI
        <div className={styles.post_detail}> 
            <img src={post.image} alt={post.title} />
            <h2>{post.title}</h2>
            <p>{post.createdBy}</p>
            <div className={styles.tags}> {/* Boa prática: dar uma classe às tags */}
                {post.tags.map(tag => (
                    <p key={tag} className={styles.tag_item}>
                        <span>#</span>
                        {tag}
                    </p>
                ))}
            </div>
            <Link to={`/posts/${post.id}`} className="btn btn-outline">Ler</Link>
        </div>
    );
};

export default PostDetail;