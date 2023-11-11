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
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Events from "./pages/Events";
import Venues from "./pages/Venues";

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
              <Route exact path="/authentication" element={user ? (user.role === 2 ? (<Profile/>) : (<Dashboard/>)) : (<Authentication />)} />
              <Route exact path="/dashboard" element={user ? (<Dashboard/>) : (<Authentication />)} />
              <Route exact path="/events" element={user ? (<Events/>) : (<Authentication />)} />
              <Route exact path="/venues" element={user ? (<Venues/>) : (<Authentication />)} />
              <Route exact path="/profile" element={user ? (<Profile/>) : (<Authentication />)} />
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
