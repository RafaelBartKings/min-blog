import styles from './EditPost.module.css';

import { useState, useEffect } from 'react'; // Adicionado useEffect
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthValue } from '../../context/AuthContext';
import { useInsertDocument } from '../../hooks/useInsertDocument';
import { useFetchDocument } from '../../hooks/useFetchDocument';

const EditPost = () => {
   const { id } = useParams();
   const { document: post } = useFetchDocument('posts', id);

   const [title, setTitle] = useState('');
   const [image, setImage] = useState('');
   const [body, setBody] = useState('');
   const [tags, setTags] = useState('');
   const [formError, setFormError] = useState('');

   useEffect(() => {
      if (post) {
         setTitle(post.title);
         setBody(post.body);
         setImage(post.image);

         const textTags = (post.tags || []).join(', ');
         setTags(textTags);
      }
   }, [post]);

   const { user } = useAuthValue();
   const { insertDocument, response } = useInsertDocument('posts');
   const navigate = useNavigate();

   // 🚩 CORREÇÃO ESSENCIAL: Redireciona APENAS após o sucesso do Firebase

   const handleSubmit = e => {
      e.preventDefault();
      setFormError('');

      // 1. **CAMPOS VAZIOS**
      if (!title || !image || !body || !tags) {
         setFormError('Por favor, preencha todos os campos!');
         return;
      }

      // 2. **USUÁRIO AUTENTICADO**
      if (!user) {
         setFormError(
            'Erro: Usuário não autenticado. Tente fazer login novamente.'
         );
         return;
      }

      // 3. **VALIDAÇÃO DA URL**
      try {
         new URL(image);
      } catch (error) {
         setFormError('A imagem precisa ser uma URL válida.');
         return;
      }

      // Criar o array de tags e filtrar strings vazias
      const tagsArray = tags
         .split(',')
         .map(tag => tag.trim().toLowerCase())
         .filter(tag => tag.length > 0); // Garante que não insere tags vazias

      if (tagsArray.length === 0) {
         setFormError('Por favor, insira tags válidas.');
         return;
      }

      // 4. **INSERÇÃO DE DADOS**
      insertDocument({
         title,
         image,
         body,
         tags: tagsArray,
         uid: user.uid,
         createdBy: user.displayName,
         createdAt: new Date()
      });

      if (!response.error) {
         navigate('/');
      }
   };

   return (
      <div className={styles.edit_post}>
         {post && (
            <>
               <h2>Editando post: {post.title}</h2>
               <p>Altere os dados do post como desejar.</p>
               <form onSubmit={handleSubmit}>
                  <label>
                     <span>Título:</span>
                     <input
                        type="text"
                        name="title"
                        required
                        placeholder="Pense em um bom título..."
                        onChange={e => setTitle(e.target.value)}
                        value={title}
                     />
                  </label>
                  <label>
                     <span>URL da imagem:</span>
                     <input
                        type="text"
                        name="image"
                        required
                        placeholder="Insira a imagem que representa o seu post"
                        onChange={e => setImage(e.target.value)}
                        value={image}
                     />
                  </label>
                  <p className={styles.preview_title}>
                     Preview da imagem atual
                  </p>
                  <img
                     className={styles.image_preview}
                     src={post.image}
                     alt={post.title}
                  />
                  <label>
                     <span>Conteúdo:</span>
                     <textarea
                        name="body"
                        required
                        placeholder="Insira o conteúdo do post..."
                        onChange={e => setBody(e.target.value)}
                        value={body}
                     ></textarea>
                  </label>
                  <label>
                     <span>Tags:</span>
                     <input
                        type="text"
                        name="tags"
                        required
                        placeholder="Insira as tags separadas por vírgula"
                        onChange={e => setTags(e.target.value)}
                        value={tags}
                     />
                  </label>
                  {/* O response.error exibirá erros do Firebase (permissão, etc.) */}
                  {!response.loading && <button className="btn">Editar</button>}
                  {response.loading && (
                     <button className="btn" disabled>
                        Aguarde...
                     </button>
                  )}
                  {/* Exibe erro da validação local OU erro do Firebase */}
                  {(response.error || formError) && (
                     <p className="error">{response.error || formError}</p>
                  )}
               </form>
            </>
         )}
      </div>
   );
};

export default EditPost;
