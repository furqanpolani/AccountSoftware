"use strict"

module.exports = function(sequelize, DataTypes) {

    var Products = sequelize.define("Products", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(500),
            allowNull: false,
            notEmpty: true
        },
        sku: {
            type: DataTypes.STRING(500),
            allowNull: false,
            notEmpty: true
        },
        description: {
            type: DataTypes.TEXT,
        },
        artUrl: {
            type: DataTypes.TEXT
        },
        sellAmount: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0
                }
    }, {
        paranoid: true,
        classMethods: {
            associate: function(models) {
                Products.belongsTo(models.Employees, {allowNull: false, notEmpty: true})
            } 
        },
         instanceMethods: {
            hook : { 
                beforeCreate: function(req,res){
                    if(where(
                        Products.name === req.name)=== ""){
                            res.status(405).json("already exist cant allow for further addition");
                        }
                    if(where(
                        Products.sku === req.sku)=== ""){
                            res.status(405).json("already exist cant allow for further addition");
                        }
                }
            }
          },
          instanceMethods : { 
              hook :
                {
                  beforeCreate(req,res,next){
                    if(req.body.sku === models.Products.sku){ 
                        res.staus(300).send("Already have Product with the same sku") ;
                    }
                      if(req.body.name === models.Products.name){ 
                          res.staus(300).send("Already have Product with the same name") ;
                      }  
                  }
              }
          }

    });
    return Products;
};

