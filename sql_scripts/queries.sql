select sd.device_id, std.standard_device_name, std.manufacturer_url,
dt.device_reading_type_name, dt.device_reading_data_type, dt.device_reading_unit_short, dt.device_reading_unit_long,dt.decimal_places,dr.device_reading, dr.text_reading
from smarthome.devices sd 
inner join smarthome.std_devices std on sd.standard_device_id = std.standard_device_id 
inner join smarthome.device_rea
where device_status_code = 1;

select dr.device_id, sd.standard_device_name, dt.device_reading_type_name, dt.device_reading_data_type, dt.device_reading_unit_short, dt.device_reading_unit_long,dt.decimal_places,dr.device_reading, dr.text_reading
 from device_readings dr
 inner join devices d on d.device_id = dr.device_id 
inner join std_devices sd on sd.standard_device_id = d.standard_device_id 
inner join device_reading_types dt on dt.device_reading_type_id = dr.device_reading_type_id