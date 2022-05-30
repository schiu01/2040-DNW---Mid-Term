CREATE DATABASE smarthome;

-- Standard Device Listing
CREATE TABLE smarthome.std_devices (
    standard_device_id int AUTO_INCREMENT PRIMARY KEY,
    standard_device_name VARCHAR(125) not null,
    standard_device_manufacturer_cd VARCHAR(125),
    manufacturer_url varchar(250)

);

INSERT INTO smarthome.std_devices (standard_device_name, standard_device_manufacturer_cd, manufacturer_url)
VALUES("Google Nest Thermostat", "GOOG-NEST-001","https://store.google.com/ca/product/nest_thermostat?hl=en-GB");

INSERT INTO smarthome.std_devices (standard_device_name, standard_device_manufacturer_cd, manufacturer_url)
VALUES("Google Nest Sensor", "GOOG-NEST-002","https://store.google.com/ca/product/nest_temperature_sensor?hl=en-GB");

INSERT INTO smarthome.std_devices (standard_device_name, standard_device_manufacturer_cd, manufacturer_url)
VALUES("Flume Smart Home Water Sensor", "FLUME-001","https://flumewater.com/");

INSERT INTO smarthome.std_devices (standard_device_name, standard_device_manufacturer_cd, manufacturer_url)
VALUES("Philips Wifi Bulb", "PHILIPS-001","https://www.philips-hue.com/en-ca");

INSERT INTO smarthome.std_devices (standard_device_name, standard_device_manufacturer_cd, manufacturer_url)
VALUES("Philips Smart Switch", "PHILIPS-001","https://www.philips-hue.com/en-ca");

INSERT INTO smarthome.std_devices (standard_device_name, standard_device_manufacturer_cd, manufacturer_url)
VALUES("August Smart Door Lock", "AUG-001","https://august.com/");

INSERT INTO smarthome.std_devices (standard_device_name, standard_device_manufacturer_cd, manufacturer_url)
VALUES("Hello RYSE Smart Shade", "RYSE-001","https://august.com/");

INSERT INTO smarthome.std_devices (standard_device_name, standard_device_manufacturer_cd, manufacturer_url)
VALUES("DIY Windows Sensor", "DIY-001","");

INSERT INTO smarthome.std_devices (standard_device_name, standard_device_manufacturer_cd, manufacturer_url)
VALUES("Google Nest Protect", "GOOG-NEST-003","https://store.google.com/ca/product/nest_protect_2nd_gen?hl=en-GB");

INSERT INTO smarthome.std_devices (standard_device_name, standard_device_manufacturer_cd, manufacturer_url)
VALUES("Airthings Air Quality Monitor", "AQI-001","https://www.airthings.com/en-ca/for-home");

INSERT INTO smarthome.std_devices (standard_device_name, standard_device_manufacturer_cd, manufacturer_url)
VALUES("TP Link Smart Switch", "TP-001","https://www.tp-link.com/ca/home-networking/smart-switch/hs200/");

INSERT INTO smarthome.std_devices (standard_device_name, standard_device_manufacturer_cd, manufacturer_url)
VALUES("TP-Link Wifi Bulb", "TP-002","https://www.tp-link.com/ca/home-networking/smart-bulb/");

INSERT INTO smarthome.std_devices (standard_device_name, standard_device_manufacturer_cd, manufacturer_url)
VALUES("Philips Smart Lightstrips", "PHILIPS-004","https://www.philips-hue.com/en-ca/products/smart-light-strips");

INSERT INTO smarthome.std_devices (standard_device_name, standard_device_manufacturer_cd, manufacturer_url)
VALUES("Google Nest Audio", "GOOGLE-NEST-005","https://store.google.com/ca/product/nest_audio?hl=en-GB");

INSERT INTO smarthome.std_devices (standard_device_name, standard_device_manufacturer_cd, manufacturer_url)
VALUES("Sony Smart TV", "SONY-TV-001","https://www.sony.ca/en/electronics/tv/t/televisions");

INSERT INTO smarthome.std_devices (standard_device_name, standard_device_manufacturer_cd, manufacturer_url)
VALUES("Sony Smart Audio Bar", "SONY-AUDIO-001","https://www.sony.ca/en/electronics/wireless-speakers/lf-s50g");


