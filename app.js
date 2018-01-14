/* =======================
    LOAD THE DEPENDENCIES
==========================*/
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const app = express();
var server = require("http").createServer(app);
const twitter = require("twitter");
const io = require("socket.io").listen(server);
const authMiddleware = require("./middlewares/auth");
var tweet = io.of("tweet");
var twit = new twitter({
    consumer_key: "50d0PY6PfGVSjkOXUt1WcaCRt",
    consumer_secret: "0ETOPni0cxoNujpRQOumFEVAoEpmerNEzUX8zPU7mXXTk1M1kt",
    access_token_key: "3115230056-njkVQL37r0aGF07k6ZJsHGl7xjbDt0W7NAnj0mL",
    access_token_secret: "Ecsej1mxfdTs5fsR4vGuJAyidSwLNWJl4QGikpuxmjGdD"
});

/* =======================
    LOAD THE CONFIG
==========================*/
const config = require("./config");
const port = process.env.PORT || 3000;

/* =======================
    EXPRESS CONFIGURATION
==========================*/

function handler(req, res) {
    twit.stream(
        "statuses/filter",
        { track: req.query.key || "javascript" },
        function(stream) {
            stream.on("data", function(data) {
                io.sockets.emit("tweet", data.text);
                console.log(".");
            });
        }
    );

    return res.sendFile(__dirname + "/client.html"); //sendthe view
}

// parse JSON and url-encoded query
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// print the request log on console
app.use(morgan("dev"));

// set the secret key variable for jwt
app.set("jwt-secret", config.secret);

// index page, just for testing
app.get("/", (req, res) => {
    res.send("Hi there!");
});

//authenticate from route, i forgot
app.use("/api/v1", authMiddleware);

app.get("/api/v1/client", handler);

// configure api router
app.use("/api", require("./routes/api"));

// open the server
server.listen(port);

/* =======================
    CONNECT TO MONGODB SERVER
==========================*/
mongoose.connect(config.mongodbUri);

const db = mongoose.connection;
db.on("error", console.error);
db.once("open", () => {
    console.log("connected to mongodb server");
});
