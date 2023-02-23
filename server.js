"use strict";
const express = require("express");
const compression = require("compression");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const APP_CONFIG = require("./config/appConfig");
const modeconfig = require("./config/env_mode.json");
const expressJwt = require("express-jwt");
const jwtLib = require("./public/jwtlib");
var session = require("express-session");
const helmet = require("helmet");
var mysql = require("mysql");
const corsOptions = {
  origin : "https://ohmytennis.com/",
  credentials:true,
  optionSuccessStatus :200,
  
}

app.use(cors(corsOptions));


// var con = mysql.createConnection({
//   host: "mysql7003.site4now.net",
//   user: "a2c2cd_tennis",
//   password: "teamwork@2018",
//   database: "db_a2c2cd_tennis",
//   port:"3306"
// });
// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   con.query("SELECT * FROM coaches_dbs", function (err, result, fields) {
//     if (err) throw err;
//     console.log(result);
//   });
// });

// con.on('error', function(err) {
//   console.log('db error', err);
//   if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
//     var con = mysql.createConnection({
//       host: "mysql7003.site4now.net",
//       user: "a2c2cd_tennis",
//       password: "teamwork@2018",
//       database: "db_a2c2cd_tennis",
//       port:"3306"
//     });
//     con.connect(function(err) {
//       if (err) throw err;
//       console.log("Connected!");
//     });        // lost due to either server restart, or a
//   } else {                                      // connnection idle timeout (the wait_timeout
//     throw err;                                  // server variable configures this)
//   }
// });


app.use(compression());
// app.use(cors(APP_CONFIG.CROS_OPTIONS));
app.use(helmet());
// app.use(helmet.noCache());
app.disable("x-powered-by");
app.use(
  bodyParser.json({
    limit: "50mb"
  })
);
app.use(
  bodyParser.text({
    limit: "50mb"
  })
);
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: false,
    parameterLimit: 1000000
  })
);

app.use(function (req, res, next) {
  try {
    if (typeof req.body == typeof "string") {
      req.body = JSON.parse(req.body);
    }
  } catch (err) {
    console.log(err);
  }
  next();
});

app.use(
  session({
    secret: "OhmyTennis",
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 1200000
    }
  })
);

app.use(require("./middleware/custom"));
app.use(require("./middleware/auth"));

app.use(function (req, res, next) {
  // Pass to next layer of middleware
  jwtLib.authenticate(req, res, next);
});

require("./app")(app);

const port = process.env.PORT || 5000;
//app.listen(port, "192.168.1.32", function() {
app.listen(port, function () {
  console.log("Currently running in " + modeconfig.ENVMODE + " Mode");
  console.log("OhMyTennis api listening on port " + port + "!");
});
