import React from "react";
import NavBar from "./components/Navbar";
import "./App.css"
import { BrowserRouter , Route } from "react-router-dom";
import Home from "./components/screens/Home"
import Login from "./components/screens/Login"



function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Route extact path="/">
        <Home />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
    </BrowserRouter>
  );
}

export default App;