INSERT INTO smarthome.std_devices (standard_device_name, standard_device_manufacturer_cd, manufacturer_url)
VALUES("Emporia Smart Energy Monitor - Gen2", "EMPORIA-001","https://www.emporiaenergy.com/how-the-vue-energy-monitor-works");


INSERT INTO smarthome.std_devices (standard_device_name, standard_device_manufacturer_cd, manufacturer_url)
VALUES("Sense Home Energy Monitor", "SENSE-001","https://sense.com/");


INSERT INTO smarthome.std_devices (standard_device_name, standard_device_manufacturer_cd, manufacturer_url)
VALUES("Sengled WIFI bulb", "SENGLED-001","https://us.sengled.com/");

INSERT INTO smarthome.std_devices (standard_device_name, standard_device_manufacturer_cd, manufacturer_url)
VALUES("Google WIFI Door lock - Yale", "GOOGLE-NEST-007","https://store.google.com/ca/product/nest_x_yale_lock?hl=en-GB");


INSERT INTO smarthome.std_devices (standard_device_name, standard_device_manufacturer_cd, manufacturer_url)
VALUES("Ecobee Smart Thermostat", "ECOBEE-001","https://www.ecobee.com/en-ca/smart-thermostats/");


-- aqy - 65 Radeon, 2.5 PM, 621 CO2, 1003 pressure, 21 temp, 52 humidity

-- Reading types for devices
-- data type - text, numeric, boolean
-- reading unit can be "short" - say "F" or "C" for Farenheit, Celsius.
-- if boolean, the true could represent an on or open, 
-- false can represent off or closed. - reading is 1 for true, 0 for false.

CREATE TABLE smarthome.device_reading_types (
    device_reading_type_id int AUTO_INCREMENT PRIMARY KEY,
    device_reading_type_name varchar(125) not null,
    device_reading_data_type varchar(1) not null,
    device_reading_unit_short varchar(15),
    device_reading_unit_long varchar(150),
    device_bool_true_val varchar(15),
    device_bool_false_val varchar(15),
    decimal_places int,
    max_value int
);



