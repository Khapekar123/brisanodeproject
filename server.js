
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { connectDB } = require('./db');
const User = require('./user');
const Post = require('./post');
const session=require('express-session');
const app = express();
const PORT = process.env.PORT || 2000;

app.use(cors());
app.use(bodyParser.json());
var userProfile;
connectDB();

// Initialize Passport.js
const sessionSecret = crypto.randomBytes(32).toString('hex');
app.use(session({
  secret: sessionSecret, 
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// Configure Google OAuth2 Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: '47060963969-tkec9em931dv0gohp4ti485fa8coatpj.apps.googleusercontent.com', // Replace with your Google OAuth2 client ID
      clientSecret: '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', // Replace with your Google OAuth2 client secret
      callbackURL: 'https://blog-zozd.onrender.com/auth/google/callback', // Replace with your callback URL
    },
//      async (accessToken, refreshToken, profile, done) => {
//       // Check if the user exists in your database by profile.id
//        const existingUser = await User.findOne({ googleId: profile.id });

//        if (existingUser) {
//         return done(null, existingUser);
//      }

      // Create a new user if the user doesn't exist in your database
    //   const user = new User({
    //     googleId: profile.id,
    //     username: profile.displayName,
    //     email: profile.emails[0].value,
    //     role: 'USER',
    //   });

    //   await user.save();
    //   done(null, user);
    // //}
//   )
// );
function(accessToken,refreshToken,profile,done){
  userProfile=profile;
  console.log("user profile:"+userProfile);
  return done(null.userProfile);
}
  ));
// Serialize and deserialize user for session management (optional)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Define your routes (after Passport.js setup)
// ...

// Example route for authenticating with Google
app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'], // Specify the Google API scopes you need
  })
);

// Callback route after Google authentication
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }), // Redirect on failure
  (req, res) => {
    // Redirect to a success page or handle the user login as needed
    res.send(userProfile);
  }
);

// Your other routes can go here

// Example route for protected content that requires authentication
// app.get('/protected', (req, res) => {
//   if (req.isAuthenticated()) {
//     // User is authenticated
//     res.json({ message: 'This is protected content!' });
//   } else {
//     // User is not authenticated
//     res.status(401).json({ message: 'Unauthorized' });
//   }
// });

// ...

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
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
