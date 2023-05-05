// Function that takes the id and new_name from the request body, changes the existing
// name to the new name in the database, and returns the updated user object to our App
export const changeName = (req, res, db) => {
    const { id, new_name } = req.body;
  db('users')
    .where({id})
    .select('name')
    .then(existing_name => {
      if (!existing_name) {
        return res.status(404).send('User not found');
      }
      db('users')
        .where({id})
        .update({name : new_name})
        .returning('*')
        .then(updated_user => {
            res.json(updated_user[0]);
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('error 1 while processing name change');
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('error 2 while processing name change');
    });
};

