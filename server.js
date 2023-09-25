// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const { connectDB } = require('./db');
// const User = require('./user');
// const Post = require('./post');

// const app = express();
// const PORT = process.env.PORT|| 2000;

// app.use(cors());
// app.use(bodyParser.json());

// connectDB();

// app.post('/users/register', async (req, res) => {
//   try {
//     const { username, email, password } = req.body;
//     const user = new User({ username, email, password, role: 'USER' });
//     await user.save();
//     res.status(201).json(user); // Use 201 status code for resource creation
//   } catch (error) {
//     console.error('Error registering user:', error);
//     res.status(500).json({ error: 'Could not create user' });
//   }
// });

// app.post('/api/login', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const user = await User.findOne({ username, password });
//     console.log(user);
//     if (user) {
//       res.status(200).json(user);
//     } else {
//       res.status(401).json({ error: 'Invalid username or password' });
//     }
//   } catch (error) {
//     console.error('Error logging in:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// app.post('/api/posts', async (req, res) => {
//   try {
//     const { title, description, author } = req.body;
//     const newPost = new Post({ title, description, author });
//     await newPost.save();
//     const user = await User.findById(author);
//     if (user) {
//       user.posts.push(newPost._id); // Use post's ID, not username
//       await user.save();
//     }
//     res.status(201).json({ message: 'Post saved successfully', post: newPost });
//   } catch (error) {
//     console.error('Error creating post:', error);
//     res.status(500).json({ error: 'Failed to create post' });
//   }
// });

// app.get('/api/posts', async (req, res) => {
//   try {
//     const userId = req.query.userId;
//     const posts = await Post.find({ author: userId });
//     res.status(200).json(posts);
//   } catch (error) {
//     console.error('Error fetching user posts:', error);
//     res.status(500).json({ error: 'Failed to fetch user posts' });
//   }
// });

// app.post('/api/posts/:postId/like', async (req, res) => {
//   const postId = req.params.postId;
//   try {
//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).json({ message: 'Blog post not found' });
//     }
//     post.likes += 1;
//     await post.save();
//     res.status(200).json({ message: 'Like updated successfully', likes: post.likes });
//   } catch (error) {
//     console.error('Error updating like:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { connectDB } = require('./db');
const User = require('./user');
const Post = require('./post');

const app = express();
const PORT = process.env.PORT || 2000;

app.use(cors());
app.use(bodyParser.json());

connectDB();

// Initialize Passport.js
app.use(passport.initialize());

// Configure Google OAuth2 Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: '47060963969-tkec9em931dv0gohp4ti485fa8coatpj.apps.googleusercontent.com', // Replace with your Google OAuth2 client ID
      clientSecret: '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', // Replace with your Google OAuth2 client secret
      callbackURL: 'https://blogappfrontend-iawn.onrender.com/auth/google/callback/', // Replace with your callback URL
    },
    async (accessToken, refreshToken, profile, done) => {
      // Check if the user exists in your database by profile.id
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }

      // Create a new user if the user doesn't exist in your database
      const user = new User({
        googleId: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value,
        role: 'USER',
      });

      await user.save();
      done(null, user);
    }
  )
);

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
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }), // Redirect on failure
  (req, res) => {
    // Redirect to a success page or handle the user login as needed
    res.redirect('/success');
  }
);

// Your other routes can go here

// Example route for protected content that requires authentication
app.get('/protected', (req, res) => {
  if (req.isAuthenticated()) {
    // User is authenticated
    res.json({ message: 'This is protected content!' });
  } else {
    // User is not authenticated
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// ...

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
