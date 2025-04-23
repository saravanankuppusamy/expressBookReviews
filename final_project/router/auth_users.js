const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
const userMatches = users.filter((user) => 
            user.username === username);
return userMatches.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
const matchingUsers = users.filter((user) => 
        user.username === username && user.password === password);
  return matchingUsers.length > 0;

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 60 * 60});

      // Store access token and username in session
      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send("User successfully logged in");
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const user = req.session.authorization.username;
  const review = req.body.review; // string
  const isbn = req.params.isbn;
  if (!review) {
    res.status(400).json({ message: "Review is empty!" });
  } else {
    books[isbn].reviews[user] = review;
    res.status(200).json({ message: "Book review updated." });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// delete a review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const user = req.session.authorization.username;
    const isbn = req.params.isbn;
    if (!books[isbn]) {
      res.status(400).json({ message: "invalid ISBN." });
    } else if (!books[isbn].reviews[user]) {
      res
        .status(400)
        .json({ message: `${user} hasn't submitted a review for this book.` });
    } else {
      delete books[isbn].reviews[user];
      res.status(200).json({ message: "Book review deleted." });
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
