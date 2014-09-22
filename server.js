var _ = require('lodash'),
    express = require('express'),
    app     = express(),
    favicon = require('serve-favicon'),
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

app.use(favicon('./assets/imgs/favicon.ico'));
app.use(bodyParser.urlencoded());

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", (req.headers.oirgin || "*"));
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", "accept, content-type");
  next();
});

app.route('/:table')
     .get(function(req,res,next){
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
      })
     .post(function(req,res,next){
        var newCollection = [],
	    insertCollection = JSON.parse(req.body.collection),
	    insertColLength = Object.keys(insertCollection).length,
	    newModel = bookshelf.Model.extend({tableName: req.params.table});
	_.each(insertCollection, function(model){
	  delete model['id'];
          knex(req.params.table).insert(model)
	    .then(function(data) {
              newModel.forge({id:data[0]}).fetch().then(function(m) {
	        newCollection.push(m);
	        if(newCollection.length == insertColLength) {
                  res.send(newCollection);
	        }
              });
	    });
	});
     })
     .put(function(req,res,next){
        var newCollection = [],
	    insertCollection = JSON.parse(req.body.collection),
	    insertColLength = Object.keys(insertCollection).length,
	    newModel = bookshelf.Model.extend({tableName: req.params.table});
	_.each(insertCollection, function(model){
	  if(model.hasOwnProperty('id')) {
            knex(req.params.table).where('id','=',model.id).update(model)
  	      .then(function(data) {
	        console.log(data);
                newModel.forge({id:data[0]}).fetch().then(function(m) {
	          newCollection.push(m);
	          if(newCollection.length == insertColLength) {
                    res.send(newCollection);
	          }
                });
	      });
	  }
	});
    });

app.route('/:table/:id')
    .get(function(req,res,next){
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
    })
    .delete(function(req,res,next) {
      bookshelf.Model.extend({
        tableName: req.params.table
      })
      .forge({id:req.params.id}).destroy();
      res.send({result:'success'});
    });
    
app.listen(4242);
console.log('Baseball REST server listening on port 4242; double lucky!');
