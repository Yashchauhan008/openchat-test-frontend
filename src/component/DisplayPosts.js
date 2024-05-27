import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import "../css/displaypost.css";
import insta from "../assets/instagram.png";

const DisplayPosts = () => {
  const [posts, setPosts] = useState([]);
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem("userData");
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
  const [filter, setFilter] = useState("new");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/post");
      let sortedPosts = response.data;
      if (filter === "top") {
        sortedPosts = sortedPosts.sort(
          (a, b) => b.like - b.dislike - (a.like - a.dislike)
        );
      } else {
        sortedPosts = sortedPosts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      }
      setPosts(sortedPosts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to fetch posts. Please try again later.");
      setLoading(false);
    }
  };

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const updatePostLikesDislikes = (postId, action, incrementValue = 1) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? {
              ...post,
              like: action === "like" ? post.like + incrementValue : post.like,
              dislike:
                action === "dislike"
                  ? post.dislike + incrementValue
                  : post.dislike,
            }
          : post
      )
    );
  };

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

  const toggleLike = (postId) => {
    if (data.dislikedPosts.includes(postId)) {
      // If the post is already disliked, remove it from the disliked list, add it to the liked list, and increase the like count by 2
      setData((prevData) => ({
        ...prevData,
        dislikedPosts: prevData.dislikedPosts.filter((id) => id !== postId),
        likedPosts: [...prevData.likedPosts, postId],
      }));
      handleLikeChange(postId, true, true); // Like the post, with an increase of 2
    } else if (data.likedPosts.includes(postId)) {
      // If the post is already liked, remove it from the liked list
      setData((prevData) => ({
        ...prevData,
        likedPosts: prevData.likedPosts.filter((id) => id !== postId),
      }));
      handleLikeChange(postId, false); // Dislike the post
    } else {
      // If the post is neither liked nor disliked, add it to the liked list
      setData((prevData) => ({
        ...prevData,
        likedPosts: [...prevData.likedPosts, postId],
      }));
      handleLikeChange(postId, true); // Like the post
    }
  };

  const toggleDislike = (postId) => {
    if (data.likedPosts.includes(postId)) {
      // If the post is already liked, remove it from the liked list, add it to the disliked list, and decrease the like count by 2
      setData((prevData) => ({
        ...prevData,
        likedPosts: prevData.likedPosts.filter((id) => id !== postId),
        dislikedPosts: [...prevData.dislikedPosts, postId],
      }));
      handleLikeChange(postId, false, true); // Dislike the post, with a decrease of 2
    } else if (data.dislikedPosts.includes(postId)) {
      // If the post is already disliked, remove it from the disliked list
      setData((prevData) => ({
        ...prevData,
        dislikedPosts: prevData.dislikedPosts.filter((id) => id !== postId),
      }));
      handleLikeChange(postId, true); // Like the post
    } else {
      // If the post is neither liked nor disliked, add it to the disliked list
      setData((prevData) => ({
        ...prevData,
        dislikedPosts: [...prevData.dislikedPosts, postId],
      }));
      handleLikeChange(postId, false); // Dislike the post
    }
  };

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(data));
  }, [data]);

  return (
    <div className="posts">
      <div className="filter-buttons">
        <button
          className={`cta ${filter === "new" ? "active1" : ""}`}
          onClick={() => setFilter("new")}
        >
          <span className="hover-underline-animation"> 🔥new </span>
        </button>
        <button
          className={`cta ${filter === "top" ? "active1" : ""}`}
          onClick={() => setFilter("top")}
        >
          <span className="hover-underline-animation"> 🥇top </span>
        </button>
      </div>
      {loading ? (
        <p>Loading posts...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        posts.map((post, index) => (
          <div className="postblock" key={post._id}>
            <div
              className="post-top"
              // onClick={() => navigate(`/post/${post._id}`)}
            >
              <h2>
                <div className="index">{index}.</div>
                <h1>{post.content}</h1>
              </h2>
              {/* <p>{post.username}</p> */}
              <div className="post-bottom">
                <p>
                  {post.userInstaId ? (
                    <>
                      <p>by &nbsp;</p>
                      <img
                        src={insta}
                        className="instalogo"
                        alt="Instagram Icon"
                      />
                      {""}&nbsp;
                      <a
                        className="userid"
                        href={`https://www.instagram.com/${post.userInstaId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="hover-underline-animation">
                          {post.userInstaId}
                        </span>
                        &nbsp;
                      </a>
                    </>
                  ) : (
                    <>
                      by&nbsp;
                      {post.username}
                    </>
                  )}{" "}
                  {formatDistanceToNow(new Date(post.createdAt))} ago
                </p>

                {/* <p>&nbsp;| Comments: {post.comment.length}</p> */}
              </div>
            </div>
            <div className="ldbuttons">
              <label
                className={`like ${
                  data.likedPosts.includes(post._id) ? "active" : ""
                }`}
                onClick={() => toggleLike(post._id)}
              >
                <svg
                  id="Glyph"
                  version="1.1"
                  viewBox="0 0 32 32"
                  xmlSpace="preserve"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  <path
                    d="M2.156,14.901l2.489-8.725C5.012,4.895,6.197,4,7.528,4h13.473C21.554,4,22,4.448,22,5v14 c0,0.215-0.068,0.425-0.197,0.597l-5.392,7.24C15.813,27.586,14.951,28,14.027,28c-1.669,0-3.026-1.357-3.026-3.026V20H5.999 c-1.265,0-2.427-0.579-3.188-1.589C2.047,17.399,1.809,16.12,2.156,14.901z"
                    id="XMLID_259_"
                  ></path>
                  <path
                    d="M25.001,20h4C29.554,20,30,19.552,30,19V5c0-0.552-0.446-1-0.999-1h-4c-0.553,0-1,0.448-1,1v14 C24.001,19.552,24.448,20,25.001,20z M27.001,6.5c0.828,0,1.5,0.672,1.5,1.5c0,0.828-0.672,1.5-1.5,1.5c-0.828,0-1.5-0.672-1.5-1.5 C25.501,7.172,26.173,6.5,27.001,6.5z"
                    id="XMLID_260_"
                  ></path>
                </svg>
              </label>
              <p>{post.like - post.dislike}</p>
              <label
                className={`dislike ${
                  data.dislikedPosts.includes(post._id) ? "active" : ""
                }`}
                onClick={() => toggleDislike(post._id)}
              >
                <svg
                  id="Glyph"
                  version="1.1"
                  viewBox="0 0 32 32"
                  xmlSpace="preserve"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  <path
                    d="M2.156,14.901l2.489-8.725C5.012,4.895,6.197,4,7.528,4h13.473C21.554,4,22,4.448,22,5v14 c0,0.215-0.068,0.425-0.197,0.597l-5.392,7.24C15.813,27.586,14.951,28,14.027,28c-1.669,0-3.026-1.357-3.026-3.026V20H5.999 c-1.265,0-2.427-0.579-3.188-1.589C2.047,17.399,1.809,16.12,2.156,14.901z"
                    id="XMLID_259_"
                  ></path>
                  <path
                    d="M25.001,20h4C29.554,20,30,19.552,30,19V5c0-0.552-0.446-1-0.999-1h-4c-0.553,0-1,0.448-1,1v14 C24.001,19.552,24.448,20,25.001,20z M27.001,6.5c0.828,0,1.5,0.672,1.5,1.5c0,0.828-0.672,1.5-1.5,1.5c-0.828,0-1.5-0.672-1.5-1.5 C25.501,7.172,26.173,6.5,27.001,6.5z"
                    id="XMLID_260_"
                  ></path>
                </svg>
              </label>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DisplayPosts;
