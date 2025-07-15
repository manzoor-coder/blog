import { Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useParams } from 'react-router-dom';
import { collection, getDoc, doc, query, where, getDocs, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../Authentication/firebase_config';
import CustomHTMLRenderer from '../../pages/Home/CustomHTMLRenderer';
import { toast } from 'react-toastify';

const OtherPage = () => {
    const { postId } = useParams();
    const [postData, setPostData] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        comment: '',
        name: '',
        email: '',
        postId: postId,
        isapproved: false,
    });

    // Fetch post data from Firestore
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postRef = doc(db, 'posts', postId);
                const postSnap = await getDoc(postRef);
                if (postSnap.exists()) {
                    const data = { id: postSnap.id, ...postSnap.data() };
                    setPostData(data);
                    console.log('Post data fetched:', data);
                    console.log('imageurl array:', data.imageurl); // Debug
                } else {
                    console.error('Post not found');
                    toast.error('Post not found.');
                }
            } catch (error) {
                console.error('Error fetching post:', error);
                toast.error('Failed to load post.');
            }
        };

        if (postId) {
            fetchPost();
        }
    }, [postId]);

    // Fetch comments
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const commentsRef = collection(db, 'comments');
                const q = query(commentsRef, where('postId', '==', postId));
                const snapshot = await getDocs(q);
                const fetchedComments = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setComments(fetchedComments);
                console.log('Comments fetched:', fetchedComments);
            } catch (error) {
                console.error('Error fetching comments:', error);
                toast.error('Failed to load comments.');
            }
        };

        if (postId) {
            fetchComments();
        }
    }, [postId]);

    // Handle form submission for comments
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const docRef = await addDoc(collection(db, 'comments'), {
                ...formData,
                createdAt: serverTimestamp(),
            });

            await updateDoc(doc(db, 'comments', docRef.id), {
                id: docRef.id,
            });

            toast.success('Comment submitted successfully!');
            setFormData({
                comment: '',
                name: '',
                email: '',
                postId: postId,
                isapproved: false,
            });
            // Refresh comments
            const fetchComments = async () => {
                try {
                    const commentsRef = collection(db, 'comments');
                    const q = query(commentsRef, where('postId', '==', postId));
                    const snapshot = await getDocs(q);
                    const fetchedComments = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setComments(fetchedComments);
                    console.log('Comments fetched:', fetchedComments);
                } catch (error) {
                    console.error('Error fetching comments:', error);
                    toast.error('Failed to load comments.');
                }
            };
            fetchComments();
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error('Failed to post comment.');
        }

        setLoading(false);
    };

    // Handle form input changes
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Container className="max-w-4xl mx-auto px-4 py-8">
                {postData ? (
                    <div>
                        {/* Blog Featured Image */}
                        {postData.featuredImage && (
                            <div>
                                <img
                                    src={postData.featuredImage}
                                    alt="Featured"
                                    className="w-full h-[500px] object-cover rounded-sm mb-6"
                                    onError={(e) => console.error('Error loading featured image:', e)}
                                />
                            </div>
                        )}

                        {/* Meta Info */}
                        <div className="text-sm text-gray-500 mb-4 text-center space-x-2">
                            <span>
                                {postData.createdAt
                                    ? new Date(postData.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                                          day: '2-digit',
                                          month: 'short',
                                          year: 'numeric',
                                      })
                                    : 'Unknown Date'}
                            </span>
                        </div>

                        {/* Section Heading */}
                        <h1 className="text-5xl font-bold mt-10 mb-4">{postData.title}</h1>

                        {/* Render post HTML content with images */}
                        {postData.content && (
                            <CustomHTMLRenderer
                                html={postData.content}
                                imageUrls={postData.imageurl && Array.isArray(postData.imageurl) ? postData.imageurl : []}
                            />
                        )}

                        {/* Comments Section */}
                        <div className="my-10">
                            <h3 className="text-xl font-semibold mb-4">Post A Comment</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <textarea
                                    name="comment"
                                    className="w-full border border-gray-300 rounded p-3"
                                    rows="4"
                                    placeholder="Comment..."
                                    value={formData.comment}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                                <input
                                    type="text"
                                    name="name"
                                    className="w-full border border-gray-300 rounded p-2"
                                    placeholder="Name (Required)"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    className="w-full border border-gray-300 rounded p-2"
                                    placeholder="Email (Required)"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                                >
                                    {loading ? 'Posting...' : 'Post Comment'}
                                </button>
                            </form>

                            <div className="mt-10">
                                <h3 className="text-2xl font-semibold mb-4">Comments</h3>
                                {comments.length === 0 ? (
                                    <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                                ) : (
                                    <div className="space-y-6">
                                        {comments.map(
                                            (comment) =>
                                                comment.isapproved && (
                                                    <div
                                                        key={comment.id}
                                                        className="bg-gray-100 p-4 rounded-md shadow-sm border border-gray-200"
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h3 className="text-xl font-bold text-gray-800">{comment.name}</h3>
                                                            <span className="text-xs text-gray-500">
                                                                {comment.createdAt
                                                                    ? new Date(comment.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                                                                          day: '2-digit',
                                                                          month: 'short',
                                                                          year: 'numeric',
                                                                      })
                                                                    : 'Unknown Date'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <p className="text-gray-700">{comment.comment}</p>
                                                            
                                                        </div>
                                                    </div>
                                                )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Loading post...</p>
                )}
            </Container>
        </>
    );
};

export default OtherPage;