INSERT INTO smarthome.device_reading_types(device_reading_type_name, device_reading_data_type, device_reading_unit_short, device_reading_unit_long, device_bool_true_val, device_bool_false_val, decimal_places, max_value) VALUES('Temperature','n','C','Celsius',null, null,1, 50);
INSERT INTO smarthome.device_reading_types(device_reading_type_name, device_reading_data_type, device_reading_unit_short, device_reading_unit_long, device_bool_true_val, device_bool_false_val, decimal_places, max_value) VALUES('Humidity','n','%','Percent',null,null,1,100);
INSERT INTO smarthome.device_reading_types(device_reading_type_name, device_reading_data_type, device_reading_unit_short, device_reading_unit_long, device_bool_true_val, device_bool_false_val, decimal_places, max_value) VALUES('Off | On','b','null','null',"On","Off",0,-1);
INSERT INTO smarthome.device_reading_types(device_reading_type_name, device_reading_data_type, device_reading_unit_short, device_reading_unit_long, device_bool_true_val, device_bool_false_val, decimal_places, max_value) VALUES('Open | Close','b','null','null',"Open","Closed",0,-1);
INSERT INTO smarthome.device_reading_types(device_reading_type_name, device_reading_data_type, device_reading_unit_short, device_reading_unit_long, device_bool_true_val, device_bool_false_val, decimal_places, max_value) VALUES('Volume','n','%','Volume Scale',null,null,0,100);
INSERT INTO smarthome.device_reading_types(device_reading_type_name, device_reading_data_type, device_reading_unit_short, device_reading_unit_long, device_bool_true_val, device_bool_false_val, decimal_places, max_value) VALUES('Pressure','n','hPa','hPa',null,null,0,1150);
INSERT INTO smarthome.device_reading_types(device_reading_type_name, device_reading_data_type, device_reading_unit_short, device_reading_unit_long, device_bool_true_val, device_bool_false_val, decimal_places, max_value) VALUES('CO2','n','ppm','Parts Per Mil',null,null,0,5000);
INSERT INTO smarthome.device_reading_types(device_reading_type_name, device_reading_data_type, device_reading_unit_short, device_reading_unit_long, device_bool_true_val, device_bool_false_val, decimal_places, max_value) VALUES('Particle Measure','n','PM','Particle Measure',null,null,1,5);
INSERT INTO smarthome.device_reading_types(device_reading_type_name, device_reading_data_type, device_reading_unit_short, device_reading_unit_long, device_bool_true_val, device_bool_false_val, decimal_places, max_value) VALUES('Electricity','n','W','Watts',null,null,1,10000);
INSERT INTO smarthome.device_reading_types(device_reading_type_name, device_reading_data_type, device_reading_unit_short, device_reading_unit_long, device_bool_true_val, device_bool_false_val, decimal_places, max_value) VALUES('Brightness','n','%','Brightness',null,null,0,100);
INSERT INTO smarthome.device_reading_types(device_reading_type_name, device_reading_data_type, device_reading_unit_short, device_reading_unit_long, device_bool_true_val, device_bool_false_val, decimal_places, max_value) VALUES('Battery Indicator','n','%','Battery',null,null,0,100);
INSERT INTO smarthome.device_reading_types(device_reading_type_name, device_reading_data_type, device_reading_unit_short, device_reading_unit_long, device_bool_true_val, device_bool_false_val, decimal_places, max_value) VALUES('Water Indicator','b','null','null',"Water","Clear",0,-1);
INSERT INTO smarthome.device_reading_types(device_reading_type_name, device_reading_data_type, device_reading_unit_short, device_reading_unit_long, device_bool_true_val, device_bool_false_val, decimal_places, max_value) VALUES('Smoke Detect','b','null','null',"Smoke","Clear",0,-1);
INSERT INTO smarthome.device_reading_types(device_reading_type_name, device_reading_data_type, device_reading_unit_short, device_reading_unit_long, device_bool_true_val, device_bool_false_val, decimal_places, max_value) VALUES('TV Channel','n','Channel','Channel',null,null,0,2000);
INSERT INTO smarthome.device_reading_types(device_reading_type_name, device_reading_data_type, device_reading_unit_short, device_reading_unit_long, device_bool_true_val, device_bool_false_val, decimal_places, max_value) VALUES('Device Location','t',null,null,null,null,0,150);


-- Devices and Reading types - 1 device could have multiple readings - example:
-- thermostats can give temperature and humidity

CREATE TABLE smarthome.std_devices_reading_types (
    standard_device_id int not null,
    device_reading_type_id int not null,
    unique key(standard_device_id, device_reading_type_id)
);

