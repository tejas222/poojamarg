import { createContext, useContext, useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [pooja, setPooja] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const fetchCategories = async () => {
    try {
      const snapshot = await firestore()
        .collection('categories')
        .orderBy('createdAt', 'desc')
        .get();

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(data);
    } catch (error) {
      console.log('Error fetching categories', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchPooja = async () => {
    try {
      const snapshot = await firestore()
        .collection('pooja')
        .orderBy('createdAt', 'desc')
        .get();

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPooja(data);
    } catch (error) {
      console.log('Error fetching categories', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchPooja();
  }, []);
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        categories,
        loadingCategories,
        refreshCategories: fetchCategories,
        pooja,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
