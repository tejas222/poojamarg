import { createContext, useContext, useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [pooja, setPooja] = useState([]);
  const [poojaPrice, setPoojaPrice] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [userBookings, setUserBookings] = useState([]);
  const [muhurtRequest, setMuhurtRequest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allPoojaBookings, setAllPoojaBookings] = useState([]);
  const [allMuhurtBookings, setAllMuhurtBookings] = useState([]);
  const [allKundaliBookings, setAllKundaliBookings] = useState([]);

  useEffect(() => {
    const unsubscribers = [];

    const unsubscribeAuth = auth().onAuthStateChanged(u => {
      setUser(u);

      // Clear state on logout
      if (!u) {
        setUserBookings([]);
        setMuhurtRequest([]);
        setLoading(false);
        return;
      }

      // 🔁 User-specific pooja bookings
      const unsubUserPooja = firestore()
        .collection('poojaBookings')
        .where('userId', '==', u.uid)
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
          if (snapshot?.docs) {
            const data = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setUserBookings(data);
            setLoading(false);
          }
        });
      unsubscribers.push(unsubUserPooja);

      // 🔁 User-specific muhurt requests
      const unsubUserMuhurt = firestore()
        .collection('muhurtRequests')
        .where('userId', '==', u.uid)
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
          if (snapshot?.docs) {
            const data = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setMuhurtRequest(data);
            setLoading(false);
          }
        });
      unsubscribers.push(unsubUserMuhurt);
    });

    // 🔁 Categories
    const unsubCategories = firestore()
      .collection('categories')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        if (snapshot?.docs) {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCategories(data);
          setLoadingCategories(false);
        }
      });
    unsubscribers.push(unsubCategories);

    // 🔁 All Poojas
    const unsubPooja = firestore()
      .collection('pooja')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        if (snapshot?.docs) {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPooja(data);
          setLoadingCategories(false);
        }
      });
    unsubscribers.push(unsubPooja);

    // 🔁 Price list
    const unsubPrice = firestore()
      .collection('priceList')
      .onSnapshot(snapshot => {
        if (snapshot?.docs) {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPoojaPrice(data[0] || {});
          setLoading(false);
        }
      });
    unsubscribers.push(unsubPrice);

    // 🔁 All bookings (admin)
    const unsubAllPoojaBookings = firestore()
      .collection('poojaBookings')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        if (snapshot?.docs) {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAllPoojaBookings(data);
          setLoading(false);
        }
      });
    unsubscribers.push(unsubAllPoojaBookings);

    const unsubAllMuhurt = firestore()
      .collection('muhurtRequests')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        if (snapshot?.docs) {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAllMuhurtBookings(data);
          setLoading(false);
        }
      });
    unsubscribers.push(unsubAllMuhurt);

    const unsubAllKundali = firestore()
      .collection('kundali')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        if (snapshot?.docs) {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAllKundaliBookings(data);
          setLoading(false);
        }
      });
    unsubscribers.push(unsubAllKundali);

    // Cleanup on unmount
    return () => {
      unsubscribeAuth();
      unsubscribers.forEach(unsub => unsub());
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        categories,
        loadingCategories,
        refreshCategories: () => {},
        pooja,
        userBookings,
        loading,
        refreshBookings: () => {},
        poojaPrice,
        muhurtRequest,
        refreshMuhurtRequest: () => {},
        allPoojaBookings,
        allMuhurtBookings,
        refreshAllPoojaBookings: () => {},
        refreshAllMuhurtRequest: () => {},
        allKundaliBookings,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
