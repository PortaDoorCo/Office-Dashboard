const https = require('https');
const data = '{"limit": 1000}';
const token = '72KEkfxjYCgAAAAAAAAAAf8YXuHAs6BqD7pl-2YvnuVQ28eJdgtOViW8wKcvJUND';

const razorGauge = (data) => {


  const req = https.request('https://content.dropboxapi.com/2/files/upload', {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
    },
    body: {
      'path': '/Homework/math/Matrices.txt',
      'mode': 'add',
      'autorename': true,
      'mute': false,
      'strict_conflict': false
    }

  }, (res) => {
    console.log('statusCode: ', res.statusCode);
    console.log('headers: ', res.headers);

    res.on('data', function(d) {
      process.stdout.write(d);
    });
  });

  req.end();
};


razorGauge();