import React, { useState } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import '../css/Login.css'; 

const Login = ({ setToken, setUserId, csrfToken }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const successMessage = location.state?.message;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://chatify-api.up.railway.app/auth/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken,
          },
          body: JSON.stringify({
            username: credentials.username,
            password: credentials.password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        const apiMessage = result.message || "Felaktiga inloggningsuppgifter";
        if (apiMessage === "Invalid credentials") {
          throw new Error("Ogiltiga inloggningsuppgifter. Kontrollera ditt användarnamn och lösenord.");
        }
        throw new Error(apiMessage);
      }

      const { token } = result;
      const decodedData = decodeJwt(token);

      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", decodedData.id);
      localStorage.setItem("username", decodedData.user);
      localStorage.setItem("avatar", decodedData.avatar);
      localStorage.setItem("email", decodedData.email);

      setToken(token);
      setUserId(decodedData.id);
      setErrorMessage("");

      if (!csrfToken) {
        console.error('CSRF-token saknas');
        setErrorMessage('CSRF-token saknas. Försök igen senare.');
        return;
      }

      navigate("/Chat", {
        state: {
          authToken: token,
          userId: decodedData.id,
          csrfToken: csrfToken,
        },
      });
    } catch (err) {
      console.error("Inloggningen misslyckades:", err);
      setErrorMessage(
        err.message === "Invalid credentials"
          ? "Ogiltigt användarnamn eller lösenord. Försök igen."
          : err.message
      );
    }
  };

  const decodeJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonString = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Misslyckades att decoda token", error);
      return {};
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1 className="login-title">Logga In</h1>
        {successMessage && (
          <p className="success-message">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="error-message">{errorMessage}</p>
        )}
        <form onSubmit={handleLoginSubmit} className="form">
          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="Användarnamn"
              value={credentials.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Lösenord"
              value={credentials.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Logga In
          </button>
        </form>
        <NavLink to="/">
          <button className="register-button">
            Har du inget konto? Registrera här!
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default Login;
