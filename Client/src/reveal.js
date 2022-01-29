import React, { Component, useState, useEffect } from "react";
import './App.css';
import axios from "axios";
import { red } from "@material-ui/core/colors";
import { MDBIcon } from "mdbreact";

export default function Reveal() {

  const [fileData, setFileData] = useState([]);
  const [user, setUser] = useState("");


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

  const getFile = (e) => {
    e.preventDefault();

    // Get the file Id
    let id = e.target.id;

    let file = e.target.files[0];

    setFileData((prevstate) => {
      return [...prevstate, { id, uploaded_file: file }];
    });
    console.log(file)
  }

  const uploadFile = (e) => {
    e.preventDefault();
    let formData = new FormData();
    let iserr = false;
    fileData.forEach(f => {
      console.log(f)
      let fname;
      if (f.id === "1") {
        fname = "recapture.".concat(f["uploaded_file"]["type"].split("/")[1]);
      }
      if (fname == '.jpeg' && fname == '.jpg' && fname == '.JPG') {
        iserr = true;
      }
      formData.append("files", f['uploaded_file'], fname);
    })

    console.log(formData.getAll('files'))

    if (iserr == false) {
      axios({
        method: "POST",
        url: "http://localhost:3003/reveal",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data"
        },
      }).then((res) => {
        console.log(res)
        alert(res.data.message);
        window.location.href = "/showre";
      }).catch((error) => {
        console.log(error)
        alert('failed to fetch');
      });;
    } else {
      alert('Image is incorrect type')
    }
  };

  return (
    <div className="container">

      <div className="card cardreveal">
        <div className="card-body">
          <div className="card card2">
            <div className="card-header">
              <h3>Upload Image for Reveal</h3>
            </div>
            <div className="card-body">
              <form>
                <form>
                  <input class="form-control" id={1} type="file" name="original" onChange={getFile} required />
                </form>
              </form>
            </div>
          </div>

          <br></br><br></br>
          <div class="box">
          <p style={{color: red}}><MDBIcon icon="info-circle" size="1x" /> Images can only be uploaded in .jpeg, .jpg, .JPG </p>
            <button type="button" class="btn btn-light-green" onClick={uploadFile}>Reveal</button>
          </div>
        </div>
      </div>




    </div>
  )
}