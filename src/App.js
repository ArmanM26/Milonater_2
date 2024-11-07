// App.js
import React from "react"; // Importing React
import "./styles.css"; // Importing styles for the application
import Register from "./register"; // Importing the Register component
import Login from "./login"; // Importing the Login component
import Home from "./home/home"; // Importing the Home component
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom"; // Importing routing components from React Router

const App = () => {
  return (
    <div className="app-container">
      {" "}
      {/* // Main container for the application */}
      <Router>
        {" "}
        {/* // Router to manage routing */}
        <nav>
          <Link to="/home">Home</Link> | {/* Link to the main game page */}
          <Link to="/register">Register</Link> |{" "}
          {/* Link to the registration page */}
          <Link to="/login">Login</Link> {/* Link to the login page */}
        </nav>
        <Routes>
          {" "}
          // Define routes for the application
          {/* Home route */}
          <Route path="/home" element={<Home />} />
          {/* Registration page */}
          <Route path="/register" element={<Register />} />
          {/* Login page */}
          <Route path="/login" element={<Login />} />{" "}
          {/* Adding route for login */}
        </Routes>
      </Router>
    </div>
  );
};

export default App; // Exporting the App component
