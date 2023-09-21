

// const express = require('express');
// const {connectDB} =require('./db');
// const User = require('./user');
// const Post = require('./post');
// const Comment = require('./comment');
// // const bcrypt = require('bcrypt');
// const mongoose = require('mongoose');
// const bodyparser=require('body-parser');
// const app = express();
// const PORT = 2000;
// const cors = require('cors');
// app.use(cors());
// app.use(bodyparser.json())
//  connectDB()
// app.post('/users/register',async (req,res)=>{
//   try{
//     const {username,email,password}=req.body;
//     // const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ username,email, password,role : "USER" });
//     await user.save();
//     res.json(user)
//   }catch{
//     res.status(500).json({ error: 'Could not fetch user' });
//   }
// });

// app.post('/api/login', async (req, res) => {
//   const { username, password } = req.body;
//   console.log('Received login request:', username, password);
//   const user = await User.findOne({username,password});
 

//   console.log('Response:', user); // Log the user object returned

//   if (user) {
//     res.status(200).json(user);
//   } else {
//     res.status(401).json({ error: 'Invalid username or password' });
//   }
// });

// app.post('/api/posts', async (req, res) => {
//   try {
   
//     const { title, description,author} = req.body;
    
//     const newPost = new Post({ title, description,author}); 
//     await newPost.save();
//     //User.posts.push(newPost.id);
//     res.status(201).json({ message: 'Post saved successfully' });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Failed to save post' });
//   }
// });

//   app.get("/api/get", async (req, res) => {
//     try {
//         const post = await Post.find(); 
//         res.json(post);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal server error" });
//     }
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
//   app.listen(PORT,() => console.log(`Server running on port ${PORT}`))


// const express = require('express');
// const {connectDB} =require('./db');
// const User = require('./user');
// const Post = require('./post');
// const Comment = require('./comment');
// // const bcrypt = require('bcrypt');



//   const mongoose = require('mongoose');

//  const bodyparser=require('body-parser');

// const app = express();

// const PORT = 2000;
//  const cors = require('cors');
//  app.use(cors());
//  app.use(bodyparser.json())
 
// connectDB()



// app.post('/users/register',async (req,res)=>{
//   try{
//     const {username,email,password}=req.body;
//     // const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ username,email, password,role : "USER" });
//     await user.save();
//     res.json(user)
//   }catch{
//     res.status(500).json({ error: 'Could not fetch user' });
//   }
// });
// app.post('/api/login',async (req,res)=>{
//   const{username,password}=req.body;
//   console.log(username,password);
//   const user = await User.findOne({username,password});
//   // console.log(user);
//   if(user){
//     res.status(200).json(user);
//   }else{
//     res.status(401).json({error:'Invalid username or password'});
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
// app.get('/api/posts', async (req, res) => {
//   try {
    
   
//     const userId = req.query.userId;
//     console.log(userId);

//     const posts = await Post.find({ author: userId });
//     console.log(posts);

//     res.status(200).json(posts);
//   } catch (error) {
//     console.error('Error:', error);
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






//   app.listen(PORT,() => console.log(`Server running on port ${PORT}`))



const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectDB } = require('./db');
const User = require('./user');
const Post = require('./post');

const app = express();
const PORT = process.env.PORT|| 2000;

app.use(cors());
app.use(bodyParser.json());

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
