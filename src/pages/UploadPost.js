import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/upload.css";
import { Header } from "../component/Header";
import BackButton from "../component/BackButton";
import UploadButton from "../component/UploadButton";
import { BASE_URL } from "../utils/baseurl";
import Swal from 'sweetalert2';

const UploadPost = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [userInstaId, setUserInstaId] = useState("");
  const [showInstaIdInput, setShowInstaIdInput] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("userData");
    const userData = JSON.parse(savedData);
    setUserInstaId(userData.userInstaId || "");
    setShowInstaIdInput(!userData.userInstaId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const savedData = localStorage.getItem("userData");
      const userData = JSON.parse(savedData);
      const newPost = {
        username: userData.username,
        content,
        userInstaId: userInstaId || userData.userInstaId,
      };

      if (showInstaIdInput) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'Once the Instagram ID is saved, it cannot be changed',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, save it!',
          cancelButtonText: 'No, cancel!',
        }).then(async (result) => {
          if (result.isConfirmed) {
            await submitPost(newPost, userData);
          }
        });
      } else {
        await submitPost(newPost, userData);
      }
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  const submitPost = async (newPost, userData) => {
    const response = await axios.post(`${BASE_URL}post/upload`, newPost);
    setContent(""); // Update the userInstaId in localStorage
    const updatedUserData = { ...userData, userInstaId };
    localStorage.setItem("userData", JSON.stringify(updatedUserData));
    Swal.fire({
      icon: 'success',
      title: 'Post uploaded successfully!',
      showConfirmButton: false,
      timer: 1500
    });
    navigate("/posts");
  };

  return (
    <>
    <div className="upload">
      <Header />
      <div className="back-button" onClick={()=>navigate('/posts')}>
        <BackButton/>
      </div>
      <form onSubmit={handleSubmit} className="upload-form">
        <h1 className="main">
          <p>
            add your <span>#1</span>
          </p>
          <p>productivity hack</p>
        </h1>
        <div className="hack-cnt">
          <label htmlFor="content" className="content-label">
            Your Hack
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4"
            cols="50"
            required
            className="content-textarea"
          />
        </div>
        {showInstaIdInput && (
          <div className="instaid-cnt">
            <label htmlFor="userInstaId" className="insta-id-label">
              Instagram ID:
              <input
                type="text"
                id="userInstaId"
                value={userInstaId}
                onChange={(e) => setUserInstaId(e.target.value)}
                className="insta-id-input"
              />
            </label>
          </div>
        )}
        <UploadButton type="submit" className="upload-button" />
      </form>
    </div>
  </>
  );
};

export default UploadPost;