import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [data, setData] = useState({
    username: "",
    userInstaId: "",
    likedPosts: [],
    likedComments: [],
    likedReplies: [],
    dislikedPosts: [],
    dislikedComments: [],
    dislikedReplies: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newData = { ...data, username: username };
    setData(newData);
    localStorage.setItem('userData', JSON.stringify(newData));
    console.log('Data stored in local storage:', newData);
    
    setUsername(""); // Clear input field after submission
    navigate('/posts'); // Navigate to '/posts' route after form submission
  };

  return (
    <>
      <div>HomePage</div>
      <form onSubmit={handleSubmit}>
        <label>Enter your nickname:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit">Submit </button>
      </form>
    </>
  );
};

export default HomePage;
