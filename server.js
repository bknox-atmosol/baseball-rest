var express = require('express'),
    app     = express(),
    bodyParser = require('body-parser'),
    knex = require('knex')({
      client: 'mysql',
      connection : {
        host:     'localhost',
	user:     'root',
	password: '',
	database: 'baseball'
      }
    }),
    bookshelf = require('bookshelf')(knex);

app.get('/:table', function(req,res){
  bookshelf.Model.extend({
    tableName: req.params.table
  })
  .fetchAll().then(function(collection){
    if(collection.length == 0) {
      res.statusCode = 500;
      res.send({
         result: 'error'
      });
     } else {
      res.send({
         result: 'success',
         err:    '',
         json:   collection.toJSON(),
         length: (collection.length)
      });
    }
  });
});
app.get('/:table/:id', function(req,res){
  bookshelf.Model.extend({
    tableName: req.params.table
  })
  .forge({id:req.params.id}).fetch().then(function(model){
    if(model === null) {
      res.statusCode = 500;
      res.send({
         result: 'error'
      });
     } else {
      res.send({
         result: 'success',
         err:    '',
         json:   model.toJSON()
      });
    }
  });
});
app.post('/:table', function(req,res){
  console.log(req.body);
  /*bookshelf.Model.extend({
    tableName: req.params.table
  })
  .forge({})*/
});
app.put('/:table/:id', function(req,res){});
app.delete('/:table/:id', function(req,res){
  bookshelf.Model.extend({
    tableName: req.params.table
  })
  .forge({id:req.params.id}).destroy();
  res.send({result:'success'});
});

app.listen(4242);
console.log('Baseball REST server listening on port 4242; double lucky!');
