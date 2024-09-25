import React, { useState } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";

const Login = ({ setToken, setUserId, csrfToken }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // Bytt namn till errorMessage
  const location = useLocation();
  const navigate = useNavigate();

  // Hämtar meddelande från eventuell state-överföring
  const successMessage = location.state?.message;

  // Hanterar login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://chatify-api.up.railway.app/auth/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: credentials.username,
            password: credentials.password,
            csrfToken,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error("Felaktiga inloggningsuppgifter");
      }

      const { token } = result;
      const decodedData = decodeJwt(token);

      // Lagrar användardata i localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", decodedData.id);
      localStorage.setItem("username", decodedData.user);
      localStorage.setItem("avatar", decodedData.avatar);
      localStorage.setItem("email", decodedData.email);

      setToken(token);
      setUserId(decodedData.id);
      setErrorMessage("");

      navigate("/profile");
    } catch (err) {
      console.error("Inloggningen misslyckades:", err);
      setErrorMessage(err.message);
    }
  };

  // Decodar JWT-token
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

  // Hanterar input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/src/components/Assets/Register.svg')" }}
    >
      <div className="bg-white bg-opacity-70 backdrop-blur-md p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h1 className="text-2xl text-center font-semibold mb-6 text-gray-100 tracking-wide">
          Logga In
        </h1>
        {successMessage && (
          <p className="text-green-500 text-center mb-4">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="text-red-600 text-center mb-4">{errorMessage}</p>
        )}
        <form onSubmit={handleLoginSubmit} className="space-y-6">
          <div className="flex flex-col">
            <input
              type="text"
              name="username"
              placeholder="Användarnamn"
              value={credentials.username}
              onChange={handleInputChange}
              required
              className="p-4 rounded-full bg-gray-700 text-white placeholder-gray-400 border border-gray-500"
            />
          </div>
          <div className="flex flex-col">
            <input
              type="password"
              name="password"
              placeholder="Lösenord"
              value={credentials.password}
              onChange={handleInputChange}
              required
              className="p-4 rounded-full bg-gray-700 text-white placeholder-gray-400 border border-gray-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 text-white bg-green-600 rounded-full hover:bg-green-700"
          >
            Logga In
          </button>
        </form>
        <NavLink to="/">
          <button className="w-full mt-3 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700">
            Har du inget konto? Registrera här!
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default Login;
