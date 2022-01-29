import React, { useState } from 'react';
import Axios from 'axios';
import "./App.css";
import { useHistory } from "react-router-dom";

export default function Regis() {
        const [usernameReg, setUsernameReg] = useState('');
        const [passwordReg, setPasswordReg] = useState('');
        const history = useHistory();
    

        const register = () => {
            Axios.post("http://localhost:3003/register", {
                username: usernameReg,
                password: passwordReg,
            }).then((Response) => {
                console.log(Response); 
                
            })
            history.push("/");

        }
        return (
            <div className="card regis1">
            <div class="card-header">
            <h3>New user</h3>
            </div>

            <div className="card-body">
            <form>

                <div className="form-group">
                    <input className="form-control" placeholder="Username" type="text" onChange={(e) => { setUsernameReg(e.target.value); }} />
                </div>

                <div className="form-group">
                    <input type="password" className="form-control" placeholder="Password" onChange={(e) => { setPasswordReg(e.target.value); }} />
                </div>

                <button type="button" className="btn btn-primary text-center" onClick={register}>Add</button>
                
            </form>
            
            </div>
        </div>

        );    
}