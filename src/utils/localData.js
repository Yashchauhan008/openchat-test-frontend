const data = {
    username: "",
    userInstaId: "",
    likedPosts: [],
    likedComments: [],
    likedReplies: [],
    dislikedPosts: [],
    dislikedComments: [],
    dislikedReplies: []
  };
  
  // Convert data object to JSON string and store in local storage
  localStorage.setItem('userData', JSON.stringify(data));
  