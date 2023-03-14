const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})
const mongoUrl = 'mongodb://localhost:27017'
const Blog = mongoose.model('Blog', blogSchema)


module.exports = Blog
