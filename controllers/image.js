// Function that takes care of sending a request to the Clarifai API with our credentials
// and returns the object to our app
const imageurlHandler = (req, res) => {
    const PAT = process.env.API_CLARIFAI;
    const USER_ID = 'flucariodu62';       
    const APP_ID = 'face2face';
    const MODEL_ID = 'face-detection';  
    const IMAGE_URL = req.body.imageurl;
    const raw = JSON.stringify({
      "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
      },
      "inputs": [
        {
          "data": {
            "image": {
            "url": IMAGE_URL
            }
          }
        }
      ]
    });    

    const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
    };

    const value = fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
        .then(response => response.json())
        .then(response => res.json(response))
        .catch(err => res.status("400").json("error while loading the url"))
}


// Function that takes the user ID in the body of the request, finds the user in the db 
// and increments by 1 his/her number or entries
const imageHandler = (req, res, db) => {
    const { id } = req.body;
    db('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(user => {
            return res.json(user[0].entries)
        })
        .catch(err => {
            res.status(400).json('error while processing entries')
        })
};


// Function that takes the id and last_url from the request body, updates the last loaded 
// url in the database, and returns a response with the new url to our App
const imageLastUrl = (req, res, db) => {
  const { id, last_url } = req.body;
  db('users')
    .where({id})
    .select('last_url')
    .then(url => {
      if (!url) {
        return res.status(404).send('Url not found'); // For new users, existing url is empty
      }
      db('users')
        .where({id})
        .update({last_url})
        .returning('last_url')
        .then((url) => {
          res.json(url[0].last_url);
        })
        .catch(error => {
          console.error(error);
          res.status(400).send('error 1 while processing url');
        });
    })
    .catch(error => {
      console.error(error);
      res.status(400).send('error  while processing url');
    });
};


export { imageHandler, imageurlHandler, imageLastUrl };