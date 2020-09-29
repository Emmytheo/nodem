var express = require('express');
var app = express();
var gps = require("gps-tracking");
var port = process.env.PORT || 9001;
var porte = 800;
console.log("http server started at port 800");
app.listen(porte);
app.use(express.static('site/public'));
app.get('/', function (req, res) {
    console.log("Accessing Homepage");
    // res.sendFile('index.htm', { root: "Books-bootstrap-website-master/src/" });
    res.send("The Fixbot Server is active");

});
var options = {
    'debug': true,
    'port': port,
    'device_adapter': "TK218"
}
var server = gps.server(options, function (device, connection) {
    // console.log('Activating GPS Server on Port 3000');
    /******************************
     LOGIN
     ******************************/
    device.on("login_request", function (device_id, msg_parts) {
        console.log("Hi! i'm login_request", device_id);
        console.log(msg_parts);
        this.login_authorized(true); //Accept the login request.
    });
    device.on('error', function(er){
        console.log("Incoming Error from :" + device.getUID());
        console.log(er.code);
    });

    device.on("login", function () {
        console.log("Hi! i'm " + device.uid);
    });
    device.on('data', function (data) {
        console.log('Data from ' + device.getUID() + ':' + data);
        // for (item in data){
        //     console.log(item);
        // }
        server.send_to(device.getUID(), "Message Recieved")
    });
    //PING -> When the gps sends their position  
    device.on("ping", function (data) {

        //After the ping is received, but before the data is saved
        console.log(data);
        return data;

    });

});
server.setDebug(true);
console.log("gps server started at port " + port);