import React, { useState, useEffect } from "react";

// קומפוננטת תגובות עם חיבור לשרת
const Comments = ({ postId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newContent, setNewContent] = useState("");

  // קריאה ראשונית של תגובות עבור פוסט מסוים
  useEffect(() => {
    fetch(`http://localhost:3001/comments?post_id=${postId}`)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(err => console.error("Error fetching comments", err));
  }, [postId]);

  // הוספת תגובה חדשה
  const handleAddComment = () => {
    const text = newContent.trim();
    if (!text) return;

    const payload = {
      post_id: postId,
      user_id: currentUser.id,
      content: text
    };

    fetch("http://localhost:3001/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to add comment");
        return res.json();
      })
      .then(comment => {
        setComments(prev => [...prev, comment]);
        setNewContent("");
      })
      .catch(err => console.error("Error adding comment", err));
  };

  // מחיקת תגובה
  const handleDeleteComment = (commentId) => {
    fetch(`http://localhost:3001/comments/${commentId}`, { method: "DELETE" })
      .then(res => {
        if (!res.ok) throw new Error("Failed to delete comment");
        setComments(prev => prev.filter(c => c.id !== commentId));
      })
      .catch(err => console.error("Error deleting comment", err));
  };

  // עריכת תגובה קיימת
  const handleEditComment = (comment) => {
    const updatedText = prompt("ערוך את התגובה", comment.content);
    if (updatedText == null) return; // ביטול
    const text = updatedText.trim();
    if (!text) return;

    const payload = {
      post_id: postId,
      user_id: currentUser.id,
      content: text
    };

    fetch(`http://localhost:3001/comments/${comment.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to update comment");
        return res.json();
      })
      .then(updated => {
        setComments(prev => prev.map(c => c.id === updated.id ? updated : c));
      })
      .catch(err => console.error("Error editing comment", err));
  };

  return (
    <div className="comments-section">
      <h3>תגובות</h3>
      <ul>
        {comments.map(c => (
          <li key={c.id}>
            <span>{c.content}</span>
            {/* אפשרות עריכה ומחיקה רק לבעל התגובה */}
            {c.user_id === currentUser.id && (
              <>  
                <button onClick={() => handleEditComment(c)}>ערוך</button>
                <button onClick={() => handleDeleteComment(c.id)}>מחק</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <div className="add-comment">
        <textarea
          placeholder="הזן תגובה חדשה"
          value={newContent}
          onChange={e => setNewContent(e.target.value)}
        />
        <button onClick={handleAddComment}>הוסף תגובה</button>
      </div>
    </div>
  );
};

export default Comments;
