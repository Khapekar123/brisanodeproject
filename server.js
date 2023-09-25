
// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const { connectDB } = require('./db');
// const User = require('./user');
// const Post = require('./post');
// const session=require('express-session');
// const app = express();
// // const passport=require('passport')
// const PORT = process.env.PORT || 2000;
// const crypto =require('crypto');
// app.use(cors());
// app.use(bodyParser.json());
// var userProfile;
// connectDB();

// // Initialize Passport.js
// const sessionSecret = crypto.randomBytes(32).toString('hex');
// app.use(session({
//   secret: sessionSecret, 
//   resave: false,
//   saveUninitialized: true,
// }));
// app.use(passport.initialize());
// app.use(passport.session());


// // passport.use(
// //   new GoogleStrategy(
// //     {
// //       clientID: '47060963969-tkec9em931dv0gohp4ti485fa8coatpj.apps.googleusercontent.com', // Replace with your Google OAuth2 client ID
// //       clientSecret: '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', // Replace with your Google OAuth2 client secret
// //       callbackURL: 'https://blog-zozd.onrender.com/auth/google/callback', // Replace with your callback URL
// //     },
// // //      async (accessToken, refreshToken, profile, done) => {
// // //       // Check if the user exists in your database by profile.id
// // //        const existingUser = await User.findOne({ googleId: profile.id });

// // //        if (existingUser) {
// // //         return done(null, existingUser);
// // //      }

// //       // Create a new user if the user doesn't exist in your database
// //     //   const user = new User({
// //     //     googleId: profile.id,
// //     //     username: profile.displayName,
// //     //     email: profile.emails[0].value,
// //     //     role: 'USER',
// //     //   });

// //     //   await user.save();
// //     //   done(null, user);
// //     // //}
// // //   )
// // // );
// // function(accessToken,refreshToken,profile,done){
// //   userProfile=profile;
// //   console.log("user profile:"+userProfile);
// //   return done(null.userProfile);
// // }
// //   ));
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: '47060963969-tkec9em931dv0gohp4ti485fa8coatpj.apps.googleusercontent.com', // Replace with your Google OAuth2 client ID
//       clientSecret: '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', // Replace with your Google OAuth2 client secret
//       callbackURL: 'https://blog-zozd.onrender.com/auth/google/callback', // Replace with your callback URL
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         // Check if the user exists in your database by profile.id
//         const existingUser = await User.findOne({ googleId: profile.id });

//         if (existingUser) {
//           return done(null, existingUser);
//         }

//         // Create a new user if the user doesn't exist in your database
//         const user = new User({
//           googleId: profile.id,
//           username: profile.displayName,
//           email: profile.emails[0].value,
//           role: 'USER',
//         });

//         await user.save();
//         done(null, user);
//       } catch (error) {
//         return done(error, false);
//       }
//     }
//   )
// );

// // Serialize and deserialize user for session management (optional)
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   User.findById(id, (err, user) => {
//     done(err, user);
//   });
// });

// // Define your routes (after Passport.js setup)
// // ...

// // Example route for authenticating with Google
// app.get(
//   '/auth/google',
//   passport.authenticate('google', {
//     scope: ['profile', 'email'], // Specify the Google API scopes you need
//   })
// );

// // Callback route after Google authentication
// app.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/' }), // Redirect on failure
//   (req, res) => {
//     // Redirect to a success page or handle the user login as needed
//     res.send(userProfile);
//   }
// );

// // Your other routes can go here

// // Example route for protected content that requires authentication
// // app.get('/protected', (req, res) => {
// //   if (req.isAuthenticated()) {
// //     // User is authenticated
// //     res.json({ message: 'This is protected content!' });
// //   } else {
// //     // User is not authenticated
// //     res.status(401).json({ message: 'Unauthorized' });
// //   }
// // });

// // ...

// app.post('/api/login', async (req, res) => {
//   const { username, password } = req.body;
//   console.log(username, password);
//   const user = await User.findOne({ username, password });

//   if (user) {
//     // Set a session variable to indicate that the user is authenticated
//     req.session.isAuthenticated = true;
//     res.status(200).json({ message: 'Login successful' });
//   } else {
//     res.status(401).json({ error: 'Invalid username or password' });
//   }
// });


// app.post('/api/posts', async (req, res) => {
//   try {
   
//     const { title, description, author } = req.body;
//     console.log(author);
   
    
//     const newPost = new Post({ title, description, author }); 
    
//    ;
//     await newPost.save();
//     const user = await User.findById(author);
//     if (user) {
//       user.posts.push(newPost.username);
//       await user.save();
//     }
   

//     res.status(201).json({ message: 'Post saved successfully' });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Failed to save post' });
//   }
// });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
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
    callbackURL: "https://blog-zozd.onrender.com"
  },
  function(accessToken, refreshToken, profile, done) {
    userProfile=profile;
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