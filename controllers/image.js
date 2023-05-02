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


// Function that takes the user ID in the body of the request, fins the user in the db and
// increments by 1 his/her number or entries
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

export { imageHandler, imageurlHandler };