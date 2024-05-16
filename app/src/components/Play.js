import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../axiosConfig";
import "../style/game.scss"; 
const Play = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userDetails = location.state?.userDetails;
  const numberPlays = location.state?.numberPlays || 0;
  const [resultsHistory, setResultsHistory] = useState(
    userDetails?.prizes || []
  );
  const [rollsLeft, setRollsLeft] = useState(3 - numberPlays);
  const [errorMessage, setErrorMessage] = useState("");
  const [showGif, setShowGif] = useState(false); 
  const [diceRoll, setDiceRoll] = useState([]);
  useEffect(() => {
    if (rollsLeft <= 0) {
      setErrorMessage("Vous ne pouvez pas jouez plus de 3 fois.");
    }
  }, [rollsLeft]);
  const handlePlayClick = async () => {
    if (rollsLeft > 0) {
      try {
        setShowGif(true);
        const response = await api.post("/game/play");
        const { winnings, messageWin, diceRoll } = response.data;
        setDiceRoll(diceRoll);
        console.log(response.data);

        setTimeout(() => {
          setShowGif(false); //masquage du gif
          setRollsLeft(rollsLeft - 1);
          const result = winnings
            ? `Gagné: ${winnings} ! ${messageWin}`
            : "Perdu";
          setResultsHistory([...resultsHistory, result]);
          setErrorMessage("");
        }, 2000);
      } catch (error) {
        setShowGif(false);
        if (error.response && error.response.status === 403) {
          setErrorMessage(error.response.data);
        } else {
          console.error("Error playing game:", error);
          setErrorMessage(
            "Une erreur est survenue lors de la tentative de jeu."
          );
        }
      }
    } else {
      setErrorMessage(
        "Vous avez atteint le nombre maximal de tentatives autorisées."
      );
    }
  };

  const handleLogout = async () => {
    try {
      const response = await api.post("/auth/logout");
      if (response.status === 200) {
        console.log("Déconnexion réussie");
        localStorage.removeItem("token");
        navigate("/register");
      } else {
        throw new Error("Failed to logout");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const diceImages = [
    "/asset/one-dice.webp", // Remplacez par le chemin correct vers vos images de dés
    "/asset/two-dice.webp",
    "/asset/three-dice.webp",
    "/asset/four-dice.webp",
    "/asset/five-dice.webp",
    "/asset/six-dice.webp",
  ];

  return (
    <div className="game-container">
      <h1>Jeu du Yam's</h1>
      <div className="game-buttons">
        {rollsLeft > 0 && (
          <button onClick={handlePlayClick} className="play-button">Jouer</button>
        )}
        <button onClick={handleLogout} className="logout-button">Déconnexion</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
      <div className="rules-text">
        <h2>Règles du jeu</h2>
        <p>Voici les règles simplifiées du Yam's :</p>
        <ul>
          <li>
            <strong>YAM'S (5/5 dés identiques) :</strong> Gagnez 3 pâtisseries.
          </li>
          <li>
            <strong>CARRÉ (4/5 dés identiques) :</strong> Gagnez 2 pâtisseries.
          </li>
          <li>
            <strong>DOUBLE (2 paires de dés identiques) :</strong> Gagnez 1
            pâtisserie.
          </li>
        </ul>
      </div>
      <div className="results-history">
        <h3>Historique des gains</h3>
        <ul>
          {resultsHistory.map((result, index) => (
            <li key={index}>{result}</li>
          ))}
        </ul>
      </div>
      {/* {errorMessage && <p className="error-message">{errorMessage}</p>} */}
      <p className="rolls-left">
        {rollsLeft} lancer{rollsLeft > 1 ? "s" : ""} restant
        {rollsLeft > 1 ? "s" : ""}.
      </p>
      {showGif && (
        <img
          src="/asset/dice-gif.gif"
          alt="Rolling dice"
          className="rolling-dice"
        />
      )}{" "}
      {!showGif && (
        <div className="dice-results">
          {diceRoll.map((value, index) => (
            <img
              key={index}
              src={diceImages[value - 1]}
              alt={`Dice ${value}`}
              className="dice-image"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Play;
