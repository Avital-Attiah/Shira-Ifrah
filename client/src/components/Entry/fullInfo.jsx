import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../style/fullInfoStyle.css";
import { useUser } from "../../UserContext";


// if (!username || !password) {
//   return (
//     <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
//       לא הועברו נתונים מההרשמה. נא לחזור לעמוד הרישום.
//     </div>
//   );
// }


function FullInfo() {
  const location = useLocation();
  const { username, password } = location.state || {}; // Extract data from state


  if (!username || !password) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
        לא הועברו נתונים מההרשמה. נא לחזור לעמוד הרישום.
      </div>
    );
  }

 

  const [formData, setFormData] = useState({
    username: username || "",
    email: "",
    password: password || "",
  });
  
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("address.geo.")) {
      const [_, key] = name.split("geo.");
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          geo: {
            ...prevData.address.geo,
            [key]: value,
          },
        },
      }));
    } else if (name.includes("address.")) {
      const key = name.split("address.")[1];
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [key]: value,
        },
      }));
    } else if (name.includes("company.")) {
      const key = name.split("company.")[1];
      setFormData((prevData) => ({
        ...prevData,
        company: {
          ...prevData.company,
          [key]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    console.log("נשלח לשרת:", {
      id: formData.id,
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });
    

    try {
      console.log("Sending data:", formData);

   
      const response = await fetch("http://localhost:3001/users/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });
      

      if (response.ok) {
        const newUser = await response.json();
        const existingUsers = JSON.parse(localStorage.getItem("user")) || [];
        //localStorage.setItem("user", JSON.stringify([...existingUsers, newUser]));
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));


        setSuccess("המשתמש נוסף בהצלחה!");
       // navigate("/home");
       navigate(`/${newUser.username}/${newUser.id}/home`);

      } else {
        throw new Error("שגיאה בהוספת המשתמש");
      }
    } catch (error) {
      setError("שגיאה בהתחברות לשרת: " + error.message);
    }
  };

  // return (
  //   <div className="full-info-container">
  //     {/* שאר הקוד */}
  //   </div>
  // );

  return (
    <div className="full-info-container">
      <h2>השלמת הרשמה</h2>
      <form onSubmit={handleSubmit} className="full-info-form">
        <label>שם משתמש:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
  
        <label>אימייל:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
  
        <button type="submit">שלח</button>
  
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
    </div>
  );
  
}

export default FullInfo;
