import React, { useEffect, useState } from 'react';
import {
    collection,
    getDocs,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '../Authentication/firebase_config';
import { FaTrash, FaEdit, FaEye } from 'react-icons/fa';
import PostModal from './AdminModals/PostModal';
import { Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PostDeleteModal from './AdminModals/PostDeleteModal';
import { toast } from 'react-toastify';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [authorFilter, setAuthorFilter] = useState('');
    const [selectedPost, setSelectedPost] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [newPost, setNewPost] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;
    const navigate = useNavigate();

    const fetchPosts = async () => {
        try {
            const postRef = collection(db, 'posts');
            // Query with featuredImage filter (requires index)
            const q = query(
                postRef,
                orderBy('createdAt', 'desc')
            );
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log("Fetched all posts:", data);
            setPosts(data);
            setFilteredPosts(data);

           
        } catch (error) {
            console.error('Error fetching posts:', error);
            toast.error('Failed to fetch posts. Please ensure the Firestore index is created if filtering by featuredImage.');
        }
    };

    // const handleDelete = async (postId) => {
    //     try {
    //         await deleteDoc(doc(db, 'posts', postId));
    //         const updated = posts.filter(post => post.id !== postId);
    //         setPosts(updated);
    //         setFilteredPosts(updated);
    //         toast.success('Post deleted successfully!');
    //     } catch (error) {
    //         console.error('Error deleting post:', error);
    //         toast.error('Failed to delete post.');
    //     }
    // };

    const filterPosts = () => {
        let result = [...posts];
        if (search) {
            result = result.filter(post => post.title?.toLowerCase().includes(search.toLowerCase()));
        }
        if (categoryFilter) {
            result = result.filter(post => post.category === categoryFilter);
        }
        if (authorFilter) {
            result = result.filter(post => post.author === authorFilter);
        }
        setFilteredPosts(result);
        setCurrentPage(1);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        filterPosts();
    }, [search, categoryFilter, authorFilter, posts]);

    const lastPostIndex = currentPage * postsPerPage;
    const firstPostIndex = lastPostIndex - postsPerPage;
    const currentPosts = filteredPosts.slice(firstPostIndex, lastPostIndex);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage) || 1;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Manage All Posts</h2>

            <div className="flex flex-wrap gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by title..."
                    className="border p-2 rounded"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Filter by category..."
                    className="border p-2 rounded"
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Filter by author..."
                    className="border p-2 rounded"
                    value={authorFilter}
                    onChange={e => setAuthorFilter(e.target.value)}
                />
            </div>

            {filteredPosts.length === 0 ? (
                <p className="text-gray-500">No posts found.</p>
            ) : (
                <table className="min-w-full bg-white shadow rounded">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="p-3 text-left">Title</th>
                            <th className="p-3 text-left">Author</th>
                            <th className="p-3 text-left">Category</th>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Image</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPosts.map(post => (
                            <tr key={post.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-medium">{post.title || 'Untitled'}</td>
                                <td className="p-3">{post.author || 'Unknown'}</td>
                                <td className="p-3">{post.category || 'Uncategorized'}</td>
                                <td className="p-3">
                                    {post.createdAt?.seconds
                                        ? new Date(post.createdAt.seconds * 1000).toLocaleDateString('en-GB')
                                        : 'N/A'}
                                </td>
                                <td className="p-3">
                                    {post.featuredImage ? (
                                        <img
                                            src={post.featuredImage}
                                            alt="Featured"
                                            className="w-16 h-16 object-cover rounded"
                                            onError={(e) => (e.target.src = '/images/fallback.jpg')}
                                        />
                                    ) : (
                                        <span>No Image</span>
                                    )}
                                </td>
                                <td className="p-3 space-x-2">
                                    <Tooltip title="View Post" arrow placement='top'>
                                        <button onClick={() => {
                                            setSelectedPost(post);
                                            setIsOpen(true);
                                        }} className="text-blue-600 cursor-pointer">
                                            <FaEye size={18} className='text-blue-600 hover:text-blue-500 hover:scale-115 cursor-pointer transition-transform ease-in-out duration-300' />
                                        </button>
                                    </Tooltip>
                                    <Tooltip title="Edit post" arrow placement='top'>
                                        <button onClick={() => navigate(`/admin/editpost/${post.id}`)} className="text-green-600 cursor-pointer">
                                            <FaEdit size={18} className='text-green-600 hover:text-green-500 hover:scale-115 cursor-pointer transition-transform ease-in-out duration-300' />
                                        </button>
                                    </Tooltip>
                                    <Tooltip title="Delete Post" arrow placement='top'>
                                        <button onClick={() => {
                                            setNewPost(post);
                                            setDeleteDialogOpen(true);
                                        }} className="text-red-600 cursor-pointer">
                                            <FaTrash size={18} className="text-red-600 hover:text-red-500 hover:scale-115 cursor-pointer transition-transform ease-in-out duration-300" />
                                        </button>
                                    </Tooltip>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div className="flex justify-between mt-4">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="px-3 py-1 border rounded bg-blue-600 text-white hover:bg-blue-500 cursor-pointer disabled:opacity-50 disabled:bg-gray-400 disabled:text-blue disabled:cursor-default"
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="px-3 py-1 border rounded bg-blue-600 text-white hover:bg-blue-500 cursor-pointer disabled:opacity-50 disabled:bg-gray-400 disabled:text-blue disabled:cursor-default"
                >
                    Next
                </button>
            </div>

            <PostModal open={isOpen} onOpenChange={setIsOpen} post={selectedPost} />
            <PostDeleteModal
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                post={newPost}
                setPosts={setPosts}
                setFilteredPosts={setFilteredPosts}
            />
        </div>
    );
};

export default Posts;