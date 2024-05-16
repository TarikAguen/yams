import React from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import Auth from "./components/Auth";
import Play from "./components/Play";
import "../src/style/index.scss";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/register" element={<Auth />} />
          <Route path="/play" element={<Play />} />
          <Route path="/" element={<Auth />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
