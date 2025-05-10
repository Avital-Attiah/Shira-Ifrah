import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext"; // שימוש ב-UserContext
import { fetchUserById } from "../db-api"; // ← ייבוא הפונקציה החדשה
import "../style/infoStyle.css";

const Info = () => {
  const { user } = useUser(); // קבלת המשתמש מה-Context
  const navigate = useNavigate();
  const [error, setError] = useState(""); // ← הוספה לתיקון השגיאה
  useEffect(() => {
    if (user?.id) {
      fetchUserById(user.id, setError);
    }
  }, [user]);

  if (!user) {
    return <div className="info-container">לא נמצא מידע על המשתמש.</div>;
  }

  return (
    <div className="info-container">
      {/* כפתור ניווט לדף הבית */}
      <button
        className="homeBtn"
        onClick={() => navigate(`/${user.username}/${user.id}/home`)}
      >
        Home
      </button>

      <h1 className="info-title">פרטי המשתמש</h1>
      <ul className="info-list">
        {/* הצגת פרטי המשתמש */}
        <li>
          <strong>מזהה:</strong> {user.id}
        </li>
        <li>
          <strong>שם משתמש:</strong> {user.username}
        </li>
        <li>
          <strong>אימייל:</strong> {user.email}
        </li>
      </ul>
    </div>
  );
};

export default Info;
