const nodemailer=require('nodemailer');

const sendEmail=async(options)=>{
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "7bf8e80848e3d1",
          pass: "757625d9f701b4"
        }
    });

    const message={
        to:options.email,
        subject:options.subject,
        text:options.message
    };

    await transport.sendMail(message);
}

module.exports=sendEmail;

