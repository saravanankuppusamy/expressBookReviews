const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

//  Task10
// Get book lists
const getBooks = () => {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
};

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    //Write your code here
   // res.send(books);
   const allBooks = await getBooks();
   return res.status(200).send(JSON.stringify(allBooks, null, 4));
    //return res.status(300).json({message: "Yet to be implemented"});
  });

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Missing username or password" });
  } else if (doesExist(username)) {
    return res.status(404).json({ message: "user already exists." });
  } else {
    users.push({ username: username, password: password });
    return res
      .status(200)
      .json({ message: "User successfully registered.  Please login." });
  }

 // return res.status(300).json({message: "Yet to be implemented"});
});


//  Task 11
// Get book details based on ISBN
const getByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        let isbnNum = parseInt(isbn);
        if (books[isbnNum]) {
            resolve(books[isbnNum]);
        } else {
            reject({ status: 404, message: `ISBN ${isbn} not found` });
        }
    });
};

//  Task 11
//  Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    await getByISBN(req.params.isbn)
    .then(
        result => res.send(result),
        error => res.status(error.status).json({message: error.message})
    );
 });

// Get book details based on ISBN
/*public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const targetISBN = req.params.isbn;
  const targetBook = books[targetISBN];
  if (!targetBook) {
    return res.status(404).json({ message: "ISBN not found." });
  } else {
    return res.status(200).json(targetBook);
  }
  //return res.status(300).json({message: "Yet to be implemented"});
 });
 */
  
 //  Task 3 & Task 12
//  Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    await getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.author === author))
    .then((filteredBooks) => res.send(filteredBooks));
});

// Get book details based on author
/*public_users.get('/author/:author',function (req, res) {
  //Write your code here
  // get array of matching book objects
  const matchingBooks = Object.values(books).filter(
    (book) => book.author.toLowerCase() === req.params.author.toLowerCase()
  );
  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } else {
    return res.status(404).json({ message: "No books by that author." });
  }
 // return res.status(300).json({message: "Yet to be implemented"});
});
*/



// Get all books based on title
//  Task 4 & Task 13
//  Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    await getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.title === title))
    .then((filteredBooks) => res.send(filteredBooks));
});

/*public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const matchingTitle = Object.values(books).filter(
    (book) => book.title.toLowerCase() === req.params.title.toLowerCase()
  )[0];
  if (matchingTitle) {
    return res.status(200).json(matchingTitle);
  } else {
    return res.status(404).json({ message: "Title not found." });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});
*/
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const targetISBN = req.params.isbn;
  const targetBook = books[targetISBN];
  if (targetBook) {
    return res.status(200).send(JSON.stringify(targetBook.reviews, null, 4));
  } else {
    return res.status(404).json({ message: "ISBN not found." });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
