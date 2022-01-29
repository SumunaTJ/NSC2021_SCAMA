import React, { useState, useEffect } from "react";
import './App.css';
import axios from "axios";
import 'react-circular-progressbar/dist/styles.css';
import 'react-slideshow-image/dist/styles.css'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


export default function Home() {

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
        window.location.href = "/hiding";
    }

    const reveal = (e) => {
        e.preventDefault();
        window.location.href = "/reveal";
    }

    const history = (e) => {
        e.preventDefault();
        window.location.href = "/history";
    }



    return (
        <div className="container">
            {/* <div className="row"> */}
                <div className="card hmain" >
                    <div className="card-body">
                        <br></br>
                        <h2>Welcome Back, {user}</h2><br></br><br></br>
                        <div className="column-md-6">
                            <button type="button" className="btn btn-info btn-block text-center h11" onClick={hiding}> Hiding </button>
                            <br></br>
                            <button type="button" className="btn btn-info btn-block text-center h22" onClick={reveal}> Reveal </button>
                            <br></br>
                            <button type="button" className="btn btn-info btn-block text-center h33" onClick={history}> History </button>
                        </div>
                    </div>
                    <br></br>
                </div>
            {/* </div> */}
        </div>
    );
}