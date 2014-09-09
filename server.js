var express = require('express'),
    app     = express(),
    mysql   = require('mysql'),
    resources   = require('./lib/resources'),
    connectionpool = mysql.createPool({
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'baseball'
    });
app.get('/:table', function(req,res){
  resources.query('SELECT * FROM '+req.params.table+' ORDER BY id DESC',connectionpool, req, res);
});
app.get('/:table/:id', function(req,res){});
app.post('/:table', function(req,res){});
app.put('/:table/:id', function(req,res){});
app.delete('/:table/:id', function(req,res){});

app.listen(4242);
console.log('Baseball REST server listening on port 4242; double lucky!');
