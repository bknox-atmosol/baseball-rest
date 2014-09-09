var express = require('express'),
    app     = express(),
    mysql   = require('mysql'),
    connectionpool = mysql.createPool({
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'baseball'
    });
res.setHeaderHeader( 'Content-Type': 'application/json' });
app.get('/:table', function(req,res){
  connectionpool.getConnection(function(err, connection) {
    if (err) {
      console.error('CONNECTION error: ', err);
      res.statusCode = 503;
        res.send({
          result: 'error',
          err: err.code
        });
     } else {
       connection
          .query('SELECT * FROM '+req.params.table+' ORDER BY id DESC LIMIT 20',
                 req.params.id, function(err, rows, fields){
                   if(err) {
                     console.error('CONNECTION error: ', err);
		     res.statusCode = 500;
		     res.send({
		        result: 'error',
			error:  err.code
		     });
                   }
		   res.send({
		       result: 'success',
		       err:    '',
		       fields: fields,
		       json:   rows,
		       length: rows.length
		   });
		   connection.release();
                 });
    }
  });
});
app.get('/:table/:id', function(req,res){});
app.post('/:table', function(req,res){});
app.put('/:table/:id', function(req,res){});
app.delete('/:table/:id', function(req,res){});

app.listen(4242);
console.log('Baseball REST server listening on port 4242; double lucky!');
