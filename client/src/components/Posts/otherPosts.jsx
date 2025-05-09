import React, { useState, useEffect } from "react";
import Post from "./post";
import "../../style/otherPostStyle.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../UserContext";

const OtherPosts = () => {
  const [otherUsersPosts, setOtherUsersPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { user: currentUser } = useUser(); // קבלת המשתמש מה-Context
  
  useEffect(() => {
    if (!currentUser?.id) {
      console.error("User not logged in or missing ID");
      return;
    }

    // משתמש בשדה user_id_ne כדי לסנן שונה ממשתמש נוכחי
    fetch(`http://localhost:3001/posts?user_id_ne=${currentUser.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch other users' posts");
        return res.json();
      })
      .then((data) => {
        setOtherUsersPosts(data);
        setFilteredPosts(data);
      })
      .catch((err) => {
        console.error("Error fetching other users' posts", err);
        setOtherUsersPosts([]);
        setFilteredPosts([]);
      });
  }, [currentUser]);

  useEffect(() => {
    const filtered = otherUsersPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchQuery, otherUsersPosts]);

  return (
    <div className="container">
      {/* כפתור Home */}
      <button className="homeBtn" onClick={() => navigate(`/${currentUser.username}/${currentUser.id}/home`)}>
        Home
      </button>

      <h2>פוסטים של משתמשים אחרים</h2>
      <input
        type="text"
        placeholder="חפש פוסט..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {filteredPosts.length === 0 ? (
        <p>לא נמצאו פוסטים התואמים לחיפוש</p>
      ) : (
        <ul>
          {filteredPosts.map((post) => (
            <Post
              key={post.id}
              post={post}
              selectedPost={selectedPost}
              setSelectedPost={setSelectedPost}
              posts={filteredPosts}
              setPosts={setFilteredPosts}
              currentUser={currentUser}
              allowEditDelete={false} // למנוע אפשרות עריכה ומחיקה
            />
          ))}
        </ul>
      )}

      {selectedPost && (
        <div className="otherPost-details">
          <h3>{selectedPost.title}</h3>
          <p>{selectedPost.content}</p>
        </div>
      )}
    </div>
  );
};

export default OtherPosts;
