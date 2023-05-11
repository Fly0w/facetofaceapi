import nodemailer from 'nodemailer';

const EMAIL = process.env.EMAILMAIL;
const PASSWORD = process.env.MAILMDP;

let transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: "587",
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
  auth: {
    user: EMAIL,
    pass: PASSWORD
  }
});

// Function that returns a positive response if the email is in the database, and also sends 
// an email to the user's email adress with the rest password form.
export const checkExistingEmail = (req, res, db) => {
    const { email } = req.body;
    db.select('*').from('users')
        .where({email : email})
        .then(user => {
            console.log(user)
            if (user[0].name){
                res.json("User Exists");
                /////////////// SEND EMAIL HERE////////////////////
                const token = 'abc123';
                // "http://localhost:3000/facetoface/reset-password/email=${email}/token=${token}"
                // `https://https://fly0w.github.io/facetoface/reset-password/email=${email}/token=${token}`
                const resetPasswordLink = `https://https://fly0w.github.io/facetoface/reset-password/email=${email}/token=${token}`;

                // email Body
                let mailOptions = {
                  from: 'flucariodu62@hotmail.fr',
                  to: email,
                  subject: 'Forgot your password ?',
                  text: 'Click below to reset your password:',
                  html: `<a href="${resetPasswordLink}">Reset password</a>`
                };
                // send e-mail
                transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('E-mail sent: ' + info.response);
                  }
                });
            } else {
                res.status(400).json("This Email does not exist")
            }
        })
        .catch(err => res.status(400).json("This Email does not exist"))
};

// Function that takes the new password in the request body, checks if it has the right format, 
// if yes, turns the password into a hash, and replace the old password with the new one on the
// database. Returns a response telling if the password change worked
export const resetPassword = (req, res, bcrypt, db) => {
    const { password }= req.body;
    const { email, token }= req.params;

    const specialCharRegex = /[ !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
    const numberRegex = /(?=.*?[0-9])/;
    const caseRegex = /^(?=.*[a-z])(?=.*[A-Z])/;

    
    const hasSpecialChar = specialCharRegex.test(password);
    const hasNumber = numberRegex.test(password);
    const hasCase = caseRegex.test(password);
    const isLongEnough = (password.length >= 6 && password.length <= 64);

    if (!password) {
        return res.status(400).json("Please fill in the form")
    } else if (!hasSpecialChar || !hasNumber || !hasCase || !isLongEnough){
        return res.status(400).json("Password invalid")
    }
    const new_hash = bcrypt.hashSync(password, 10);
    
    db('login')
    .where({email})
    .select('hash')
    .then(hash => {
      if (!hash) {
        return res.status(404).send('User not found');
      }
      db('login')
        .where({email})
        .update({hash : new_hash})
        .returning('hash')
        .then((resp) => {
          res.json("Password changed Successfully");
        })
        .catch(error => {
          console.error(error);
          res.status(400).send('error 1 while changing password');
        });
    })
    .catch(error => {
      console.error(error);
      res.status(400).send('error 2 while changing password');
    });
};