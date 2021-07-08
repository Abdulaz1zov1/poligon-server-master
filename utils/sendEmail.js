const nodemailer = require('nodemailer');


  const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    auth: {
      user: 'kamina94@inbox.ru',
      pass: '+998915700004'
    }
  },
      {
        from: 'No reply Karvon.uz <kamina94@inbox.ru>',
      }
  );

  const mailer = message => {
    transporter.sendMail(message,(err,info) => {
      if(err) return console.log(err)
      console.log('Email send: ', info)
    })
  }

module.exports = mailer;
