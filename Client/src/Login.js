import React, { useState, useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import Axios from 'axios';
import './App.css';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();
    const [loginStatus, setLoginStatus] = useState("");

    Axios.defaults.withCredentials = true

    const login = async () => {
        await Axios.post("http://localhost:3003/login", {
            username: username,
            password: password,
        }).then((response) => {
            if (response.data.message) {
                setLoginStatus(response.data.message);
            } else {
                setLoginStatus(response.data[0].username);
                window.location.href = "/main";
            }
        });
    };

    useEffect(() => {
        Axios.get("http://localhost:3003/login").then((response) => {
            if (response.data.loggedIn == true) {
                setLoginStatus(response.data.user[0].username);
            }

        });
    }, []);

    return (
        <div classname="container" >
            <div className="card card1" >
                <div className="card-body">
                <br></br><br></br>
                <h3><b>Log in</b></h3>
                <br></br><br></br>
                    <form>
                        <div className="form-group">
                            <input type="text" placeholder="Username" className="form-control" onChange={(e) => { setUsername(e.target.value); }} />
                        </div>

                        <div className="form-group">
                            <input type="password" placeholder="Password" className="form-control" onChange={(e) => { setPassword(e.target.value); }} />
                        </div>

                        <button type="button" className="btn btn-primary text-center" onClick={login}> Login </button>
                        <br /><br />
                        <p>{loginStatus}</p>

                        <a href="/regis">New user?</a>
                        <br></br><br></br>
                    </form>
                </div>
            </div>
        </div>
    );

}