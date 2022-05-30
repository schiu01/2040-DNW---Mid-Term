
// -- Project: Mid Term Assignment
// -- Developer: Suk Ching Steven, Chiu
// -- Purpose: Smarthome Hub Web Application
//


// -- Import libraries
// -- Listen on Port 8089
const express = require("express");
const app = express();
const port = 8089;
const bodyParser = require("body-parser")
const expressSanitizer = require("express-sanitizer");
const path = require("path");


// -- Body Parser used for POST methods.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());



// Importing Routes
// For better viewability, the javascript modules have been
// segregated by their functions.
require("./routes/main")(app);
require("./routes/device_status")(app);
require("./routes/update_device")(app);
require("./routes/delete_device")(app);



app.set("views", __dirname + "/views");
app.use("/static",express.static(__dirname + "/static"));
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

// -- Start up Server on specified port.

app.listen(port, () => console.log(`Example app listening in on ${port}`));