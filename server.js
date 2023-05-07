import express from 'express';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import knex from 'knex';

import { signinHandler } from './controllers/signin.js';
import { registerHandler } from './controllers/register.js';
import { imageHandler, imageurlHandler, imageLastUrl } from './controllers/image.js';
import { idHandler } from './controllers/id.js';
import { changeName } from './controllers/myPage.js';
import { checkExistingEmail, resetPassword } from './controllers/forgotPassword.js';

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

// signin
app.post('/signin', (req, res) => {signinHandler(req, res, bcrypt, db)})

// register
app.post('/register', (req,res) => {registerHandler(req, res, bcrypt, db)})

// forgot password
app.post('/forgotPassword', (req,res) => {checkExistingEmail(req, res, db)})
app.put('/resetPassword/:email/:token', (req,res) => {resetPassword(req, res, bcrypt, db)})

// Home Page
app.put('/image', (req, res) => {imageHandler(req, res, db)})
app.put('/imageupdate', (req, res) => {imageLastUrl(req, res, db)})
app.post('/imageurl', (req, res) => {imageurlHandler(req, res)})

// myPage
app.put('/changeName', (req, res) => {changeName(req, res, db)})
//id
app.get('/profile/:id', (req, res) => {idHandler(req, res, db)})

const PORT = process.env.PORT;
app.listen(PORT, () => {console.log(`app is running on port ${PORT}`);})

// const PORT = 3001;
// app.listen(PORT, () => {console.log(`app is running on port ${PORT}`);})