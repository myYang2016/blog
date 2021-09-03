﻿const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const http = require('http');
const https = require('https');
const fs = require('fs');

const pageRouter = require('./pageRouter');
const backendApi = require('./interface/backend');
const testApi = require('./interface/testApi');

//连接数据库
const dbPort = process.env.NODE_ENV === 'development' ? 27017 : 21018;
mongoose.connect(
  `mongodb://localhost:${dbPort}/blog`,
  { useNewUrlParser: true }
);
mongoose.connection.on('error', console.log.bind(console, 'connection error:'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('*', (req, res, next) => {
  // 进入管理后台时，检查cookie，判断是否已登陆
  const baseUrl = req.baseUrl;
  if (
    (
      baseUrl === '/backend' || 
      baseUrl.indexOf('/backend/api') > -1
    ) &&
    (
      !req.cookies ||
      !req.cookies.userid ||
      req.cookies.userid !== backendApi.userid
    )
  ) {
    res.redirect('/backend/login.html');
  }
  else next();
});

app.use(pageRouter);
app.use(backendApi);
app.use(testApi);
// 静态资源
app.use('/', express.static(path.join(__dirname + '/static')));
// 管理后台
app.use('/backend/', express.static(path.join(__dirname + '/backend/dist')));
// demo
app.use('/demo', express.static(path.join(__dirname + '/demo')));
// 引用npm包
app.use('/script', express.static(path.resolve(__dirname, 'node_modules')));

const options = {
  key: fs.readFileSync(path.resolve(__dirname, './certificates/2_www.yxgweb.com.key')),
  cert: fs.readFileSync(path.resolve(__dirname, './certificates/1_www.yxgweb.com_bundle.crt'))
};
const server = http.createServer(app);
const serverHttps = https.createServer(options);
const io = require('socket.io')(server, {
  path: '/test',
});
io.listen(serverHttps, {
  path: '/test',
});

io.on('connect', socket => {
  console.log(`socket conenct ${socket.id}`);

  socket.on('message', (msg) => {
    console.log(msg)
    socket.broadcast.emit('message', msg);
  });
});

const port = process.env.PORT || 8100;
server.listen(port, err => {
  if (err) throw err;
  console.log('server connect in http://localhost:' + port);
});

serverHttps.listen(parseInt(port)+1);
