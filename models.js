const uuid = require('uuid');

const mongoose = require('mongoose');

// this is our schema to represent a blogPost
const blogPostSchema = mongoose.Schema({
  // id: {type: uuid.v4(), required: true},
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true}
  },
  publishDate: {type: Date, default: Date.now}
});

// *virtuals* (http://mongoosejs.com/docs/guide.html#virtuals)
// allow us to define properties on our object that manipulate
// properties that are stored in the database. Here we use it
// to generate a human readable string based on the author object
// we're storing in Mongo.


blogPostSchema.virtual("nameString").get(function(){
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data

blogPostSchema.methods.serialize = function() {
  return {
    title: this.title,
    content: this.content,
    author: this.nameString,
    _id: this._id,
  };
};

const blogPost = mongoose.model("blogposts", blogPostSchema);

module.exports = { blogPost };

