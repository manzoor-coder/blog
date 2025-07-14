import { useEffect, useState } from 'react';
import { getDoc, doc, collection, getDocs, addDoc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { onSnapshot } from 'firebase/firestore';
import { auth, db } from '../Authentication/firebase_config';
import { Outlet } from 'react-router-dom';
import SideBar from './SideBar';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const AdminLayout = () => {
  const [adminData, setAdminData] = useState();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  const categoriesRef = collection(db, 'categories');
  const commentsRef = collection(db, 'comments');

  // Fetch categories
  const fetchCategories = async () => {
    const data = await getDocs(categoriesRef);
    const fetched = data.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCategories(fetched);
  };


  // fetch comments 
 const fetchComments = async () => {
  try {
    const commentsRef = collection(db, 'comments');

    const q = query(
      commentsRef,
      orderBy('createdAt', 'desc') // Sort all comments by latest first
    );

    const snapshot = await getDocs(q);
    const fetchedComments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setComments(fetchedComments);
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
};

useEffect(() => {
  fetchComments();
}, []);

  // Add category
  const handleAddCategory = async (name) => {
    if (!name.trim()) return;

    await addDoc(categoriesRef, {
      name: name.trim(),
      createdAt: new Date(),
    });

    fetchCategories();
  };

  // Delete category
  const handleDeleteCategory = async (id) => {
    await deleteDoc(doc(db, 'categories', id));
    fetchCategories();
  };


  // Edit category
  const handleEditCategory = async (id, name) => {
    setCategoryName(name);
    setEditCategoryId(id);
    setEditMode(true);
  }

  //  Update Category
  const handleUpdateCategory = async () => {
    if (!editCategoryId || !categoryName.trim()) return;

    const categoryRef = doc(db, 'categories', editCategoryId);
    await updateDoc(categoryRef, {
      name: categoryName.trim(),
    });

    setCategoryName('')
    setEditCategoryId(null);
    setEditMode(false);
    fetchCategories();
    toast.success("Category updated successfully!");
  }




  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);

        const userUnsub = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.role === 'admin') {
              setAdminData(data);
              fetchCategories();
              setLoading(false);
            } else {
              console.warn('Not an admin');
              setLoading(false);
            }
          }
        }, (error) => {
          console.error('Error fetching admin in real-time:', error.message);
          setLoading(false);
        });

        // Cleanup Firestore listener
        return () => userUnsub();
      } else {
        setAdminData(null);
        setLoading(false);
      }
    });

    // Cleanup Auth listener
    return () => unsubscribe();
  }, []);


  if (loading) return <p>Loading...</p>;
  if (!adminData) {
    navigate('/login');
  }

  return (
    <div className="flex">

      <div className="w-[20%] bg-gray-200 overflow-hidden h-screen">
        <SideBar />
      </div>
      <div className="w-[80%] pl-6 h-screen overflow-y-auto">
        <Outlet context={{
          adminData,
          categories,
          handleAddCategory,
          handleDeleteCategory,
          handleEditCategory,
          handleUpdateCategory,
          categoryName,
          setCategoryName,
          editMode,
          comments,
          fetchComments,
          fetchCategories,

        }} />

      </div>

    </div>
  );
};

export default AdminLayout;
