const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const {convert} = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');

let transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass, // generated ethereal password
    },
  });

const generarHTML = (archivo, opciones) =>{
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);

    return juice(html);

}

exports.enviar = async(opciones) =>{
    const htmla = generarHTML(opciones.archivo, opciones);
    const text = convert(htmla);
    let options = {
        from: '"UpTask 👻" <noreply@uptask.com>', 
        to: opciones.usuario.email,
        subject: opciones.subject, 
        text: text, 
        html: htmla, 
    };

    const enviarEmail = util.promisify(transporter.sendMail, transporter);
    return enviarEmail.call(transporter, options);

}



