// Function that takes the email and password inside the body of the request, checks if the user
// exists, and if yes, checks if the password matches the hash inside the user database.
// If everything is good, gives a response as an array with the user's information
export const signinHandler = (req, res, bcrypt, db) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json("incorrect form submission")
    }
    db.select('email', 'hash').from('login')
      .where('email', '=', email)    
      .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if (isValid === true){
            return db.select('*').from('users')
                .where('email', "=", email)
                .then(user => {
                    res.json(user[0])
                })
                .catch(err => res.status(400).json('unable to get user'))
        } else {
            res.status(400).json('wrong credentials')
        }
      })
      .catch(err => res.status(400).json('error loging in'))
};