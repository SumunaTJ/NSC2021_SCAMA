import React, { useState, useEffect } from 'react';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Axios from 'axios';
import Login from './Login';
import Main from './main';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Home from './home';
import Regis from './Regis';
import Show from './Show';
import Header from './Navbar';
import Reveal from './reveal'
import ShowReveal from './show_re'
import Hiding from './hhiding.js'
import Hreveal from './hreveal.js'
import History from './history.js';
import ShowReUp from './showre.js'
import ShowHide from './show_hide.js'
import Footer from './Footer.js';
import Disclam from './disclam.js'

function App() {
  const [loginStatus, setLoginStatus] = useState("");

  Axios.defaults.withCredentials = true

  useEffect(() => {
    Axios.get("http://localhost:3003/login").then((response) => {
      if (response.data.loggedIn == true) {
        setLoginStatus(response.data.user[0].username);
        console.log(response.data.user[0].username)
      }else{
      }

    });
  }, []);

  return (
    <Router>
      <div className="App">
        <Header />
        <Switch>
        <Route exact path="/" component={Disclam} />
          <Route exact path="/login" component={Login} />
          <Route path='/hiding' component={Home} />
          <Route path="/regis" component={Regis} />
          <Route path="/show" component={Show} />
          <Route path="/main" component={Main} />
          <Route path="/reveal" component={Reveal} />
          <Route path="/show_re" component={ShowReveal} />
          <Route path="/hhiding" component={Hiding} />
          <Route path="/hreveal" component={Hreveal} />
          <Route path="/history" component={History} />
          <Route path="/showre" component={ShowReUp} />
          <Route path="/show_hide" component={ShowHide} />
        </Switch>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
