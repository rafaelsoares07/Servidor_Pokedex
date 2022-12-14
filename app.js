const express = require("express");
const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const http = require("http").Server(app);
const cors = require("cors");

const sockets = require("socket.io")(http, {
  cors: {
    origin: "<http://localhost:3000>"
  }
});


app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello Worldsd")
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
