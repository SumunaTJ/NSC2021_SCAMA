import React, { Component, useState, useEffect } from "react";
import './App.css';
import axios from "axios";
import ProgressBar from "@ramonak/react-progress-bar";
import { MDBIcon } from "mdbreact";
import Swal from 'sweetalert2'
import { red } from "@material-ui/core/colors";

export default function Home() {

  const [fileData, setFileData] = useState([]);
  const [username, setUsername] = useState("");
  const [image, setImg] = useState("")
  const [user, setUser] = useState("");
  const [progress, setProgress] = useState();
  const [check, setCheck] = useState("");

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

  const uploadFile = async (e) => {
    e.preventDefault();
    let formData = await new FormData();
    let iserr = false;
    fileData.forEach(f => {
      console.log(f)
      let fname;
      if (f.id === "1") {
        fname = "original.".concat(f["uploaded_file"]["type"].split("/")[1]);
        

      } else if (f.id === "2") {
        fname = "secret.".concat(f["uploaded_file"]["type"].split("/")[1]);
        
        
      }
      if (fname == '.jpeg' && fname == '.jpg'  && fname == '.JPG') {
        iserr = true;
      }
      formData.append("files", f['uploaded_file'], fname);
    })
    console.log(setUser)
    console.log(formData.getAll('files'))

    if(iserr == false){
      await axios({
        method: "POST",
        url: "http://localhost:3003/upload",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data"
        },
      }).then((res) => {
        console.log(res)
        alert(res.data.message);
        window.location.href = "/show";
      }).catch((error) => {
        console.log(error)
        alert('Failed to fetch');
      });;
    }else{
      alert('Image is incorrect type')
    }
    
  };

  return (
    <div className="container">
      <div className="card cardhide">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="card hide1">
                <div class="card-header">
                  <h3>Upload Original Image</h3>
                </div>
                <div className="card-body">
                  <form>
                    <form>
                      <input class="form-control" id={1} type="file" name="original" onChange={getFile} accept='image/*' required />
                    </form>
                  </form>
                </div>
              </div>
              <br></br><br></br>
            </div>

            <div className="col-md-6">
              <div className="card hide2">
                <div class="card-header">
                  <h3>Upload QR Code Image</h3>
                </div>
                <div className="card-body">
                  <form>
                    <form>
                      <input class="form-control" id={2} type="file" name="hide" onChange={getFile} accept='image/*' required />
                    </form>
                  </form>
                </div>
              </div>
            </div>
          </div>
          
          <br></br>
          
          <p style={{color: red}}><MDBIcon icon="info-circle" size="1x" /> Images can only be uploaded in .jpeg, .jpg, .JPG </p>
          <button type="button" className="btn btn-light-green" onClick={uploadFile}>Hide</button>

        </div>

      </div>

      <br>
      </br>

    </div>
  );
}