// The main.js file of your application



module.exports = function (app) {

    // mysql library require
    //const mysql = require("mysql")
    const mysql_calls = require("../mysql_modules/mysql_calls");

    // function to provide connection to mysql db
    function mysqlConnect() {
        return mysql_calls.mysqlConnect();

    }

    // function to release mysql connectivity
    function mysqlRelease(con) {
        mysql_calls.mysqlRelease(con);

    }
    // Home Page - Index.html
    app.get("/", function (req, res) {
        res.render("index.html")
    });
    // Home Page - Index.html
    app.get("/index.html", function (req, res) {
        res.render("index.html")
    });
    app.get("/about.html", function (req, res) {
        res.render("about.html")
    });


    // Add Device.html provides entry to add new devices
    // to smarthome hub
    app.get("/add_device.html", function (req, res) {
        
        // get connection handle
        con = mysqlConnect();

        // console log it, just so we know its working
        console.log("MysqlConnected for Add Device Page")

        // Query to get standard devices listing and display it on page
        con.query("select * from smarthome.std_devices order by standard_device_manufacturer_cd", function (err, result) {

            // if the get query isn't asking to show the device feature - when link is first navigated into, then
            // do not show the right panel.
            if (req.query.showfeatures) {

                if (!err) {

                    con = mysqlConnect();
                    // Issue query to get all features of a device.
                    con.query("select rt.standard_device_id, rt.device_reading_type_id, dt.device_reading_type_name,\
                                device_reading_data_type, device_reading_unit_short, device_reading_unit_long,  sd.standard_device_name, \
                                sd.manufacturer_url, dt.max_value \
                                from std_devices_reading_types rt \
                                inner join device_reading_types dt on dt.device_reading_type_id = rt.device_reading_type_id \
                                inner join smarthome.std_devices sd on sd.standard_device_id = rt.standard_device_id  \
                                where rt.standard_device_id = " + req.query.id, function (err, device_mapping) {
                        if (err) {
                            res.send(err);
                        } else {
                            res.render("add_device.html", { data: result, mapping: device_mapping , selected: [{id: req.query.id}]})

                        }


                    })

                } else {
                    res.send(err);
                }
                
            } else {
                res.render("add_device.html", { data: result, mapping: [], selected: [{id: 0}] })
            }
                
           //res.send(result);
            
        })
        mysqlRelease(con);
    });





    app.post("/process_add_device", function (req, res) {
        
        var con = mysqlConnect();
        var standard_device_id = req.body.device_id;
        var deviceSQL = "INSERT INTO smarthome.devices(standard_device_id, device_status_code) VALUES(?,1)";
        var new_device_id = -1;
        var featureValues = [];
        
        con.query(deviceSQL, standard_device_id, (err, rows) => {
            if (!err) {

                new_device_id = rows.insertId;
                console.log("last insert id: " + new_device_id);
                if (new_device_id > 0) {

                    // Prepare for bulk insert
                    for (var i in req.body) {
                        if (i.startsWith("id")) {
                            var id_vals = i.split("_")
                            if (isNaN(req.body[i])) {
                                // featureValues.push({
                                //     "device_id": new_device_id,
                                //     "device_reading_type_id": id_vals[1],
                                //     "device_reading": -1,
                                //     "text_reading": req.body[i]
                                // });
                                featureValues.push([new_device_id, id_vals[1], -1, req.body[i]]);

                            } else {
                                //featureValues.push({
                                //     "device_id": new_device_id,
                                //     "device_reading_type_id": id_vals[1],
                                //     "device_reading": req.body[i],
                                //     "text_reading": ""
                                // });
                                featureValues.push([new_device_id, id_vals[1], req.body[i], ""]);

                            }
                        }
                    }


                }
                var featuresSQL = "INSERT INTO smarthome.device_readings(device_id, device_reading_type_id, device_reading, text_reading) values ?";
                // NodeJS being Asynchronous, nesting the subsequent query is required, as we are dependent on creation of device id 
                // before we can inser into device readings.
                con.query(featuresSQL, [featureValues], (err, rows) => {
                    if (!err) {
                        console.log(featureValues.length + " Rows recorded");
                        console.log(featureValues);

                        // Once device readings have been added
                        // we will display success screen, 
                        // or display failure screen.
                        var retrieveSQL = "select dr.device_id, sd.standard_device_name, dt.device_reading_type_name, dt.device_reading_data_type, dt.device_reading_unit_short, dt.device_reading_unit_long,dt.decimal_places,dr.device_reading, dr.text_reading from device_readings dr inner join devices d on d.device_id = dr.device_id inner join std_devices sd on sd.standard_device_id = d.standard_device_id inner join device_reading_types dt on dt.device_reading_type_id = dr.device_reading_type_id where dr.device_id = ?"
                        
                        con.query(retrieveSQL, new_device_id,(err, rows) => {
                            if (!err) {
                                console.log("Querying: " + rows.length);
                                console.log(rows)
                                res.render("results.html", { new_device_id: new_device_id, data: rows, result: 0, action: "Added!" });
                                mysqlRelease(con)
                            } else {
                                console.log("Error in retrieval: " + err);
                                res.render("results.html", { new_device_id: new_device_id, data: [], result: 1, errmsg: err,  action: "!"  });
                                mysqlRelease(con)
                            }
                            
                        })
                        

                    } else {
                        console.log(err);
                        res.render("results.html", { new_device_id: new_device_id, features: featureValues, result: 1, errmsg: err , action: "!"});
                        mysqlRelease(con)
                    }
                })

                

            }
        });
    })

}
