exports.query = function(query, conPool, req, res) {
  conPool.getConnection(function(err, connection) {
    if (err) {
      console.log('CONNECTION error: ', err);
      res.statusCode = 503;
        res.send({
          result: 'error',
          err: err.code
        });
     } else {
       connection
          .query(query,
                 req.params.id, function(err, rows, fields){
                   if(err) {
                     console.error('CONNECTION error: ', err);
		     res.statusCode = 500;
		     res.send({
		        result: 'error',
			error:  err.code
		     });
                   } else {
		     res.send({
		         result: 'success',
		         err:    '',
		         fields: fields,
    		         json:   rows,
  		         length: (rows && rows.length)
		     });
		   }
		   connection.release();
                 });
    }
  });
};
