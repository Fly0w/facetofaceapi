import express from 'express';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import knex from 'knex';

import { signinHandler } from './controllers/signin.js';
import { registerHandler } from './controllers/register.js';
import { imageHandler, imageurlHandler, imageLastUrl } from './controllers/image.js';
import { idHandler } from './controllers/id.js';
import { changeName } from './controllers/myPage.js';


  // const db = knex({
  //   client: 'pg',
  //   connection: {
  //     connectionString: "postgres://hkbrbdmoikszbt:8bd77b6fb428ee84429bc90a9813779322900d0230c638960bb75050895631f5@ec2-34-193-110-25.compute-1.amazonaws.com:5432/davlaum7uh7apf",
  //     ssl: {
  //       rejectUnauthorized: false
  //     }
  //   }
  // });

  const db = knex({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    }
  });

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {res.send("Salut les reufs !")}) 

// profile/:id
app.get('/profile/:id', (req, res) => {idHandler(req, res, db)})

// image
app.put('/image', (req, res) => {imageHandler(req, res, db)})
app.put('/imageupdate', (req, res) => {imageLastUrl(req, res, db)})
app.post('/imageurl', (req, res) => {imageurlHandler(req, res)})

// signin
app.post('/signin', (req, res) => {signinHandler(req, res, bcrypt, db)})

// register
app.post('/register', (req,res) => {registerHandler(req, res, bcrypt, db)})

// myPage
app.put('/changeName', (req, res) => {changeName(req, res, db)})


const PORT = process.env.PORT;
app.listen(PORT, () => {console.log(`app is running on port ${PORT}`);})

// const PORT = 3001;
// app.listen(PORT, () => {console.log(`app is running on port ${PORT}`);})