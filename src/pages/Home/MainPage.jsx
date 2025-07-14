import { Avatar, Container, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import './MainPage.css';
import { Link, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { db } from '../../Authentication/firebase_config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import CustomHTMLRenderer from './CustomHTMLRenderer';
import { toast } from 'react-toastify';

const MainPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize AOS
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // Fetch posts from Firestore
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        const postsRef = collection(db, 'posts');
        const q = query(postsRef, orderBy('createdAt', 'desc'));

        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(fetchedPosts);
        setFilteredPosts(fetchedPosts);
        console.log('Fetched posts:', fetchedPosts);
      } catch (error) {
        console.error('❌ Error fetching posts:', error);
        toast.error('Failed to load posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts by category
  useEffect(() => {
    if (!categoryFilter) {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter((post) =>
        post.category?.toLowerCase().includes(categoryFilter.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [categoryFilter, posts]);

  // Strip HTML for plain text excerpt
  function stripHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  return (
    <>
      <div className="w-full h-[500px] bg-gray-100 main_img flex justify-center items-center">
        <div className="overlay"></div>
        <h1 className="text-4xl font-bold text-white z-10">Welcome to My Blog</h1>
      </div>

      <div className="blog_posts">
        <Container maxWidth="lg" className="py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Latest Posts</h2>
            <input
              type="text"
              placeholder="Filter by category..."
              className="border p-2 bg-white rounded w-64"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading posts...</p>
          ) : filteredPosts.length === 0 ? (
            <p className="text-center text-gray-500">No posts found.</p>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="flex flex-col items-start md:flex-row md:items-center justify-between my-8"
                data-aos="fade-up"
              >
                <div className="flex flex-col items-center justify-center bg-[#4caf50] text-white md:h-40 md:w-20 w-[100px] h-[60px] rounded-sm relative overflow-hidden">
                  {post.createdAt ? (
                    (() => {
                      const date = post.createdAt.toDate
                        ? post.createdAt.toDate()
                        : new Date(post.createdAt); // Fallback for non-Timestamp
                      const day = date.getDate();
                      const month = date.toLocaleString('default', { month: 'short' });
                      const year = date.getFullYear();
                      return (
                        <div className="text-center text-white">
                          <span className="text-lg md:font-medium mt-2 md:block">{month}</span>
                          <span className="text-lg md:text-2xl md:font-bold md:block">{day}</span>
                          <span className="text-lg md:font-medium mb-4 md:block">{year}</span>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-center text-white">Unknown Date</div>
                  )}
                  <div className="absolute bottom-0 left-0 w-full h-3 md:h-5 striped-footer"></div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-4 w-full md:w-11/12 mx-auto flex flex-col md:flex-row gap-x-6 items-start md:items-center transform transition duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl">
                  {post.featuredImage && (
                    <div className="md:w-6/12 w-full cursor-pointer">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-[400px] rounded-md object-cover"
                        onClick={() => navigate(`/other/${post.id}`)}
                      />
                    </div>
                  )}

                  <div className="md:w-5/12 w-full text-gray-700">
                    <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                    <p className="line-clamp-12 text-gray-600 my-4">{stripHtml(post.content)}</p>
                    <Button
                      variant="contained"
                      sx={{
                        background: '#757575',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        '&:hover': { background: '#616161' },
                      }}
                      onClick={() => navigate(`/other/${post.id}`)}
                    >
                      Read More <ReadMoreIcon sx={{ ml: 1 }} />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </Container>
      </div>
    </>
  );
};

export default MainPage;