import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import {
   collection,
   query,
   orderBy,
   onSnapshot,
   where
} from 'firebase/firestore';

export const useFetchDocuments = (docCollection, search = null, uid = null) => {
   const [documents, setDocuments] = useState(null);
   const [error, setError] = useState(null);
   const [loading, setLoading] = useState(null);

   const [cancelled, setCancelled] = useState(false);

   useEffect(() => {
      async function loadData() {
         if (cancelled) return;

         setLoading(true);
         const collectionRef = collection(db, docCollection);

         try {
            let q;
            if (search) {
               q = query(
                  collectionRef,
                  where('tags', 'array-contains', search),
                  orderBy('createdAt', 'desc')
               );
            } else {
               q = query(collectionRef, orderBy('createdAt', 'desc'));
            }

            const unsubscribe = onSnapshot(
               q,
               querySnapshot => {
                  setDocuments(
                     querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                     }))
                  );
                  setLoading(false); // Defina o loading=false DENTRO do onSnapshot (sucesso)
                  setError(null);
               },
               error => {
                  // Adicione um handler de erro para onSnapshot
                  console.log(error);
                  setError(error.message);
                  setLoading(false);
                  setDocuments(null);
               }
            );

            // Retorna a função de unsubscribe como cleanup, se o componente desmontar antes do onSnapshot
            return () => unsubscribe();
         } catch (error) {
            console.log(error);
            setError('Erro ao carregar dados: ' + error.message);
            setLoading(false);
            setDocuments(null);
         }
      }

      loadData();
   }, [docCollection, documents, search, uid, cancelled]);

   useEffect(() => {
      return () => setCancelled(true);
   }, []);

   return { documents, loading, error };
};
