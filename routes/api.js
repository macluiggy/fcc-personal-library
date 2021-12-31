/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
let mongodb = require("mongodb");
let mongoose = require("mongoose");
require("dotenv").config();
const URI = process.env.DB;
module.exports = function (app) {
  mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
  let bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    comments: [String],
  });
  let Book = mongoose.model("Book", bookSchema);

  app
    .route("/api/books")
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}, function (err, books) {
        if (err || !books) return res.send(err);
        let arrayOfBooks = [];
        books.forEach((book) => {
          book = book.toJSON();
          book["commentcount"] = book.comments.length;
          arrayOfBooks.push(book);
        });
        return res.json(arrayOfBooks);
      });
    })

    .post(function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) return res.send("missing required field title");
      let newBook = new Book({ title: title, comments: [] });
      newBook.save(function (err, savedBook) {
        if (err || !savedBook) return res.send(err);
        res.json(savedBook);
      });
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid, function (err, book) {
        if (!book) return res.send("no book exists");
        if (err) return res.send(err);
        book = book.toJSON();
        book["commentcount"] = book.comments.length;
        return res.json(book);
      });
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
};
