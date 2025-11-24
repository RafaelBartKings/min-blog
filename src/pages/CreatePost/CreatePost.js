import styles from './CreatePost.module.css';

import { useState, useEffect } from 'react'; // Adicionado useEffect
import { useNavigate } from 'react-router-dom';
import { useAuthValue } from '../../context/AuthContext';
import { useInsertDocument } from '../../hooks/useInsertDocument';

const CreatePost = () => {
   const [title, setTitle] = useState('');
   const [image, setImage] = useState('');
   const [body, setBody] = useState('');
   const [tags, setTags] = useState('');
   const [formError, setFormError] = useState('');

   const { user } = useAuthValue();
   const { insertDocument, response } = useInsertDocument('posts');
   const navigate = useNavigate();

   // 🚩 CORREÇÃO ESSENCIAL: Redireciona APENAS após o sucesso do Firebase
   useEffect(() => {
      // Verifica se a operação não está mais carregando E não há erro
      // O response.payload aqui representa o documento inserido
      if (response.payload && !response.loading && !response.error) {
         navigate('/');
      }
   }, [response, navigate]);

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
         createdBy: user.displayName
      });

      // 🚩 LINHA REMOVIDA: navigate('/') foi movido para o useEffect
   };

   return (
      <div className={styles.create_post}>
         <h2>Criar Post</h2>
         <p>Escreva o que quiser e compartilhe o seu conhecimento.</p>
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
            {!response.loading && <button className="btn">Cadastrar</button>}
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
      </div>
   );
};

export default CreatePost;
