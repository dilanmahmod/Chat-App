import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

const Register = ({ csrfToken }) => {
  const [user, setUser] = useState({
    username: "",
    password: "",
    email: "",
    avatarUrl: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Hanterar formulärinmatning
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  // Hanterar registrering av ny användare
  const submitRegistration = (e) => {
    e.preventDefault();

    const bodyData = {
      username: user.username,
      password: user.password,
      email: user.email,
      avatar: user.avatarUrl, // Avatar inkluderas i body
      csrfToken,
    };

    fetch("https://chatify-api.up.railway.app/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Username or email already exists");
        }
        // Spara användaruppgifter och skicka till login
        localStorage.setItem("registeredUser", user.username);
        localStorage.setItem("registeredEmail", user.email);
        navigate("/login", { state: { message: "Registration successful" } });
      })
      .catch((error) => setErrorMessage(error.message));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center">
      <div className="w-full max-w-md p-8 rounded-lg bg-opacity-60 backdrop-blur-lg shadow-lg bg-white">
        <h1 className="text-2xl text-center font-semibold mb-6 text-gray-800">
          Skapa Konto
        </h1>
        {errorMessage && (
          <p className="text-center text-red-600 mb-4">{errorMessage}</p>
        )}
        <p className="text-center text-green-500 mb-4">
          Har du redan ett konto?{" "}
          <NavLink to="/login" className="underline text-blue-600">
            Logga in här
          </NavLink>
        </p>
        <form onSubmit={submitRegistration} className="space-y-4">
          <div className="flex flex-col">
            <input
              type="text"
              name="username"
              placeholder="Användarnamn"
              value={user.username}
              onChange={handleInputChange}
              required
              className="p-3 rounded-full bg-gray-800 text-white placeholder-gray-400 border border-gray-400"
            />
          </div>
          <div className="flex flex-col">
            <input
              type="password"
              name="password"
              placeholder="Lösenord"
              value={user.password}
              onChange={handleInputChange}
              required
              className="p-3 rounded-full bg-gray-800 text-white placeholder-gray-400 border border-gray-400"
            />
          </div>
          <div className="flex flex-col">
            <input
              type="email"
              name="email"
              placeholder="E-post"
              value={user.email}
              onChange={handleInputChange}
              required
              className="p-3 rounded-full bg-gray-800 text-white placeholder-gray-400 border border-gray-400"
            />
          </div>
          <div className="flex flex-col">
            <input
              type="text"
              name="avatarUrl"
              placeholder="Avatar URL"
              value={user.avatarUrl}
              onChange={handleInputChange}
              className="p-3 rounded-full bg-gray-800 text-white placeholder-gray-400 border border-gray-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 text-white bg-blue-600 rounded-full hover:bg-blue-700"
          >
            Registrera
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
