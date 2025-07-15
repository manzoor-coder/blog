import React, { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { MdPostAdd } from "react-icons/md";
import { FaCommentDots } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { handleLogout } from '../Authentication/UserLogin';
import { useNavigate } from 'react-router-dom';
import { db } from '../Authentication/firebase_config';
import { collection, getDocs, limit, query, orderBy } from 'firebase/firestore';


const AdminDashboard = () => {
  const { adminData } = useOutletContext();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [recentPost, setRecentPost] = useState(null);


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'posts'));
        const fetchedPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('❌ Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);


  const commentsRef = collection(db, 'comments');

  // fetch comments 
  const fetchComments = async () => {
    try {
      const snapshot = await getDocs(commentsRef);
      const fetchedComments = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      // ✅ Filter by postId

      setComments(fetchedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [])


  const fetchRecentPosts = async () => {
    try {
      const postsRef = collection(db, "posts");
      const recentQuery = query(postsRef, orderBy("createdAt", "desc"), limit(1));
      const snapshot = await getDocs(recentQuery);

      if (!snapshot.empty) {
        const latestPost = snapshot.docs[0].data();
        setRecentPost(latestPost);
      }
    } catch (error) {
      console.log("Error fetching latest post", error);
    }
  }

  useEffect(() => {
    fetchRecentPosts();
  }, [])



  return (
    <div className="flex min-h-screen bg-gray-100">


      {/* Main content */}
      <div className="flex-1 p-6">
        {/* Topbar */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h1>
          <div className="relative flex flex-col items-center text-sm text-gray-600 text-center">
            <DropdownMenu >
              <DropdownMenuTrigger asChild >
                <img
                  src={adminData.imageUrl || "/default-avatar.png"}
                  alt="Admin"
                  className="w-14 h-14 rounded-full mb-2 cursor-pointer"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56 bg-gray-300">
                <div className="text-center px-4 py-2">
                  <img
                    src={adminData.imageUrl || "/default-avatar.png"}
                    alt="Admin"
                    className="w-16 h-16 rounded-full mx-auto mb-2"
                  />
                  <p className="font-semibold text-gray-700">{adminData.name}</p>
                  <p className="text-sm text-gray-500">{adminData.email}</p>
                </div>
                <DropdownMenuSeparator />
                <Link to='/admin/profile' ><DropdownMenuItem style={{cursor: 'pointer'}}>Profile</DropdownMenuItem></Link>
                <DropdownMenuItem onClick={() => { handleLogout(navigate) }} style={{cursor: 'pointer'}}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <p className="text-gray-700 font-semibold text-lg">{adminData.name}</p>
          </div>

        </header>

        {/* Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className='flex justify-between'>
              <h2 className="text-xl font-semibold text-gray-800">Total Posts</h2>
              <MdPostAdd size={25} color='blue'/>
            </div>
            <p className="text-3xl text-blue-600 mt-2">{posts.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className='flex justify-between'>
              <h2 className="text-xl font-semibold text-gray-800">Comments</h2>
            <FaCommentDots size={25} color='blue'/>
            </div>
            <p className="text-3xl text-green-600 mt-2">{comments.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
          <div className='flex justify-between'>
              <h2 className="text-xl font-semibold text-gray-800">Views</h2>
            <FaEye  size={25} color='blue'/>
            </div>
            
            <p className="text-3xl text-purple-600 mt-2">1,200</p>
          </div>
        </div>

        {/* Future sections (e.g. post management, recent activity, etc.) */}
        {/* <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="text-gray-600">You recently published “Summer Fruit Recipes”</p>
          </div>
        </div> */}

        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="bg-white p-4 rounded-md shadow-sm">
            {recentPost ? (
              <p className="text-gray-600">
                You recently published “{recentPost.title}”
              </p>
            ) : (
              <p className="text-gray-400">No recent activity found.</p>
            )}
          </div>
        </div>

      </div>




    </div>
  );
};

export default AdminDashboard;
