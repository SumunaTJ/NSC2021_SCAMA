import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { MDBIcon } from "mdbreact";
import 'bootstrap';

function Navbar() {

  const [user, setUser] = useState("");
  const [icon, setIcon] = useState("");
  const [home, setHome] = useState("");
  const [hide, setHide] = useState("");
  const [reveal, setReveal] = useState("");
  const [history, setHistory] = useState("");
  const [box, setBox] = useState("");



  axios.defaults.withCredentials = true

  useEffect(() => {
    axios.get("http://localhost:3003/login").then((response) => {
      if (response.data.loggedIn == true) {
        var avaname = response.data.user[0].username;
        setIcon(<MDBIcon icon="heart" size="1x" />);
        setHome(<Link className="nav-link" to="/main">Home</Link>)
        setHide(<Link className="nav-link" to="/hiding">Hidding</Link>)
        setReveal(<Link className="nav-link" to="/reveal">Reveal</Link>)
        setBox(<button type="button" className="btn btn-danger text-center btn-sm" onClick={logout}>Log out</button>)
      }
    });
  }, []);

  const logout = () => {
    axios.post("http://localhost:3003/logout")
    window.location.href = "/";
  };

  return (
    <nav class="navbar navbar-expand-md navbar-dark bg-dark sticky-top">
      <div class="container-fluid">
        <a href="/main" class="navbar-brand"><MDBIcon icon="camera-retro" size="1x" /> SCAMA</a>
        <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarToggle">
          <span class="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div class="collapse navbar-collapse" id="navbarToggle">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <a href="#" class="nav-link">{home}</a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link">{hide}</a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link"> {reveal}</a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link"> {box}</a>
            </li>
          </ul>
        </div>

      </div>
    </nav>

  )
}

export default Navbar;