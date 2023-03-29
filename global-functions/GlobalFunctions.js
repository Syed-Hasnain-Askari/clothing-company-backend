const nodemailer = require("nodemailer");
const fs = require('fs');
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  secure: true,
  auth: {
    user: "subhan.akram2400@gmail.com",
    pass: "vnnkphdvfletvzqd",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// let mailOptions = {
//   from: "subhan.akram2400@gmail.com",
//   to: "subhan.akram1971@gmail.com",
//   subject: "Hello from Nodemailer",
//   text: "Hello, This is a test email from Nodemailer!",
// };
function sendEmail(mailOptions) {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return error;
    } else {
      console.log("Email sent: " + info.response);

      return true;
    }
  });
}

function writeFile(filePath,csvData){
  fs.writeFile(filePath, csvData, (err) => {
    if (err) {
      console.error(err);
      return "404"
    } else {
      console.log('CSV data written to file');
      return 200
    }
  });
}

module.exports = {
  sendEmail,
  writeFile
};
