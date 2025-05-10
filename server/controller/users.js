import { signUpUser, checkUserExists, logInUser, getUserById } from '../service/users.js';


export default class User {


  check = async (req, res) => {
    try {
      const { username } = req.body;
      if (!username || typeof username !== 'string') {
        return res.status(400).send('חובה להזין שם משתמש חוקי');
      }
  
      const exists = await checkUserExists(username);
      res.send({ exists }); // מחזיר JSON: { exists: true/false }
    } catch (err) {
      console.error('שגיאה בבדיקת שם משתמש:', err.message);
      res.status(500).send('שגיאה בשרת');
    }
  };
  

signUp = async (req, res) => {
  try {
    const { id,username,email, password } = req.body;

    // if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
    //   return res.status(400).send('חובה לשלוח שם משתמש וסיסמה חוקיים');
    // }

    const userExists = await checkUserExists(username);
    if (userExists) {
      return res.status(409).send('שם המשתמש כבר קיים');
    }

    const newUser = await signUpUser({id, username, email, password });
    res.status(201).send(newUser);
  } catch (err) {
    console.error('שגיאה בהרשמה:', err.message);
    res.status(500).send('שגיאה בשרת');
  }
};

logIn = async (req, res) => {
    try {
      const { username, password } = req.body;

      // ולידציה בסיסית
      if (!username || typeof username !== 'string' ||
          !password || typeof password !== 'string') {
        return res.status(400).send('חובה להזין שם משתמש וסיסמה חוקיים');
      }

      // ניסיון למצוא משתמש עם פרטי ההתחברות
      const user = await logInUser({ username, password });

      if (!user) {
        return res.status(401).send('שם משתמש או סיסמה שגויים');
      }

      // הצלחה — נחזיר את המשתמש (למשל עם id ו־username בלבד)
      res.send({
        id: user.id,
        username: user.username,
        email: user.email 

      });

    } catch (err) {
      console.error('שגיאה בהתחברות:', err.message);
      res.status(500).send('שגיאה בשרת');
    }
}

getById = async (req, res) => {
  try {
    const user = await getUserById(+req.params.id);
    if (!user) return res.status(404).send("משתמש לא נמצא");
    res.send(user);
  } catch (err) {
    console.error("שגיאה בשליפת משתמש:", err.message);
    res.status(500).send("שגיאה בשרת");
  }
};

};


