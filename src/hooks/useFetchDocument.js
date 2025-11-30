import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export const useFetchDocument = (docCollection, id) => {
   const [document, setDocument] = useState(null);
   const [error, setError] = useState(null);
   const [loading, setLoading] = useState(null);

   const [cancelled, setCancelled] = useState(false);

   useEffect(() => {
      async function loadDocument() {
         if (cancelled) return;

         setLoading(true);

         try {
            const docRef = doc(db, docCollection, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
               setDocument(docSnap.data());
            } else {
               setError('Documento não encontrado!');
            }

            setLoading(false);
         } catch (error) {
            console.log(error);
            setError(error.message);

            setLoading(true);
         }
      }

      loadDocument();
   }, [cancelled, docCollection, id]);

   useEffect(() => {
      return () => setCancelled(true);
   }, []);

   return { document, loading, error };
};
