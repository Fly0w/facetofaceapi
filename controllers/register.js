// Function that creates a new user in the "login" database after checking if there is no 
// empty input and if the password and email are in a good format. If no problem, creates
// a hash for the user's password, and add the email and hashed password in the "login"  
// db. Then, also creates a new user in the "user" database with name, email, and date.
export const registerHandler = (req, res, bcrypt, db) => {
    const dateObj = new Date();
    const formattedDate = dateObj.toLocaleDateString();

    const { email, password, name }= req.body;

    const specialCharRegex = /[ !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
    const numberRegex = /(?=.*?[0-9])/;
    const caseRegex = /^(?=.*[a-z])(?=.*[A-Z])/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    
    const hasSpecialChar = specialCharRegex.test(password);
    const hasNumber = numberRegex.test(password);
    const hasCase = caseRegex.test(password);
    const isLongEnough = (password.length >= 6 && password.length <= 64);
    const emailValid = emailRegex.test(email);

    if (!email || !password || !name) {
        return res.status(400).json("Please fill in the form")
    } else if (!hasSpecialChar || !hasNumber || !hasCase || !isLongEnough || !emailValid){
        return res.status(400).json("Email or password invalid")
    }
    const hash = bcrypt.hashSync(password, 10);
    db.transaction(trx => {
        trx
            .insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0].email,
                        name: name,
                        joined: formattedDate
                    })
                    .then(user => {
                        res.json(user[0])
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
    .catch(err => res.status(400).json("unable to register"))
};


