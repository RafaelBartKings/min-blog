import styles from './Search.module.css';

import React from 'react';
import { useFetchDocuments } from '../../hooks/useFetchDocuments';
import { useQuery } from '../../hooks/useQuery';

import PostDetail from '../../components/PostDetail';
import { Link } from 'react-router-dom';

const Search = () => {
   const query = useQuery();
   const search = query.get('q');

   const { documents: posts } = useFetchDocuments('posts', search);

   return (
      <div className={styles.search_container}>
         <h1>Search</h1>
         <div>
            {posts && posts.length === 0 && (
               <div className={styles.noposts}>
                  <p>Não foram incontrados posts a partir de sua busca...</p>
                  <Link to="/" className="btn btn-dark">
                     Voltar
                  </Link>
               </div>
            )}
            {posts &&
               posts.map(post => <PostDetail key={post.id} post={post} />)}
         </div>
      </div>
   );
};

export default Search;
