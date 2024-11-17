import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateAndEditEmployee from "./pages/CreateAndEditEmployee";
import Home from "./pages/Home";
import store from "./store";
import { Provider } from "react-redux";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-employee" element={<CreateAndEditEmployee />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
