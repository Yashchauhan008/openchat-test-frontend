import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../utils/baseurl';

const ShowPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${BASE_URL}post/${id}`);
        setPost(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to fetch post. Please try again later.');
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleLikeChange = async (postId, isLiked, isMoving) => {
    try {
      if (isLiked) {
        await axios.post(`http://localhost:5000/post/${postId}/like`);
        if (isMoving) {
          updatePostLikesDislikes(postId, "like", 2); // Increase the like count by 2
        } else {
          updatePostLikesDislikes(postId, "like", 1); // Increase the like count by 1
        }
      } else {
        await axios.post(`http://localhost:5000/post/${postId}/dislike`);
        if (isMoving) {
          updatePostLikesDislikes(postId, "dislike", 2); // Increase the dislike count by 2
        } else {
          updatePostLikesDislikes(postId, "dislike", 1); // Increase the dislike count by 1
        }
      }
    } catch (error) {
      console.error("Error updating like/dislike:", error);
    }
  };

  const updatePostLikesDislikes = (postId, action, incrementValue = 1) => {
    setPost((prevPost) => ({
      ...prevPost,
      like: action === 'like' ? prevPost.like + incrementValue : prevPost.like,
      dislike: action === 'dislike' ? prevPost.dislike + incrementValue : prevPost.dislike,
    }));
  };

  const toggleLike = (postId) => {
    if (data.dislikedPosts.includes(postId)) {
      setData((prevData) => ({
        ...prevData,
        dislikedPosts: prevData.dislikedPosts.filter((id) => id !== postId),
        likedPosts: [...prevData.likedPosts, postId],
      }));
      handleLikeChange(postId, true, true);
    } else if (data.likedPosts.includes(postId)) {
      setData((prevData) => ({
        ...prevData,
        likedPosts: prevData.likedPosts.filter((id) => id !== postId),
      }));
      handleLikeChange(postId, false);
    } else {
      setData((prevData) => ({
        ...prevData,
        likedPosts: [...prevData.likedPosts, postId],
      }));
      handleLikeChange(postId, true);
    }
  };

  const toggleDislike = (postId) => {
    if (data.likedPosts.includes(postId)) {
      setData((prevData) => ({
        ...prevData,
        likedPosts: prevData.likedPosts.filter((id) => id !== postId),
        dislikedPosts: [...prevData.dislikedPosts, postId],
      }));
      handleLikeChange(postId, false, true);
    } else if (data.dislikedPosts.includes(postId)) {
      setData((prevData) => ({
        ...prevData,
        dislikedPosts: prevData.dislikedPosts.filter((id) => id !== postId),
      }));
      handleLikeChange(postId, true);
    } else {
      setData((prevData) => ({
        ...prevData,
        dislikedPosts: [...prevData.dislikedPosts, postId],
      }));
      handleLikeChange(postId, false);
    }
  };

  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(data));
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!post) return <p>No post found</p>;

  return (
    <div className='post-detail'>
      <h1>{post.content}</h1>
      <p>{post.username}</p>
      <p><strong>Instagram ID:</strong> {post.userInstaId || 'N/A'}</p>
      <p>Total: {post.like - post.dislike}</p>
      <p>Comments: {post.comment.length}</p>
      <p>Posted {formatDistanceToNow(new Date(post.createdAt))} ago</p>
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
    </div>
  );
};

export default ShowPost;