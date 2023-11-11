import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { useAuthContext } from "./hooks/useAuthContext";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Authentication from "./pages/Authentication";
import Profile from "./pages/Profile";

function App() {
  const { user } = useAuthContext();
  
  return (
    <div className="App">
      <BrowserRouter>
            <Navbar />
          <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/signup" element={<Signup />} />
              <Route exact path="/authentication" element={user ? (<Profile/>) : (<Authentication />)} />
              <Route exact path="/profile" element={user ? (<Profile/>) : (<Authentication />)} />
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
