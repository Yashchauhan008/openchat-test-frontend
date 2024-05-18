import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const ShowPost = () => {
  const { postId } = useParams(); // Get the postId from the URL parameters
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/post/${postId}`);
      setPost(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className='post-details'>
      <h1>{post.content}</h1>
      <p>{post.username}</p>
      <p><strong>Instagram ID:</strong> {post.userInstaId || 'N/A'}</p>
      <p>Likes: {post.like}</p>
      <p>Comments: {post.comment.length}</p>
      <p>By {post.userInstaId} {formatDistanceToNow(new Date(post.createdAt))} ago</p>
      <div className='comments'>
        <h2>Comments</h2>
        {post.comment.map((comment) => (
          <div key={comment._id} className='comment'>
            <p>{comment.text}</p>
            <p>By {comment.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowPost;
