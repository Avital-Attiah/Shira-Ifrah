-- יצירת מסד נתונים (אם לא קיים) ושימוש בו
CREATE DATABASE IF NOT EXISTS Project3DB;
USE Project3DB;

-- מחיקת תוכן הטבלאות אם קיים (לשמירה על עקביות)
DELETE FROM comments;
DELETE FROM todos;
DELETE FROM posts;
DELETE FROM passwords;
DELETE FROM users;
ALTER TABLE users AUTO_INCREMENT = 1;

-- יצירת טבלת משתמשים
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE,
  email VARCHAR(100)
);

-- יצירת טבלת סיסמאות
CREATE TABLE IF NOT EXISTS passwords (
  user_id INT PRIMARY KEY,
  password VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- יצירת טבלת פוסטים
CREATE TABLE IF NOT EXISTS posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(255),
  content TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- יצירת טבלת משימות
CREATE TABLE IF NOT EXISTS todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(255),
  completed BOOLEAN DEFAULT false,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- יצירת טבלת תגובות
CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT,
  user_id INT,
  content TEXT,
  FOREIGN KEY (post_id) REFERENCES posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- הכנסת משתמשים לדוגמה
INSERT INTO users (username, email) VALUES
('Avital', 's@gmail.com'),
('AAAA', 'sss@gmail.com');

-- הכנסת סיסמאות תואמות למשתמשים (בהתאם ל-id במסד)
INSERT INTO passwords (user_id, password) VALUES
(1, '123456'),
(2, 'sssdd11!');

-- הכנסת פוסטים לדוגמה
INSERT INTO posts (user_id, title, content) VALUES
(1, 'פוסט ראשון של אביטל', 'תוכן הפוסט הראשון של אביטל.'),
(1, 'פוסט נוסף של אביטל', 'עוד פוסט מעניין של אביטל.'),
(2, 'פוסט של AAAA', 'פוסט ראשון של המשתמש השני.');

-- הכנסת משימות לדוגמה
INSERT INTO todos (user_id, title, completed) VALUES
(1, 'לקנות מצרכים', false),
(1, 'לסיים פרויקט React', true),
(2, 'לשלוח מייל ללקוח', false);

-- הכנסת תגובות לדוגמה
INSERT INTO comments (post_id, user_id, content) VALUES
(1, 2, 'תגובה של AAAA על הפוסט של אביטל.'),
(1, 1, 'תשובה של אביטל לתגובה.'),
(3, 1, 'אביטל מגיב על הפוסט של AAAA.');
