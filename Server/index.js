const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const app = express();
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');


const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const { query } = require("express");
const { time } = require("console");
const saltRounds = 10;

let uuid = ''

function getuuid() {
    uuid = uuidv4()
    return uuid
}

app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
    })
);

app.use(express.static("public"));
app.use(express.json());


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
    session({
        key: "userId",
        secret: "hidding",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 1000 * 60 * 60 * 24 * 15,
        },
    })
);

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "password",
    database: "hidding_info",
    timezone: 'local'
});

app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.log(err);
        }

        db.query(
            "INSERT INTO users (username, password) VALUES (?,?)",
            [username, hash],
            (err, result) => {
                console.log(err);
            }
        );
    });
});

app.get("/login", (req, res) => {

    if (req.session.user) {
        res.send({ loggedIn: true, user: req.session.user });

    } else {
        res.send({ loggedIn: false });
    }
});

app.post("/logout", (req, res) => {
    res.clearCookie('userId')
    res.clearCookie('logedIn')
    res.status(200).json('User Logged out')
    console.log("Log out Successful")
})

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "SELECT * FROM users WHERE username = ?;",
        username,
        (err, result) => {
            if (err) {
                res.send({ err: err });
            }

            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (error, response) => {
                    if (response) {
                        req.session.loggedIn = true;
                        req.session.username = username;
                        req.session.user = result;
                        console.log(username)
                        console.log(req.session.user);
                        res.send(result);
                    } else {
                        res.send({ message: "Username or Password Incorrect!" });
                    }
                });
            } else {
                res.send({ message: "User doesn't exist" });
            }
        }
    );
});


app.post("/upload", (req, res) => {
    console.log(req.cookies)
    const dir = __dirname + "/" + "public" + "/" + "hide_" + getuuid();
    console.log(dir)
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
    });

    let upload = multer({
        storage,
    }).array("files", 5);

    upload(req, res, function (err) {
        console.log(req.files)
        const tran = req.files[0].path.split("/")[7];
        console.log(tran)
        try {
            if (req.files) {
                db.query(
                    "INSERT INTO img_info (f_filename, s_filename, tran_uuid, username, u_date, status ) VALUES ('" + req.files[0].filename + "', '" + req.files[1].filename + "', '" + tran + "', '" + req.session.username + "', CURRENT_TIMESTAMP, 'Processing')"
                );
                res.send({
                    status: true,
                    message: "File Uploaded!",
                });
                console.log('file received');

                function filepath(path, original, secret, save) {
                    const spawn = require('child_process').spawn
                    const python = spawn("python", ["predict.py", path, original, secret, save])
                    
                    python.stdout.on('data', function (data) {
                        var result = (data.toString())

                        console.log(result)
                        // console.log(result)
                        console.log(result.split("/")[8])
                        hide = result.split("/")[8]
                        db.query(
                            "UPDATE img_info SET h_filename = '" + hide + "', status = 'Completed'  WHERE tran_uuid =  '" + tran + "'"
                        );
                    })
                }
                
                x = req.files[0].path.split("/")[8]
                // ใส่ชื่อ user ของตัวเองใน path ที่เว้นว่างด้วย ***
                folder_model = '/Users/***/Desktop/NSC2021_SCAMA/Server/output'
                save = '/Users/***/Desktop/NSC2021_SCAMA/Server/public/' + tran + "/" + "hide." + x.split(".")[1]
                save1 = '/Users/***/Desktop/NSC2021_SCAMA/Server/public/' + tran + "/" + "reveal." + x.split(".")[1]
                filepath(folder_model, req.files[0].path, req.files[1].path, save);
            } else {
                res.status(400).send({
                    status: false,
                    data: "File Not Found :(",
                });
            }
        } catch (err) {
            res.status(500).send(err);
        }
    });
});

app.get('/upload', (req, res, result)  => {

    db.query(
        "SELECT * FROM img_info WHERE username = '" + req.session.username + "' ORDER BY id DESC LIMIT 1 ",
        console.log(query),
        (err, result) => {
            res.send({
                image: result
            })

            console.log(result)
            console.log("File Show")
        }
    );
});

app.post("/reveal", (req, res) => {
    console.log(req.session.username)
    const dir = __dirname + "/" + "public" + "/" + "reveal_" + getuuid();
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
    });

    let upload = multer({
        storage,
    }).array("files", 5);

    upload(req, res, function (err) {
        console.log(req.files)
        const tran = req.files[0].path.split("/")[7];
        try {
            if (req.files) {
                db.query(
                    "INSERT INTO img_rev (recap_filename, tran_uuid, username, u_date, status ) VALUES ('" + req.files[0].filename + "', '" + tran + "', '" + req.session.username + "', CURRENT_TIMESTAMP, 'Processing')"
                );
                res.send({
                    status: true,
                    message: "File Uploaded!",
                });
                console.log('file received');

                function FileReveal(path, reveal, save) {
                    const spawn = require('child_process').spawn
                    const python = spawn("python", ["predict_reveal.py", path, reveal, save])

                    python.stdout.on('data', function (data) {
                        var result = (data.toString())
                        console.log(result)
                        console.log(result.split("/")[8])
                        reveal = result.split("/")[8]
                        db.query(
                            "UPDATE img_rev SET reveal_filename = '" + reveal + "', status = 'Completed' WHERE tran_uuid =  '" + tran + "'"
                        );

                    })
                    //console.log(req.files[0].path)
                }
                x = req.files[0].path.split("/")[8]
                // ใส่ชื่อ user ของตัวเองใน path ที่เว้นว่างด้วย ***
                folder_model = '/Users/***/Desktop/NSC2021_SCAMA/Server/output'
                save = '/Users/***/Desktop/NSC2021_SCAMA/Server/public/' + tran + "/" + "reveal." + x.split(".")[1]

                FileReveal(folder_model, req.files[0].path, save);

            } else {
                res.status(400).send({
                    status: false,
                    data: "File Not Found :(",
                });
            }
        } catch (err) {
            res.status(500).send(err);
        }
    });
});

app.get('/shreveal', (req, res, result) => {
    console.log(req.session.username)
    db.query(
        "SELECT * FROM img_rev ORDER BY id DESC LIMIT 1;",
        //"SELECT *, DATE_FORMAT(u_date,'%d %M %Y') AS niceDate FROM img_rev WHERE username = '" + req.session.username + "'",
        console.log(query),
        (err, result) => {
            res.send({
                image: result
            })
            console.log(result)
            console.log("File sent!!")
        }
    );
});

app.get('/table', (req, res, result) => {
    db.query(
        "SELECT *, DATE_FORMAT(u_date,'%d %M %Y') AS niceDate FROM img_info WHERE username = '" + req.session.username + "'",
        console.log(query),
        (err, result) => {
            res.send({
                image: result
            })

            console.log(result)
            console.log("File Sent")
        }
    );
});

app.get('/table_reveal', (req, res, result) => {
    db.query(
        "SELECT *, DATE_FORMAT(u_date,'%d %M %Y') AS niceDate FROM img_rev WHERE username = '" + req.session.username + "'",
        console.log(query),
        (err, result) => {
            res.send({
                image: result
            })

            console.log(result)
            console.log("File Sent")
        }
    );
});


app.listen(3003, () => {
    console.log("Server Running");
    //console.log(uuidv4());
});
