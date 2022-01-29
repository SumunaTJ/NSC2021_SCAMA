import React, { useState, useEffect } from "react";
import './App.css';
import axios from "axios";
import 'react-circular-progressbar/dist/styles.css';
import 'react-slideshow-image/dist/styles.css'
import { MDBIcon } from "mdbreact";
import { saveAs } from 'file-saver'


export default function Hiding() {

    const [user, setUser] = useState("");
    const [image, setImg] = useState([]);

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

    useEffect(() => {
        axios.get("http://localhost:3003/table").then((data) => {
            console.log(data)
            setImg(data.data.image)
        });
    }, []);

    const downloadImage = (imgPath) => {
        saveAs(`${imgPath}`, `hide.jpeg`)
        // Put your image url here.
    }

    const downori = (imgPath0) => {
        saveAs(`${imgPath0}`, `original.jpeg`)
    }

    const downsec = (imgPath1) => {
        saveAs(`${imgPath1}`, `secret.jpeg`)
    }


    return (
        <div className="container">
            <br></br><br></br><br></br><br></br>
            <h2 style={{ textAlign: "center" }}>Hiding History</h2>
            <a href="/history"><MDBIcon icon="angle-double-left" size="1x" /> Back</a>
            <table className="styled-table" >
                <thead>
                    <th scope="col">Uploaded Date</th>
                    <th scope="col">Original Image</th>
                    <th scope="col">QR-Code Image</th>
                    <th scope="col">Hiding Image</th>
                </thead>
                {image && image.map(img => (
                    <tbody >
                        <tr>
                            <td style={{textAlign: "center"}}>
                                <p>{img.niceDate}</p>
                            </td>
                            <td style={{textAlign: "center"}}> 
                                <a onClick={() => downori(`http://localhost:3003/${img.tran_uuid}/${img.f_filename}`)}>
                                    <img className="original" src={`http://localhost:3003/${img.tran_uuid}/${img.f_filename}`} alt="img" />
                                </a>
                            </td>

                            <td style={{textAlign: "center"}}>
                                <a onClick={() => downsec(`http://localhost:3003/${img.tran_uuid}/${img.s_filename}`)}>
                                    <img ClassName="secret" src={`http://localhost:3003/${img.tran_uuid}/${img.s_filename}`} alt="img" />
                                </a>
                            </td>
                            <td style={{textAlign: "center"}}>
                                <a onClick={() => downloadImage(`http://localhost:3003/${img.tran_uuid}/${img.h_filename}`)} >
                                    <img className="original" src={`http://localhost:3003/${img.tran_uuid}/${img.h_filename}`} alt="img" style={{ marginTop: '10px' }} />
                                </a>
                            </td>
                        </tr>
                    </tbody>
                ))}
            </table>

        </div>
    );
}