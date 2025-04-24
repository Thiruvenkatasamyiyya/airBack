import nodemailer from 'nodemailer'
import jwt  from 'jsonwebtoken';
import emailTemplate from './emailTemplate.js';

export const makeToken = async(user) =>{
    
    const token = jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn : '15m'})

    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: "7a5b4bbf494d4a",
          pass: "c7fc6ed721a763",
        },
      });
      
      // async..await is not allowed in global scope, must use a wrapper
      async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
          to: user.email, // list of receivers
          subject: "Password reset", // Subject line
          html: await emailTemplate(`http://localhost:3000/api/v1/reset/${token}`,user.name),
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
      }
      main().catch(console.error)

      return {
        token : token,
        expires : Date.now() +15 *60 * 1000
      }
}

export const verifyToken = async(token) =>{

  return jwt.verify(token,process.env.JWT_SECRET)
}

export const sendChanged = (user)=>{

  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "7a5b4bbf494d4a",
      pass: "c7fc6ed721a763",
    },
  });
  
  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
      to: user.email, // list of receivers
      subject: "Password reset " + user.name, // Subject line
      text: `password has successully changed`, // plain text body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }
  main().catch(console.error)
}
