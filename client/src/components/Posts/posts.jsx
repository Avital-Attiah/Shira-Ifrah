import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/postStyle.css";
import Post from "./post";
import { useUser } from "../../UserContext";

const Posts = () => {
  const { user: currentUser } = useUser();
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:3001/posts?user_id=${currentUser.id}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch posts");
        return res.json();
      })
      .then(data => setPosts(data))
      .catch(err => console.error("Error fetching posts", err));
  }, [currentUser, navigate]);

  const filteredPosts = searchTerm
    ? posts.filter(
        post =>
          post.title.includes(searchTerm) ||
          post.id.toString().includes(searchTerm)
      )
    : posts;

  const handleAddPost = () => {
    const post = {
      title: newPost.title.trim(),
      content: newPost.content.trim(),
      user_id: currentUser.id
    };

    fetch("http://localhost:3001/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to add post");
        return res.json();
      })
      .then(createdPost => {
        setPosts(prev => [...prev, createdPost]);
      })
      .catch(err => console.error("Error adding post", err));

    setNewPost({ title: "", content: "" });
  };

  return (
    <div className="container">
      <button
        className="homeBtn"
        onClick={() =>
          navigate(`/${currentUser.username}/${currentUser.id}/home`)
        }
      >
        Home
      </button>

      <div className="add-post">
        <h2>הוסף פוסט חדש</h2>
        <input
          type="text"
          placeholder="כותרת"
          value={newPost.title}
          onChange={e => setNewPost({ ...newPost, title: e.target.value })}
        />
        <textarea
          placeholder="תוכן"
          value={newPost.content}
          onChange={e => setNewPost({ ...newPost, content: e.target.value })}
        />
        <button onClick={handleAddPost} className="addPostBtn">
          הוסף פוסט
        </button>
      </div>

      <button
        className="otherBtn"
        onClick={() =>
          navigate(`/${currentUser.username}/${currentUser.id}/otherPosts`)
        }
      >
        פוסטים אחרים
      </button>

      <div className="search-bar">
        <input
          type="text"
          placeholder="חפש פוסט לפי כותרת או מזהה"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="my-posts">
        <h2>הפוסטים שלי</h2>
        <ul>
          {filteredPosts.map(post => (
            <Post
              key={post.id}
              post={post}
              selectedPost={selectedPost}
              setSelectedPost={setSelectedPost}
              posts={posts}
              setPosts={setPosts}
              currentUser={currentUser}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Posts;
