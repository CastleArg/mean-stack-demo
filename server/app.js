const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.post('/api/posts', (req, res, next) => {
  console.log(req.body);
  res.status(201).json();
});

app.use('/api/posts', (req, res, next) => {
  const posts = [
    {
      id : 'dshf83j',
      title : 'post 1 title',
      content : 'post 1 content from server'
    },
    {
      id : 'ds978f3e',
      title : 'post 2 title',
      content : 'post 1 content from server'
    },
    {
      id : 'khdfs893',
      title : 'post 3 title',
      content : 'post 1 content from server'
    }
  ];
  res.status(200).json(
    {
      message: 'Ypu got the posts!',
      posts: posts
    }
  );
});


module.exports = app;
