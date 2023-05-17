const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

global.__basedir = __dirname;

var corsOptions = {
  // origin: "http://localhost:8081"
  origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Role = db.role;

db.sequelize.sync();

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

app.post("/api/third_party_api", (req, res) => {
  const url = 'https://api.mijnwefact.nl/v2/';
  const body = {
    api_key: '1547ed6ac7a15ec4dbc5e27fb59ad2b0',
    controller: 'debtor',
    action: 'show',
    DebtorCode: req.params.code
  };

  try {
    console.log("response"); 
    axios.post(url, body)
    .then(response => {
      console.log(response.data); 
      res.send(response.data);
      // res.send(JSON.stringify(response.data));
    });
  } catch (error) {
    console.log(error);
  }
});

require("./app/routes/user.routes")(app);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });

  Role.create({
    id: 2,
    name: "moderator"
  });

  Role.create({
    id: 3,
    name: "admin"
  });
}