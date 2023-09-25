
const express = require('express');
const {connectDB} =require('./db');
const User = require('./user');
const Post = require('./post');
const Comment = require('./comment');
// const bcrypt = require('bcrypt');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');





  const mongoose = require('mongoose');

 const bodyparser=require('body-parser');

const app = express();

const PORT = process.env.PORT || 8000;
 const cors = require('cors');
 app.use(cors());
 app.use(bodyparser.json())
 
connectDB()
const crypto = require('crypto');
var userProfile;

const sessionSecret = crypto.randomBytes(32).toString('hex');
app.use(session({
  secret: sessionSecret, 
  resave: false,
  saveUninitialized: true,
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: '47060963969-tkec9em931dv0gohp4ti485fa8coatpj.apps.googleusercontent.com',
    clientSecret: "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",
    callbackURL:"https://blog-zozd.onrender.com/auth/google/callback"
},
function(accessToken, refreshToken, profile, done) {
   return done(null, userProfile);
}

));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});
app.post('/users/register',async (req,res)=>{
  try{
    const {username,email,password}=req.body;
    // const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username,email, password,role : "USER" });
    await user.save();
    res.json(user)
  }catch{
    res.status(500).json({ error: 'Could not fetch user' });
  }
});
app.post('/api/login',async (req,res)=>{
  const{username,password}=req.body;
  console.log(username,password);
  const user = await User.findOne({username,password});
  // console.log(user);
  if(user){
    res.status(200).json(user);
  }else{
    res.status(401).json({error:'Invalid username or password'});
  }
});
app.post('/api/posts', async (req, res) => {
  try {
   
    const { title, description, author } = req.body;
    console.log(author);
   
    
    const newPost = new Post({ title, description, author }); 
    
   ;
    await newPost.save();
    const user = await User.findById(author);
    if (user) {
      user.posts.push(newPost.username);
      await user.save();
    }
   

    res.status(201).json({ message: 'Post saved successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to save post' });
  }
});
app.get('/api/posts', async (req, res) => {
  try {
    
   
    const userId = req.query.userId;
    console.log(userId);

    const posts = await Post.find({ author: userId });
    console.log(posts);


    res.status(200).json(posts);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
});
app.post('/api/posts/:postId/like', async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);


    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    post.likes += 1;
    await post.save();

    res.status(200).json({ message: 'Like updated successfully', likes: post.likes });
  } catch (error) {
    console.error('Error updating like:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/MainPage', (req, res) => {
  // You can render your homepage HTML or send a response as needed
  res.send('Welcome to the homepage!');
});

  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  // app.get(
  //   '/auth/google/callback',
  //   passport.authenticate('google', {
  //     successRedirect: '/MainPage', 
  //     failureRedirect: '/error', 
  //   })
  // );
  app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.send(userProfile);
  });



  app.listen(PORT,() => console.log(`Server running on port ${PORT}`))