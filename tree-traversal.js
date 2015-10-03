var async = require('async');

/**
 * Helper function for extending options objects.
 */
function extend() {
  for (var i=1; i<arguments.length; i++)
    for (var key in arguments[i])
      if (arguments[i].hasOwnProperty(key))
        arguments[0][key] = arguments[i][key];
  return arguments[0];
}

/**
 * Asynchronously traverses the tree breadth first.
 */
function traverseBreadthFirst(rootNode, options) {
  options = extend({
    subnodesAccessor: function(node) { return node.subnodes; },
    userdataAccessor: function(node, userdata) { return userdata; },
    onNode: function(node, callback, userdata) { callback(); },
    onComplete: function(rootNode) {},
    userdata: null
  }, options);

  var queue = [];
  queue.push([rootNode, options.userdata]);

  (function next() {
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
  })();
}

/**
 * Synchronously traverses the tree breadth first.
 */
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


/**
 * Asynchronously traverses the tree depth first.
 */
function traverseDepthFirst(rootNode, options) {
  options = extend({
    subnodesAccessor: function(node) { return node.subnodes; },
    userdataAccessor: function(node, userdata) { return userdata; },
    onNode: function(node, callback, userdata) { callback(); },
    onComplete: function(rootNode) {},
    userdata: null
  }, options);

  var stack = [];
  stack.push([rootNode, options.userdata]);

  (function next() {
    if (stack.length == 0) {
      options.onComplete(rootNode);
      return;
    }

    var top = stack.pop();
    var node = top[0];
    var data = top[1];

    options.onNode(node, function() {
      var subnodeData = options.userdataAccessor(node, data);
      var subnodes = options.subnodesAccessor(node);
      async.eachSeries(subnodes,
        function(subnode, nextNode) {
          stack.push([subnode, subnodeData]);
          async.setImmediate(nextNode);
        },
        function() {
          async.setImmediate(next);
        }
      );
    }, data);
  })();
}

/**
 * Synchronously traverses the tree depth first.
 */
function traverseDepthFirstSync(rootNode, options) {
  options = extend({
    subnodesAccessor: function(node) { return node.subnodes; },
    userdataAccessor: function(node, userdata) { return userdata; },
    onNode: function(node, userdata) {},
    userdata: null
  }, options);

  var stack = [];
  stack.push([rootNode, options.userdata]);
  while (stack.length>0) {
    var top = stack.pop();
    var node = top[0];
    var data = top[1];

    options.onNode(node, data);

    var subnodeData = options.userdataAccessor(node, data);
    var subnodes = options.subnodesAccessor(node);
    for (var i=0; i<subnodes.length; i++)
      stack.push([subnodes[i], subnodeData]);
  }
  return rootNode;
}


/**
 * Asynchronously traverses the tree recursively.
 */
function traverseRecursive(rootNode, options) {
  options = extend({
    subnodesAccessor: function(node) { return node.subnodes; },
    onNode: function(node, callback, userdata) {},
    onComplete: function(rootNode) {},
    userdata: null
  }, options);

  (function visitNode(node, callback) {
    var subnodes = options.subnodesAccessor(node);
    async.eachSeries(subnodes, function(subnode, next) {
      visitNode(subnode, function() {
        async.setImmediate(next);
      });
    },
    function() {
      options.onNode(node, function() {
        async.setImmediate(callback);
      }, options.userdata);
    });
  })(rootNode, function() {
    options.onComplete(rootNode);
  });
}

/**
 * Synchronously traverses the tree recursively.
 */
function traverseRecursiveSync(rootNode, options) {
  options = extend({
    subnodesAccessor: function(node) { return node.subnodes; },
    onNode: function(node, userdata) {},
    userdata: null
  }, options);

  (function visitNode(node) {
    var subnodes = options.subnodesAccessor(node);
    for (var i=0; i<subnodes.length; i++) {
      visitNode(subnodes[i]);
    }
    options.onNode(node, options.userdata);
  })(rootNode);

  return rootNode;
}


module.exports = {
  breadth: traverseBreadthFirst,
  breadthSync: traverseBreadthFirstSync,
  depth: traverseDepthFirst,
  depthSync: traverseDepthFirstSync,
  recursive: traverseRecursive,
  recursiveSync: traverseRecursiveSync
};
