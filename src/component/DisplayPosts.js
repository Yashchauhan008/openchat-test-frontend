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
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/post');
      let sortedPosts = response.data;
      if (filter === 'top') {
        sortedPosts = sortedPosts.sort((a, b) => (b.like - b.dislike) - (a.like - a.dislike));
      } else {
        sortedPosts = sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.put(`http://localhost:5000/post/like/${postId}`);
      const updatedPost = response.data;
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, like: updatedPost.like } : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDislike = async (postId) => {
    try {
      const response = await axios.put(`http://localhost:5000/post/dislike/${postId}`);
      const updatedPost = response.data;
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, dislike: updatedPost.dislike } : post
        )
      );
    } catch (error) {
      console.error('Error disliking post:', error);
    }
  };

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
      {posts.map((post) => (
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
            <button onClick={() => handlePostClick(post._id)}>View Post</button>
            <button onClick={() => handleLike(post._id)}>Like</button>
            <button onClick={() => handleDislike(post._id)}>Dislike</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DisplayPosts;