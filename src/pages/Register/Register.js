import React from 'react';
import styles from './Register.module.css';
import { useState, useEffect } from 'react';
import { useAuthentication } from '../../hooks/useAuthentication';

const Register = () => {
   const [displayName, setDisplayName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [error, setError] = useState('');

   const { createUser, error: authError, loading } = useAuthentication();

   const handleSubmit = async e => {
      e.preventDefault();

      setError('');

      const user = {
         displayName,
         email,
         password
      };

      if (password !== confirmPassword) {
         setError('As senhas precisam ser iguais!');
         return;
      }

      const res = await createUser(user);

      console.log(res);
   };

   useEffect(() => {
      if (authError) {
         setError(authError);
      }
   }, [authError]);

   return (
      <div className={styles.register}>
         <h1>Cadastre-se para postar</h1>
         <p>Crie seu usuário e compartilhe suas histórias</p>
         <form onSubmit={handleSubmit} action="">
            <label htmlFor="">
               <span>Nome: </span>
               <input
                  type="text"
                  name="displayName"
                  id="name"
                  required
                  placeholder="Nome do usuário"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
               />
            </label>
            <label htmlFor="">
               <span>E-mail: </span>
               <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder="Email do usuário"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
               />
            </label>
            <label htmlFor="">
               <span>Senha: </span>
               <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  placeholder="Insira sua senha"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
               />
            </label>
            <label htmlFor="">
               <span>Confirmação de senha: </span>
               <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  required
                  placeholder="Confirme a sua senha"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
               />
            </label>
            {!loading && <button className="btn">Cadastrar</button>}
            {loading && (
               <button className="btn" disabled>
                  Aguarde...
               </button>
            )}
            {error && <p className="error">{error}</p>}
         </form>
      </div>
   );
};

export default Register;
