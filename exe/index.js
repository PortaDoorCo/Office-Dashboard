const path = require('path');
const express = require('express');
const open = require('open');
const app = express();
const publicPath = path.join(__dirname, 'build');


const start = async () => {
  await app.use(express.static(publicPath));

  await app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
  
  await app.listen(3000, () => {
    console.log('App is running....');
  });


  await open('http://localhost:3000');
  
};


start();