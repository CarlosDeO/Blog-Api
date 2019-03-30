const express = require('express');
// const morgan = require('morgan');

const blogRouter = require('./routes');
const app = express();

// app.use(morgan("common"));
app.use(express.json());

app.use('/blog', blogRouter);

app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
  });
  