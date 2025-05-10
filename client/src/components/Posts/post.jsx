import React, { useState } from "react";
import Comments from "./comments";

import "../../style/postStyle.css";

const Post = (data) => {
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "" });

  // טיפול בעריכת פוסט
  const handleEditPost = () => {
    const updatedPost = {
      ...data.selectedPost,
      title: newPost.title || data.selectedPost.title,
      content: newPost.content || data.selectedPost.content,
    };
    fetch(`http://localhost:3001/posts/${data.selectedPost.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPost),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to update post")))
      .then((updatedPostData) => {
        data.setPosts(
          data.posts.map((p) => (p.id === updatedPostData.id ? updatedPostData : p))
        );
        data.setSelectedPost(updatedPostData);
        setIsEditingPost(false);
      })
      .catch((err) => console.error("Error editing post", err));
  };

  // טיפול במחק פוסט
  const handleDeletePost = () => {
    fetch(`http://localhost:3001/posts/${data.selectedPost.id}`, { method: "DELETE" })
      .then(() => {
        data.setPosts(data.posts.filter((p) => p.id !== data.selectedPost.id));
        data.setSelectedPost(null);
      })
      .catch((err) => console.error("Error deleting post", err));
  };

  // טיפול בלחיצה על פוסט
  const handlePostClick = () => {
    if (data.selectedPost?.id === data.post.id) {
      data.setSelectedPost(null); // אם הפוסט שנבחר הוא הפוסט הנוכחי, נסגור אותו
    } else {
      data.setSelectedPost(data.post); // אחרת נבחר את הפוסט הנוכחי
    }
  };

  return (
    <li>
      <button onClick={handlePostClick}>
        {data.post.id}: {data.post.title}
      </button>
      {data.selectedPost?.id === data.post.id && (
        <div>
          {data.currentUser.id === data.post.user_id && (
            <>
              <button
                className="deleteEditBtn"
                onClick={() => {
                  setIsEditingPost(true);
                  setNewPost({
                    title: data.post.title,
                    content: data.post.content,
                  });
                }}
              >
                ערוך
              </button>
              <button className="deleteEditBtn" onClick={handleDeletePost}>
                מחק
              </button>
            </>
          )}

          {isEditingPost ? (
            <>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              />
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              />
              <button onClick={handleEditPost}>שמור שינויים</button>
              <button onClick={() => setIsEditingPost(false)}>בטל עריכה</button>
            </>
          ) : (
            <div className="selected-post">
              <p>
                <strong>כותרת:</strong> {data.post.title}
              </p>
              <p>
                <strong>תוכן:</strong> {data.post.content}
              </p>
              <Comments postId={data.post.id} currentUser={data.currentUser} />
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export default Post;
