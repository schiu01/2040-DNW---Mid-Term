
/*
- Purpose: Purpose of this routing script is to handle and render Deletion of Devices Page



*/

module.exports = function (app) {

    // mysql library require
    const mysql_call = require("../mysql_modules/mysql_calls");

    // default Render Page: 
    // Input is Response Handle - so we can print to browser
    // Output is rendering of delete_device.html, with list of devices on the left panel, 
    // available to delete.

    // Console Logs are added to provide verbose errors to console for troubleshooting.


    function defaultRender(res) {
        var con = mysql_call.mysqlConnect();

        // Create Query to retrieve all devices available, and by their location.
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
                // Convert results into a hash, so it can be easily grouped while rendering.

                var devicehash = {};
                var devicehashByType = {};
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
                console.log(devicehash);
                res.render("delete_device.html", { data: devicehash })
                mysql_call.mysqlRelease(con);

            }

        });
    }


    /*
        - Purpose: retrieve readings by device id, outputs json (restful api) for the page to display readings.


    */
    function retrieveReadingById(device_id, res) {

        // Query to retrieve all readings for a particular device (parameterized by device_id)
        var deviceSQL = "select dr.device_id, sd.standard_device_name, \
                            CASE \
                                WHEN dt.device_reading_type_name = 'Off | On' then 'Status' \
                                WHEN dt.device_reading_type_name = 'Open | Close' then 'Status' \
                            ELSE dt.device_reading_type_name END device_reading_type_name, dt.device_reading_data_type, dt.device_reading_unit_short, dt.device_reading_unit_long, dt.decimal_places, dr.device_reading, dr.text_reading\
                            from device_readings dr\
                            inner join devices d on d.device_id = dr.device_id\
                            inner join std_devices sd on sd.standard_device_id = d.standard_device_id\
                            inner join device_reading_types dt on dt.device_reading_type_id = dr.device_reading_type_id \
                            where d.device_id = ?"
        var con = mysql_call.mysqlConnect();

        /*
            has in format of: so we can build the page as a tree.
            hash = {
                "standard_device_name": {id: {key: val, key2: val}, id2: [{key: val}]}
            }

        */
        con.query(deviceSQL, device_id, (err, result) => {
            if (!err) {

                result_hash = {};
                // first pass, initialize the hashes,
                for (var i = 0; i < result.length; i++) {

                    // initialize the array for the hash
                    //var tmp_std_device_name = result[i]["standard_device_name"];
                    var tmp_device_id = result[i]["device_id"];
                    var reading_type_name = result[i]["device_reading_type_name"];

                    // if (result_hash[tmp_std_device_name] == undefined) {
                    //     result_hash[tmp_std_device_name] = {};
                    // }
                    // if (result_hash[tmp_device_id] == undefined) {
                    //     result_hash[tmp_device_id] = []
                    // }
                    if (result[i]["device_reading_data_type"] == "n") {
                        result_hash[reading_type_name] = result[i]["device_reading"] + " " + result[i]["device_reading_unit_short"];
                    } else {
                        result_hash[reading_type_name] = result[i]["text_reading"];
                    }

                }
                console.log(result_hash);
                res.send(result_hash);

            } else {
                res.send(err);
            }
        });


    }

    // Create if statement to run the function by id or default render.
    app.get("/delete_device.html", function (req, res) {
        if (req.query.device_id) {
            retrieveReadingById(req.query.device_id, res)
        } else {
            defaultRender(res);
        }

    });


    // POST method to handle device deletion
    // creates queries to remove data from 2 tables, device_readings and devices
    app.post("/delete_device", function (req, res) {

        const mysql = mysql_call.getMysql();
        var device_id = req.body.device_id;

        var deleteQueries = "";

        // Remove from readings first, 
        deleteQueries = mysql.format("DELETE FROM smarthome.device_readings WHERE device_id = ?;", device_id);

        // then remove from devices table.
        deleteQueries += mysql.format("DELETE FROM smarthome.devices WHERE device_id = ?;", device_id);


        mysql_call.executeQueries(deleteQueries,
            (err) => {

                if (!err) {
                    res.render("delete_result.html", { device_id: device_id, result: 0, action: "Removed!" });
                } else {
                    console.log("Error in retrieval: " + err);
                    res.render("delete_result.html", { device_id: device_id,  result: 1, errmsg: err, action: "!" });
                    mysql_call.mysqlRelease(con);
                }


            },
            (err) => {
                // unsuccessful callback
                res.send("Unsuccessful delete!");
            }

        );
    });

}