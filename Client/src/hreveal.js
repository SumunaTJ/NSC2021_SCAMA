import React, { useState, useEffect } from "react";
import './App.css';
import axios from "axios";
import 'react-circular-progressbar/dist/styles.css';
import 'react-slideshow-image/dist/styles.css'
import { MDBIcon } from "mdbreact";
import { saveAs } from "file-saver"


export default function Hreveal() {

    const [user, setUser] = useState("");
    const [image, setImg] = useState([]);

    axios.defaults.withCredentials = true


    useEffect(() => {
        axios.get("http://localhost:3003/login").then((response) => {
            if (response.data.loggedIn == true) {
                setUser(response.data.user[0].username);
            }else{
                window.location.href = "/";
              }
        });
    }, []);

    useEffect(() => {
        axios.get("http://localhost:3003/table_reveal").then((data) => {
            console.log(data)
            setImg(data.data.image)
        });
    }, []);


    const downrec = (imgPath0) => {
        saveAs(`${imgPath0}`, `recapture.jpeg`)
    }

    const downrev = (imgPath1) => {
        saveAs(`${imgPath1}`, `reveal.jpeg`)
    }

    return (
            <div className="container">
                <br></br><br></br><br></br><br></br>
                <h2 style={{textAlign: "center"}}>Reveal History</h2>
                <a href="/history"><MDBIcon icon="angle-double-left" size="1x" /> Back</a>
                <table className="styled-table" >
                    <thead>
                        <th scope="col">Uploaded Date</th>
                        <th scope="col">Recapture Image</th>
                        <th scope="col">Reveal Image</th>
                    </thead>
                    {image && image.map(img => ( 
                        <tbody>
                            <tr>
                                <td style={{textAlign: "center"}}>
                                    <p>{img.niceDate}</p>
                                </td>
                                <td style={{textAlign: "center"}}>
                                    <a onClick={() => downrec(`http://localhost:3003/${img.tran_uuid}/${img.recap_filename}`)}>
                                        <img className="original" src={`http://localhost:3003/${img.tran_uuid}/${img.recap_filename}`} alt="img" />
                                    </a>
                                </td>

                                <td style={{textAlign: "center"}}>
                                    <a onClick={() => downrev(`http://localhost:3003/${img.tran_uuid}/${img.reveal_filename}`)}>
                                        <img ClassName="secret" src={`http://localhost:3003/${img.tran_uuid}/${img.reveal_filename}`} alt="img" />
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    ))}
                </table>
            </div>
    );
}