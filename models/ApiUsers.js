"use strict"
var md5 = require("md5");

module.exports = function (sequelize, DataTypes) {

	var ApiUsers = sequelize.define ("ApiUsers", {
		id : {
            type : DataTypes.INTEGER (11),
            primaryKey : true,
        	autoIncrement : true
        },
		apiType: DataTypes.STRING (50),
		username: DataTypes.STRING (50),
		password: DataTypes.STRING (200),
		isActive: {
			type: DataTypes.BOOLEAN,
			defaultValue: true
		}
	}, {
		paranoid: true,
		instanceMethods: {
          validPassword: function(password) {
			  console.log('password is :', password)
              return password == this.password;
          },
        }
	});


	return ApiUsers;
};
