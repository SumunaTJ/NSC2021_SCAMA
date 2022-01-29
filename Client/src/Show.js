import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


export default function Show() {

  const [image, setImg] = useState("")
  const [user, setUser] = useState("");
  const [hide, setHide] = useState("");

  const percentage = 66;

  useEffect(() => {
    axios.get("http://localhost:3003/login").then((response) => {
      if (response.data.loggedIn == true) {
        setUser(response.data.user[0].username);
      } else {
        window.location.href = "/";
      }
    });
  }, []);

  useEffect(async () => {
    axios.get("http://localhost:3003/upload").then((data) => {
      console.log(data)
      setImg(data.data.image)
    });
  }, []);


  const back = (e) => {
    e.preventDefault();
    window.location.href = "/show_hide";
  }




  return (
    <div class="container">
      <div className="card cardshow">

        <h1>Image Uploaded</h1>
        <div className="row" style={{ padding: '0' }}>
          <div className="col-sm-6">
            <h5>Original Image</h5>
            <br></br>
            {image && image.map(img => <img src={`http://localhost:3003/${img.tran_uuid}/${img.f_filename}`} alt="img" />)}
          </div>
          <br></br><br></br>
          <div className="col-sm-6">
            <h5>QR-Code Image</h5>
            {image && image.map(img => <img src={`http://localhost:3003/${img.tran_uuid}/${img.s_filename}`} alt="img" />)}
          </div>
        </div>

        <div>
        </div>
        <br></br>
        <div className="box6">
          <button type="button" className="btn btn-success" onClick={back} disabled={hide}>SHOW</button>


        </div>
        <br></br>



      </div>



    </div >
  )
}