const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  console.log(users);
  // Declare username and password variables
  const username = req.body.username;
  const password = req.body.password;

  // Next, check if both are provided by the user
  if (username && password) {
    // Check if the username doesn't already exist
    if (isValid(username)) {
      // Add the new user to the users array
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. You can login now!"});
    } else {
      return res.status(404).json({message: "User exists already!"});
    }
  }
  // Return an error if username or password are missing
  return res.status(404).json({message: "Unable to register user - missing info."})
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5001/");
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch(error) {
    return res.status(404).json({message: "An error occurred while fetching the book list. Try again later."});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  const booksByAuthor = Object.keys(books).filter((key) => {
    return books[key].author === author;
  }).map((key) => {
    return books[key];
});
  res.send(JSON.stringify(booksByAuthor, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

  const booksByTitle = Object.keys(books).filter((key) => {
    return books[key].title === title;
  }).map((key) => {
    return books[key];
  });
  res.send(JSON.stringify(booksByTitle, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const review = req.params.isbn;
  res.send(books[review].reviews);
});

module.exports.general = public_users;
