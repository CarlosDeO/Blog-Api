const uuid = require('uuid');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// this is our schema to represent a author
const authorSchema = mongoose.Schema({
  firstName: 'string',
  lastName: 'string',
  userName: {
    type: 'string',
    unique: true
  }
});

// this is our schema to represent a comment

const commentSchema = mongoose.Schema({content: 'string'});

// this is our schema to represent a blogPost
const blogPostSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'author' },
  comments: [commentSchema],
  publishDate: {type: Date, default: Date.now}
});

blogPostSchema.pre('find', function(next) {
  this.populate('author');
  next();
});

blogPostSchema.pre('findOne', function(next) {
  this.populate('author');
  next();
});

// *virtuals* (http://mongoosejs.com/docs/guide.html#virtuals)
// allow us to define properties on our object that manipulate
// properties that are stored in the database. Here we use it
// to generate a human readable string based on the author object
// we're storing in Mongo.


blogPostSchema.virtual("authorName").get(function(){
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data

blogPostSchema.methods.serialize = function() {
  return {
    _id: this._id,
    title: this.title,
    content: this.content,
    author: this.authorName,
    comments: this.content,
  };
};

const Author = mongoose.model('author', authorSchema);
const blogPost = mongoose.model("blogposts", blogPostSchema);

module.exports = { Author, blogPost };

