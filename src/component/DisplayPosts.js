import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const DisplayPosts = () => {
  const [posts, setPosts] = useState([]);
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('userData');
    return savedData
      ? JSON.parse(savedData)
      : {
          username: "",
          userInstaId: "",
          likedPosts: [],
          likedComments: [],
          likedReplies: [],
          dislikedPosts: [],
          dislikedComments: [],
          dislikedReplies: [],
        };
  });
  const [filter, setFilter] = useState('new');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/post');
      let sortedPosts = response.data;
      if (filter === 'top') {
        sortedPosts = sortedPosts.sort((a, b) => (b.like - b.dislike) - (a.like - a.dislike));
      } else {
        sortedPosts = sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      setPosts(sortedPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to fetch posts. Please try again later.');
      setLoading(false);
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  const updatePostLikesDislikes = (postId, action) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? {
              ...post,
              like: action === 'like' ? post.like + 1 : post.like,
              dislike: action === 'dislike' ? post.dislike + 1 : post.dislike,
            }
          : post
      )
    );
  };

  const handleLikeChange = async (postId, isLiked) => {
    try {
      if (isLiked) {
        await axios.post(`http://localhost:5000/post/${postId}/like`);
        updatePostLikesDislikes(postId, 'like');
      } else {
        await axios.post(`http://localhost:5000/post/${postId}/dislike`);
        updatePostLikesDislikes(postId, 'dislike');
      }
    } catch (error) {
      console.error('Error updating like/dislike:', error);
    }
  };

  const toggleLike = (postId) => {
    if (data.likedPosts.includes(postId)) {
      setData(prevData => ({
        ...prevData,
        likedPosts: prevData.likedPosts.filter(id => id !== postId),
      }));
      handleLikeChange(postId, false); // Dislike the post
    } else {
      setData(prevData => ({
        ...prevData,
        likedPosts: [...prevData.likedPosts, postId],
        dislikedPosts: prevData.dislikedPosts.filter(id => id !== postId),
      }));
      handleLikeChange(postId, true); // Like the post
    }
  };
  
  const toggleDislike = (postId) => {
    if (data.dislikedPosts.includes(postId)) {
      setData(prevData => ({
        ...prevData,
        dislikedPosts: prevData.dislikedPosts.filter(id => id !== postId),
      }));
      handleLikeChange(postId, true); // Like the post
    } else {
      setData(prevData => ({
        ...prevData,
        dislikedPosts: [...prevData.dislikedPosts, postId],
        likedPosts: prevData.likedPosts.filter(id => id !== postId),
      }));
      handleLikeChange(postId, false); // Dislike the post
    }
  };
  
  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(data));
  }, [data]);

  return (
    <div className='posts'>
      <div className="filter-buttons">
        <button className={filter === 'new' ? 'active' : ''} onClick={() => setFilter('new')}>
          New
        </button>
        <button className={filter === 'top' ? 'active' : ''} onClick={() => setFilter('top')}>
          Top
        </button>
      </div>
      {loading ? (
        <p>Loading posts...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        posts.map((post) => (
          <div className='postblock' key={post._id}>
            <h1>{post.content}</h1>
            <p>{post.username}</p>
            <p>
              <strong>Instagram ID:</strong> {post.userInstaId || 'N/A'}
            </p>
            <p>Total: {post.like - post.dislike}</p>
            <p>Comments: {post.comment.length}</p>
            <p>By {post.userInstaId} {formatDistanceToNow(new Date(post.createdAt))} ago</p>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={data.likedPosts.includes(post._id)}
                  onChange={() => toggleLike(post._id)}
                />
                Like
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={data.dislikedPosts.includes(post._id)}
                  onChange={() => toggleDislike(post._id)}
                />
                Dislike
              </label>
            </div>
            <div>
              <button onClick={() => handlePostClick(post._id)}>View Post</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DisplayPosts;