INSERT INTO smarthome.std_devices_reading_types VALUES(1,1);
INSERT INTO smarthome.std_devices_reading_types VALUES(1,2);
INSERT INTO smarthome.std_devices_reading_types VALUES(1,11);
INSERT INTO smarthome.std_devices_reading_types VALUES(1,3);
INSERT INTO smarthome.std_devices_reading_types VALUES(2,1);
INSERT INTO smarthome.std_devices_reading_types VALUES(2,11);
INSERT INTO smarthome.std_devices_reading_types VALUES(3,3);
INSERT INTO smarthome.std_devices_reading_types VALUES(3,12);
INSERT INTO smarthome.std_devices_reading_types VALUES(4,3);
INSERT INTO smarthome.std_devices_reading_types VALUES(5,3);
INSERT INTO smarthome.std_devices_reading_types VALUES(6,4);
INSERT INTO smarthome.std_devices_reading_types VALUES(6,11);
INSERT INTO smarthome.std_devices_reading_types VALUES(7,4);
INSERT INTO smarthome.std_devices_reading_types VALUES(7,11);
INSERT INTO smarthome.std_devices_reading_types VALUES(8,4);
INSERT INTO smarthome.std_devices_reading_types VALUES(8,11);
INSERT INTO smarthome.std_devices_reading_types VALUES(9,7);
INSERT INTO smarthome.std_devices_reading_types VALUES(9,13);
INSERT INTO smarthome.std_devices_reading_types VALUES(9,11);
INSERT INTO smarthome.std_devices_reading_types VALUES(10,7);
INSERT INTO smarthome.std_devices_reading_types VALUES(10,6);
INSERT INTO smarthome.std_devices_reading_types VALUES(10,8);
INSERT INTO smarthome.std_devices_reading_types VALUES(10,11);
INSERT INTO smarthome.std_devices_reading_types VALUES(11,3);
INSERT INTO smarthome.std_devices_reading_types VALUES(12,3);
INSERT INTO smarthome.std_devices_reading_types VALUES(13,3);
INSERT INTO smarthome.std_devices_reading_types VALUES(14,3);
INSERT INTO smarthome.std_devices_reading_types VALUES(14,5);
INSERT INTO smarthome.std_devices_reading_types VALUES(14,11);
INSERT INTO smarthome.std_devices_reading_types VALUES(15,3);
INSERT INTO smarthome.std_devices_reading_types VALUES(15,5);
INSERT INTO smarthome.std_devices_reading_types VALUES(15,14);
INSERT INTO smarthome.std_devices_reading_types VALUES(16,3);
INSERT INTO smarthome.std_devices_reading_types VALUES(16,5);
INSERT INTO smarthome.std_devices_reading_types VALUES(16,11);
INSERT INTO smarthome.std_devices_reading_types VALUES(17,3);
INSERT INTO smarthome.std_devices_reading_types VALUES(17,9);
INSERT INTO smarthome.std_devices_reading_types VALUES(18,3);
INSERT INTO smarthome.std_devices_reading_types VALUES(18,9);
INSERT INTO smarthome.std_devices_reading_types VALUES(19,3);
INSERT INTO smarthome.std_devices_reading_types VALUES(19,11);
INSERT INTO smarthome.std_devices_reading_types VALUES(20,4);
INSERT INTO smarthome.std_devices_reading_types VALUES(20,11);
INSERT INTO smarthome.std_devices_reading_types VALUES(21,1);
INSERT INTO smarthome.std_devices_reading_types VALUES(21,2);
INSERT INTO smarthome.std_devices_reading_types VALUES(1,15);
INSERT INTO smarthome.std_devices_reading_types VALUES(2,15);
INSERT INTO smarthome.std_devices_reading_types VALUES(3,15);
INSERT INTO smarthome.std_devices_reading_types VALUES(4,15);
INSERT INTO smarthome.std_devices_reading_types VALUES(5,15);
INSERT INTO smarthome.std_devices_reading_types VALUES(6,15);
INSERT INTO smarthome.std_devices_reading_types VALUES(7,15);
INSERT INTO smarthome.std_devices_reading_types VALUES(8,15);
INSERT INTO smarthome.std_devices_reading_types VALUES(9,15);
INSERT INTO smarthome.std_devices_reading_types VALUES(10,15);
INSERT INTO smarthome.std_devices_reading_types VALUES(11,15);
INSERT INTO smarthome.std_devices_reading_types VALUES(12,15);
INSERT INTO smarthome.std_devices_reading_types VALUES(13,15);
INSERT INTO smarthome.std_devices_reading_types VALUES(14,15);
INSERT INTO smarthome.std_devices_reading_types VALUES(15,15);
INSERT INTO smarthome.std_devices_reading_types VALUES(16,15);
INSERT INTO smarthome.std_devices_reading_types VALUES(17,15);
INSERT INTO smarthome.std_devices_reading_types VALUES(18,15);
INSERT INTO smarthome.std_devices_reading_types VALUES(19,15);
INSERT INTO smarthome.std_devices_reading_types VALUES(20,15);
INSERT INTO smarthome.std_devices_reading_types VALUES(21,15);


-- Devices added to smart home.
CREATE TABLE smarthome.devices (
    device_id int AUTO_INCREMENT primary key,
    standard_device_id int not null,
    device_status_code int
);


-- Device Readings for smart home devices.
CREATE TABLE smarthome.device_readings (
    device_reading_id int AUTO_INCREMENT PRIMARY key,
    device_id int not null,
    device_reading_type_id int not null,
    device_reading NUMERIC(20,5),
    text_reading varchar(150)
    
);
