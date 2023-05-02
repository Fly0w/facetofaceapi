// Returns an array with all the information about one user according to the id provided in the
// request.
export const idHandler = (req, res, db) => {
    const { id } = req.params;
    db.select('*').from('users')
        .where({id : id})
        .then(user => {
            if (user.length != 0){
                res.json(user[0]);
            } else {
                res.status(400).json('Oops, Not found');
            }
        })
        .catch(err => res.status(400).json("error getting user"))
};