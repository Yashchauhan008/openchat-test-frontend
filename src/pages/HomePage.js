import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/home.css";
import logo from "../assets/logo.png";
import avatar1 from "../assets/avatar1.jpeg";
import avatar2 from "../assets/avatar2.jpeg";
import avatar3 from "../assets/avatar3.jpeg";
import Swal from 'sweetalert2';

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
    dislikedReplies: [],
  });

  useEffect(() => {
    const savedData = localStorage.getItem("userData");
    if (savedData) {
      const userData = JSON.parse(savedData);
      // if (userData.username) {
      //   navigate("/posts");
      // }
    }
  }, [navigate]);

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   alert("once the username is save then it can not be change")
  //   const newData = { ...data, username: username };
  //   setData(newData);
  //   localStorage.setItem("userData", JSON.stringify(newData));
  //   console.log("Data stored in local storage:", newData);

  //   setUsername(""); // Clear input field after submission
  //   navigate("/posts"); // Navigate to '/posts' route after form submission
  // };
  const handleSubmit = (e) => {
    e.preventDefault();
  
    Swal.fire({
      title: 'Are you sure?',
      text: 'Once the username is saved, it cannot be changed',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, save it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        const newData = { ...data, username: username };
        setData(newData);
        localStorage.setItem('userData', JSON.stringify(newData));
        console.log('Data stored in local storage:', newData);
  
        setUsername(''); // Clear input field after submission
        navigate('/posts'); // Navigate to '/posts' route after form submission
      }
    });
  };
  return (
    <>
      <div className="home">
        <a className="yash-banner" href="">
          <h2>
            made with ❤️ by <span>YASH</span>
          </h2>
        </a>
        <nav>
          <div className="lnav">
            <img src={logo} />
            <h2>opentalk</h2>
          </div>
          <div className="rnav"></div>
        </nav>
        <div className="home-cnt">
          <div className="lhome">
            <div className="headline">
              <h2>
                <h1>
                  <span>Connect</span> with
                </h1>
                <h1>your circle in </h1>
                <h1>a fun way!</h1>
              </h2>
            </div>
            <div className="description">
              <p>
                Welcome to OpenTalk, a platform where you can share your
                thoughts anonymously. No account needed, just write, like, and
                dislike freely!
              </p>
            </div>
            <form onSubmit={handleSubmit} className="homeform">
              <input
                placeholder="@username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <button className="gobutton" type="submit">
                let's talk
                <div class="arrow-wrapper">
                  <div class="arrow"></div>
                </div>
              </button>
            </form>
            <div className="emoji emoji10">👌</div>
            <div className="emoji emoji11">👻</div>
          </div>
          <div className="rhome">
            <div className="chatblock">
              <div className="interection">
                <div className="inter-elem">💖</div>
                <div className="inter-elem">👍</div>
                <div className="inter-elem">👻</div>
                <div className="inter-elem">👎</div>
              </div>
              <h1 className="chat chat1">web3 is booming</h1>
              <h1 className="chat chat2">My new site is launch check out</h1>
              <div className="avt-cover av1">
                <div className="avatar avatar1">
                  <img src={avatar3} />
                </div>
              </div>
              <div className="avt-cover av2">
                <div className="avatar avatar2">
                  <img src={avatar2} />
                </div>
              </div>
              <div className="avt-cover av3">
                <div className="avatar avatar3">
                  <img src={avatar1} />
                </div>
              </div>
            </div>
            <div className="emoji emoji1">💖</div>
            <div className="emoji emoji2">💖</div>
            <div className="emoji emoji3">😂</div>
            <div className="emoji emoji4">😂</div>
            <div className="emoji emoji5">👎</div>
            <div className="emoji emoji6">👍</div>
            <div className="emoji emoji7">👍</div>
            <div className="emoji emoji8">👌</div>
            <div className="emoji emoji9">👻</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
