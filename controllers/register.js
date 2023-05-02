// Function that creates a new user in the "login" database after checking if there is no empty input.
// If no empty input, creates a hash for the user's password, and add the email et hashed password in
// the "login" db. Then, also creates a new user in the "user" database with name, email, and date.
export const registerHandler = (req, res, bcrypt, db) => {
    const dateObj = new Date();
    const options = { month: '2-digit', day: '2-digit', year: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('ja-JP', options);

    const { email, password, name }= req.body;

    if (!email || !password || !name) {
        return res.status(400).json("incorrect form submission")
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


