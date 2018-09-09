module.exports = function(express,app) {

    var routes = {};
    var models = require("../models");
    var fs = require("fs");
    


    fs
        .readdirSync(__dirname)
        .filter(function(file) {
            return (file.indexOf(".") !== 0) && (file !== "index.js");
        })
        .forEach(function(file) {

            var cd = file.replace(".js", "");
            routes[cd] = require("./" + file)(express,app, models);
        });


    return routes;
}
