import React, { useState, useEffect } from "react";
import './App.css';
import axios from "axios";
import 'react-circular-progressbar/dist/styles.css';
import 'react-slideshow-image/dist/styles.css'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'



export default function History() {

    const [user, setUser] = useState("");
    const [image, setImg] = useState([]);
    const [date, setDate] = useState("");
    const [id, setId] = useState("");
    const [load, setLoad] = useState([]);
    const [check, setCheck] = useState("");
    const MySwal = withReactContent(Swal);

    axios.defaults.withCredentials = true


    useEffect(() => {
        axios.get("http://localhost:3003/login").then((response) => {
            if (response.data.loggedIn == true) {
                setUser(response.data.user[0].username);
            } else {
                window.location.href = "/";
            }
        });
    }, []);

    const hiding = (e) => {
        e.preventDefault();
        window.location.href = "/hhiding";
    }

    const reveal = (e) => {
        e.preventDefault();
        window.location.href = "/hreveal";
    }

    return (
        <div className="container">
            
            <div className="card hmain" >
                <div className="card-body">
                    <h2>History</h2><br></br>
                    <div className="column-md-6">
                        <button type="button" className="btn btn-primary text-center" onClick={hiding}> Hiding </button>
                        <button type="button" className="btn btn-primary text-center" onClick={reveal}> Reveal </button>
                    </div>
                </div>
            </div>
        </div>
    );
}