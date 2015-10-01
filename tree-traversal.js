var async = require('async');

function extend() {
  for (var i=1; i<arguments.length; i++)
    for (var key in arguments[i])
      if (arguments[i].hasOwnProperty(key))
        arguments[0][key] = arguments[i][key];
  return arguments[0];
}

function traverseBreadthFirst(rootNode, options) {
  options = extend({
    subnodesAccessor: function(node) { return node.subnodes; },
    userdataAccessor: function(node, userdata) { return userdata; },
    onNode: function(node, callback, userdata) { callback(); },
    onComplete: function() {},
    userdata: null
  }, options);

  var queue = [];
  queue.push([rootNode, options.userdata]);

  function next() {
    if (queue.length == 0) {
      options.onComplete(rootNode);
      return;
    }

    var front = queue.shift();
    var node = front[0];
    var data = front[1];

    options.onNode(node, function() {
      var subnodeData = options.userdataAccessor(node, data);
      var subnodes = options.subnodesAccessor(node);
      async.eachSeries(subnodes,
        function(subnode, nextNode) {
          queue.push([subnode, subnodeData]);
          async.setImmediate(nextNode);
        },
        function() {
          async.setImmediate(next);
        }
      );
    },
    data);
  }

  next();
}

function traverseBreadthFirstSync(rootNode, options) {
  options = extend({
    subnodesAccessor: function(node) { return node.subnodes; },
    userdataAccessor: function(node, userdata) { return userdata; },
    onNode: function(node, userdata) {},
    userdata: null
  }, options);

  var queue = [];
  queue.push([rootNode, options.userdata]);

  while (queue.length>0) {
    var front = queue.shift();
    var node = front[0];
    var data = front[1];

    options.onNode(node, data);

    var subnodeData = options.userdataAccessor(node, data);
    var subnodes = options.subnodesAccessor(node);
    for (var i=0; i<subnodes.length; i++) {
      queue.push([subnodes[i], subnodeData]);
    }
  }
  return rootNode;
}


module.exports = {
  breadth: traverseBreadthFirst,
  breadthSync: traverseBreadthFirstSync
};
