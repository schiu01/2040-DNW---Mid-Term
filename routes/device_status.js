
/*
- Purpose: Purpose is to handle display of device statuses/readings


*/

module.exports = function (app) {

    // mysql library require
    const mysql_call = require("../mysql_modules/mysql_calls");


    // default Render is to provide a grouped list of devices in the smarthub
    // Upon clicking on the device, it will show the readings on the right panel.
    function defaultRender(res) {
        var con = mysql_call.mysqlConnect();

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
                // Convert results into a hash, so 
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
                res.render("device_status.html", { data: devicehash })
                mysql_call.mysqlRelease(con);

            }

        });
    }

    // Retireval of readings, 
    // Input is device_id
    // Output json format of all readings to be rendered by the html template.
    function retrieveReadingById(device_id, res) {
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
    app.get("/device_status.html", function (req, res) {
        if (req.query.device_id) {
            retrieveReadingById(req.query.device_id, res)
        } else {
            defaultRender(res);
        }

    });

}