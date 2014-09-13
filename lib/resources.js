exports.sendErr = function() {
  res.statusCode = 500;
  res.send({
     result: 'error'
  });
};
