const express = require('express');
const routes = require('./routes/index.js');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

//IMPORTAR VARIABLES DE ENTORNO
require('dotenv').config({path: 'variables.env'});

// Helpers
const helpers = require('./helpers');

// Crear la conexión a la base de datos

const db = require('./config/db');

// Importar los modelos

require('./models/Proyecto');
require('./models/Tarea');
require('./models/Usuario');

db.sync()
    .then(()=> console.log("Conectado a la base de datos"))
    .catch((error) =>console.log(error))

//Crear una aplicación de express

const app = express();

// Habilitar bodyParser para leer datos de un formulario

app.use(bodyParser.urlencoded({extended: true}));

// Habilitar motor de plantilla pug

app.set('view engine', 'pug');

// Vistas

app.set('views', path.join(__dirname, './views'));

// Sesión flash

app.use(flash());

app.use(cookieParser());

// Sesiones

app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

//Pasar vardump a la aplicación

app.use((req,res,next) =>{

    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();

});

// Archivos estáticos

app.use(express.static('public'));

// Rutas

app.use('/', routes());

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host,  ()=>{
    console.log('El servidor esta funcionando');
});