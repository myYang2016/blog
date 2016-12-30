/**
 * Created by admin on 2016/12/29.
 */
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var controlNav = require('./nav/controlNav');

app.set('port',(process.env.port || 8000));
app.use('/',express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//控制nav的相关接口
app.use('/',controlNav);

app.listen(app.get('port'),function(){
    console.log('Server started:http://localhost:'+app.get('port')+'/');
});
