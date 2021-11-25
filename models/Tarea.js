const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyecto = require('./Proyecto');

const Tarea = db.define('tareas', {

    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    tarea: Sequelize.STRING(120),
    estado: Sequelize.INTEGER(1),


});

Tarea.belongsTo(Proyecto);

module.exports = Tarea;