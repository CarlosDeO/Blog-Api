const express = require('express');
const router = express.Router();
// const bodyParser = require('body-parser');

// const jsonParser = bodyParser.json();

const { blogPost } = require('./models');

router.get('/', (req, res) => {
  blogPost.find()
  //  .limit(10)
  // success callback: for each blogPost we got back, we'll
  // call the `.serialize` instance method we've created in
  // models.js in order to only expose the data we want the API return.    
  .then(blogPosts => {
    res.json({
      blogPosts: blogPosts.map(blogPost => blogPost.serialize())
    });
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  });
});

router.get('/:id', (req, res) => {
  blogPost
    // this is a convenience method Mongoose provides for searching
    // by the object _id property
    .findById(req.params.id)
    .then(blogPost => {
      if(blogPost) {
        res.json(blogPost.serialize())
      }
      else {
        return res.status(404).send();
      }
    })
    
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

router.post('/', (req, res) => {
  const requiredField = ['title', 'content', 'author'];
  for (let i = 0; i < requiredField.length; i++) {
    const field = requiredField[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  blogPost.create({
    author: req.body.author,
    title: req.body.title,
    content: req.body.content
  })
    .then(blogPost => res.status(201).json(blogPost.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

router.put('/:id', (req, res) => {
  // ensure that the id in the request path and the one in request body match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message =
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`;
    console.error(message);
    return res.status(400).json({ message: message });
  }

  // we only support a subset of fields being updateable.
  // if the user sent over any of the updatableFields, we udpate those values
  // in document
  const toUpdate = {};
  const updateableFields = ['title', 'content', 'author'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  blogPost
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    .findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(blogPost => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});

router.delete('/:id', (req, res) => {
  blogPost.findByIdAndRemove(req.params.id)
    .then(blogPost => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});

module.exports = router