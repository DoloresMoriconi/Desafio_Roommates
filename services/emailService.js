import nodemailer from "nodemailer"
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
   service: "Gmail",
   auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
   }
})


const enviarCorreo = async (correo, asunto, mensaje) => {
   console.log("Enviando correo a:", correo);
   const mailOptions = {
      from: process.env.EMAIL_USER,
      to: correo,
      subject: asunto,
      text: mensaje
   }

   transporter.sendMail(mailOptions, function(error, info) {
      if (error){
         console.log('Error al enviar correo:', error)
      } else {
         console.log('Correo enviado: ' + info.response)
      } 
   })
}

export default enviarCorreo 

