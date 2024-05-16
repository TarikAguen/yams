import React, { useState, useEffect } from "react";
import api from "../axiosConfig";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import "../style/index.scss";

const Auth = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isRegistering, setIsRegistering] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegistering ? "/auth/register" : "/auth/login";
      const response = await api.post(endpoint, formData);

      if (response.status === 201) {
        setSuccessMessage(
          "Compte créé. Vous pouvez maintenant vous connecter."
        );
        setFormData({ username: "", password: "" });
      } else if (response.status === 200) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        const numberPlays = response.data.user.plays;
        console.log(numberPlays);
        dispatch(setUser({ username: user.username, token }));
        navigate("/play", { state: { userDetails: user, numberPlays: user.plays } });
      } else {
        setErrorMessage("Une erreur est survenue.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage("Compte déjà créé.");
      } else if (error.response && error.response.status === 401) {
        setErrorMessage("Identifiants invalides.");
      } else {
        console.error(
          isRegistering ? "Registration failed:" : "Login failed:",
          error
        );
        setErrorMessage("Erreur lors de la connexion ou de l'inscription.");
      }
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="auth-container">
      <h1>{isRegistering ? "Inscription" : "Connexion"}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom d'utilisateur</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Mot de passe</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">
          {isRegistering ? "Inscription" : "Connexion"}
        </button>
      </form>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <button
        className="toggle-button"
        onClick={() => setIsRegistering(!isRegistering)}
      >
        {isRegistering
          ? "Vous avez déjà un compte ? Connectez-vous"
          : "Pas encore de compte ? Inscrivez-vous"}
      </button>
    </div>
  );
};

export default Auth;
