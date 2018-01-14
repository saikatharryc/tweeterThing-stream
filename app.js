// Include the cluster module
var cluster = require("cluster");
// Code to run if we're in the master process
if (cluster.isMaster) {
    // Count the machine's CPUs
    var cpuCount = require("os").cpus().length;

    // Create a worker
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen to dying workers
    cluster.on("exit", function(worker) {
        console.log("died worker id : %d", worker.id);
        cluster.fork();
    });
} else {
    // Code to run if we're in a worker process
    const express = require("express");
    const config = require("./config");
    const bodyParser = require("body-parser");
    const morgan = require("morgan");
    const mongoose = require("mongoose");
    const app = express();
    var server = require("http").createServer(app);
    const twitter = require("twitter");
    const io = require("socket.io").listen(server);
    const authMiddleware = require("./middlewares/auth");
    var twit = new twitter({
        consumer_key: config.consumer_key,
        consumer_secret: config.consumer_secret,
        access_token_key: config.access_token_key,
        access_token_secret: config.access_token_secret
    });

    const port = process.env.PORT || 3000;

    function handler(req, res) {
        twit.stream(
            "statuses/filter",
            { track: req.query.key || "listen" },
            function(stream) {
                stream.on("data", function(data) {
                    io.sockets.emit("tweet", data.text);
                    console.log("Got a shake .");
                });
            }
        );
        //send the view
        return res.sendFile(__dirname + "/client.html");
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
    console.log("Worker %d running!", cluster.worker.id);

    mongoose.connect(config.mongodbUri);

    const db = mongoose.connection;
    db.on("error", () => {
        throw error;
    });
    db.once("open", () => {
        console.log("connected to mongodb server");
    });
}
