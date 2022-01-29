import React, { useState, useEffect } from "react";
import './App.css';
import axios from "axios";
import 'react-circular-progressbar/dist/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Spinner} from 'react-bootstrap';



export default function ShowReveal() {

    const [user, setUser] = useState("");
    const [image, setImg] = useState([]);
    const [date, setDate] = useState("");
    const [id, setId] = useState("");
    const [load, setLoad] = useState(true);
    const [status, setStatus] = useState("");
    const [err, setErr] = useState("");
    const [show, setShow] = useState(false);
    const [counter, setCounter] = useState(0);

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
        const getData = async (x = 0) => {
            await axios.get("http://localhost:3003/shreveal")
                .then((data) => {
                    if (data.data.image[0].status != 'Completed') {
                        // getData()
                        console.log('Not found')
                        throw (new Error('Not found'))
                    } else {
                        setLoad(false)
                        console.log(data.data.image[0].status)
                        setImg(data.data.image)
                    }
                }).catch(err => {
                    console.log(x)
                    if (x >= 5) {
                        setShow(true)
                        setErr('File not found');
                        console.log(err)
                    } else {
                        setTimeout(getData, 1000, x + 1)
                    }
                });
        }
        setTimeout(getData, 1000)
    }, []);



    return (
        <React.Fragment>
            <Card style={{ width: '25rem', alignItems: 'center', top: '10%', marginLeft: 'auto', marginRight: 'auto' }}>
                <br></br>

                {load && !show && <React.Fragment>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden"></span>
                    </Spinner><br></br>
                    <Card.Title>Processing . . . </Card.Title>
                </React.Fragment>
                }

                {show && <React.Fragment >
                    <br></br>
                    <Card.Title> File not found :( </Card.Title>
                </React.Fragment>}

                {image && image.map(img => (
                    <React.Fragment>
                        <a href={`http://localhost:3003/${img.tran_uuid}/${img.reveal_filename}`} target="_blank" download={`${img.reveal_filename}`}>
                            <img className="original" src={`http://localhost:3003/${img.tran_uuid}/${img.reveal_filename}`} alt="img" style={{ marginTop: '10px' }} />
                        </a><br></br>
                        <Card.Title>Thank you {user}! <br></br>You can download and scan QR Code</Card.Title>
                    </React.Fragment>
                ))}

                <Card.Body>

                    <Card.Text>
                    </Card.Text>
                </Card.Body>
            </Card>

        </React.Fragment >
    );
}

