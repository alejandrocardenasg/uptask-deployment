const Sequelize = require('sequelize');
const db = require('../config/db');
const slug = require('slug');
const shortid = require('shortid');
const Usuario = require('./Usuario');

const Proyecto = db.define('proyectos', {

    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: Sequelize.STRING(60)
    },
    url: {
        type: Sequelize.STRING(120)
    }
}, 
{

    hooks: {

        beforeCreate(proyecto){

            const url = slug(proyecto.nombre).toLowerCase();
            proyecto.url = `${url}-${shortid.generate()}`;

        }

    }

});

Proyecto.belongsTo(Usuario,{
    foreignKey:{ allowNull:false}
}) 

module.exports = Proyecto;