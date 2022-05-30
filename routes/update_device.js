// - Middlware module: Update Device
// - Purpose: Update engine for updating of device readings
// - Route Pages: update_device.html
// - How it works: 
// -  Default Call to the update_device.html generates a list of devices that has been added
// -  Clicking on the device, passes device_id parameter into the query and responds as REST API, so update device html can handle it.
// -  update_device.js detects the query parameter, and responds back with database result.
// -  update_device.html is rendered.
// -  submit button passes back as POST method, and changes are saved.


module.exports = function (app) {

    // mysql calls are separated into its own module for re-usability
    //
    const mysql_call = require("../mysql_modules/mysql_calls");

    // Default Render of update_device.html page, with list of devices on the left side of the panel
    function defaultRender(res) {
        var con = mysql_call.mysqlConnect();

        // Query to retrieve deive name, location, so it can be grouped together by device type and location under it.
        var deviceSQL = "SELECT d.device_id, sd.standard_device_name, dt.device_reading_type_name, dr.text_reading FROM smarthome.devices d \
                        INNER JOIN smarthome.std_devices sd ON d.standard_device_id = sd.standard_device_id \
                        INNER JOIN smarthome.device_readings dr on dr.device_id = d.device_id \
                        INNER JOIN smarthome.device_reading_types dt on dt.device_reading_type_id = dr.device_reading_type_id \
                        where dr.device_reading_type_id = 15 \
                        order by \
                        sd.standard_device_name, dr.text_reading"
        
        
        con.query(deviceSQL, (err, device_results) => {
            if (err) {
                console.log(err);
            } else {

                // Convert results into a hash, easier to refer back later to the device id
                var devicehash = {};
                //var devicehashByType = {};
                for (var i = 0; i < device_results.length; i++) {
                    var d_id = device_results[i]["device_id"];
                    var std_name = device_results[i]["standard_device_name"];
                    if (devicehash[std_name] == undefined) {
                        devicehash[std_name] = {};
                    }

                    if (devicehash[std_name][d_id] == undefined) {
                        devicehash[std_name][d_id] = {};
                    }
                    devicehash[std_name][d_id]["location"] = device_results[i]["text_reading"];

                    
                }

                // Log to console, so we can see how the devie hash has been built
                // easily  used as reference for later.
                console.log(devicehash);
                res.render("update_device.html", { data: devicehash })
                mysql_call.mysqlRelease(con);

            }

        });
    }

    function retrieveReadingById(device_id, res) {
        var deviceSQL = "SELECT  \
            dr.device_reading_id, \
            d.device_id, \
            sd.standard_device_name, \
            dt.device_reading_type_name, \
            dr.device_reading, \
            dr.text_reading, \
            dt.device_reading_data_type, \
            dt.device_bool_true_val, \
            dt.device_bool_false_val, \
            dt.max_value \
        FROM smarthome.devices d \
        INNER JOIN smarthome.std_devices sd ON d.standard_device_id = sd.standard_device_id \
        INNER JOIN smarthome.device_readings dr on dr.device_id = d.device_id \
        INNER JOIN smarthome.device_reading_types dt on dt.device_reading_type_id = dr.device_reading_type_id \
        where \
        d.device_id = ? \
        order by \
        sd.standard_device_name, dr.text_reading" ;
        var con = mysql_call.mysqlConnect();

        /*
            has in format of: so we can build the page as a tree.
            hash = {
                "standard_device_name": {id: {key: val, key2: val}, id2: [{key: val}]}
            }

        */
        con.query(deviceSQL, device_id, (err, result) => {
            if (!err) {
                
                console.log(result);
                res.send(result);    
                
            } else {
                console.log(err);
                res.send(err);
            }
        });
        
        
    }


    /// Handler for update_device.html, if there is a query for device_id
    // return REST json result, otherwise do default render.
    app.get("/update_device.html", function (req, res) {
        if (req.query.device_id) {
            retrieveReadingById(req.query.device_id, res)
        } else {
            defaultRender(res);
        }

    });

    app.post("/update_device", function (req, res) {
        
        const mysql = mysql_call.getMysql();
        var device_id = req.body.device_id;
        
        var updateQueries = "";
        // prevent sql injection by sanitizing the boolean / text values as those
        /// are freeform text fields to be stored.
        Object.keys(req.body).forEach((formKey) => {
            if (formKey.startsWith("id")) {
                var idkey = formKey.split("_");
                var device_reading_id = idkey[1];
                var data_type = idkey[2];
                if ((data_type == "t") || (data_type == "b")) {
                    updateQueries += mysql.format("UPDATE smarthome.device_readings SET text_reading=? WHERE device_reading_id=? ;", [req.sanitize(req.body[formKey]), device_reading_id]);
                } else {
                    updateQueries += mysql.format("UPDATE smarthome.device_readings SET device_reading=? WHERE device_reading_id=? ;", [req.body[formKey], device_reading_id]);
                }

        
            }
        });

        mysql_call.executeQueries(updateQueries,
            (err) => {
                // successful callback
                var con = mysql_call.mysqlConnect();
                var retrieveSQL = "select dr.device_id, sd.standard_device_name, dt.device_reading_type_name, dt.device_reading_data_type, dt.device_reading_unit_short, dt.device_reading_unit_long,dt.decimal_places,dr.device_reading, dr.text_reading from device_readings dr inner join devices d on d.device_id = dr.device_id inner join std_devices sd on sd.standard_device_id = d.standard_device_id inner join device_reading_types dt on dt.device_reading_type_id = dr.device_reading_type_id where dr.device_id = ?"

                con.query(retrieveSQL, device_id, (err, rows) => {
                    if (!err) {
                        console.log("Querying: " + rows.length);
                        console.log(rows)
                        res.render("results.html", { device_id: device_id, data: rows, result: 0, action: "Updated!" });
                        mysql_call.mysqlRelease(con)
                    } else {
                        console.log("Error in retrieval: " + err);
                        res.render("results.html", { device_id: device_id, data: [], result: 1, errmsg: err, action: "!"});
                        mysql_call.mysqlRelease(con);
                    }

                });


                
            },
                    (err) => {
                        // unsuccessful callback
                        res.send("Unsuccessful Update!");
                    }

        );
        
    });

}