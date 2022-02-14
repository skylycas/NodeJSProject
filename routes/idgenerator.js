var crypto = require("crypto");

exports.generateID = function(){
    return crypto.randomBytes(16).toString("hex");
}