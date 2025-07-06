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

  useEffect(() => {
    const unsubscribers = [];

    const unsubscribeAuth = auth().onAuthStateChanged(u => {
      setUser(u);
      if (u) {
        const unsubUserPooja = firestore()
          .collection('poojaBookings')
          .where('userId', '==', u.uid)
          .orderBy('createdAt', 'desc')
          .onSnapshot(snapshot => {
            const data = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setUserBookings(data);
            setLoading(false);
          });
        unsubscribers.push(unsubUserPooja);

        const unsubUserMuhurt = firestore()
          .collection('muhurtRequests')
          .where('userId', '==', u.uid)
          .orderBy('createdAt', 'desc')
          .onSnapshot(snapshot => {
            const data = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setMuhurtRequest(data);
            setLoading(false);
          });
        unsubscribers.push(unsubUserMuhurt);
      } else {
        setUserBookings([]);
        setMuhurtRequest([]);
        setLoading(false);
      }
    });

    const unsubCategories = firestore()
      .collection('categories')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCategories(data);
        setLoadingCategories(false);
      });
    unsubscribers.push(unsubCategories);

    const unsubPooja = firestore()
      .collection('pooja')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPooja(data);
        setLoadingCategories(false);
      });
    unsubscribers.push(unsubPooja);

    const unsubPrice = firestore()
      .collection('priceList')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPoojaPrice(data[0] || {});
        setLoading(false);
      });
    unsubscribers.push(unsubPrice);

    const unsubAllPoojaBookings = firestore()
      .collection('poojaBookings')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllPoojaBookings(data);
        setLoading(false);
      });
    unsubscribers.push(unsubAllPoojaBookings);

    const unsubAllMuhurt = firestore()
      .collection('muhurtRequests')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllMuhurtBookings(data);
        setLoading(false);
      });
    unsubscribers.push(unsubAllMuhurt);

    // Cleanup all listeners on unmount
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
        refreshCategories: () => {}, // no-op, realtime now
        pooja,
        userBookings,
        loading,
        refreshBookings: () => {}, // no-op, realtime now
        poojaPrice,
        muhurtRequest,
        refreshMuhurtRequest: () => {}, // no-op, realtime now
        allPoojaBookings,
        allMuhurtBookings,
        refreshAllPoojaBookings: () => {},
        refreshAllMuhurtRequest: () => {},
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
