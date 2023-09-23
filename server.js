const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectDB } = require('./db');
const User = require('./user');
const Post = require('./post');

const app = express();
const CLIENT_ID = 'Y2d22e7510d59e0c602de ';
const REDIRECT_URI = 'https://blogappfrontend-iawn.onrender.com/'; 
const SCOPES = 'user:email'; 


app.get('/github-auth', (req, res) => {
  
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}`;


  res.redirect(githubAuthUrl);
});
const PORT = process.env.PORT|| 2000;

app.use(cors());
app.use(bodyParser.json());
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  '47060963969-tkec9em931dv0gohp4ti485fa8coatpj.apps.googleusercontent.com ',
  'Y"47060963969-tkec9em931dv0gohp4ti485fa8coatpj.apps.googleusercontent.com","project_id":"blog-399906","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs"',
  'https://blogappfrontend-iawn.onrender.com/' // This should match one of the authorized redirect URIs in your Google Cloud Console project
);

// Generate the authorization URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline', // for refresh token
  scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile', // the desired Google API scopes
});

console.log('Authorization URL:', authUrl);

connectDB();

app.post('/users/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password, role: 'USER' });
    await user.save();
    res.status(201).json(user); // Use 201 status code for resource creation
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Could not create user' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    console.log(user);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const { title, description, author } = req.body;
    const newPost = new Post({ title, description, author });
    await newPost.save();
    const user = await User.findById(author);
    if (user) {
      user.posts.push(newPost._id); // Use post's ID, not username
      await user.save();
    }
    res.status(201).json({ message: 'Post saved successfully', post: newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const userId = req.query.userId;
    const posts = await Post.find({ author: userId });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
