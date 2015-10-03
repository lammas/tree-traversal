# tree-traversal
Iterative tree structure traversal library for Node.js.

Provides (asynchronous) iterative tree traversal strategies (breadth first,
depth first) for arbitrary tree structures. There are also recursive traversal
methods, though they should not be used on large trees due to stack size limitations.

## Install

    npm install tree-traversal


## API

* `breadth(rootNode, options)` - asynchronous iterative breadth first traversal
  - `rootNode` - The root node of the tree structure
  - `options` - Object providing callbacks for traversing the tree:
  ```javascript
  // Options with default values:
  {
      // Subnode accessor: used to traverse the tree.
      // Must return an array of node's subnodes.
      subnodesAccessor: function(node) { return node.subnodes; },

      // Userdata accessor: allows modification of userdata
      // based on the current node. Note that this is called
      // after the onNode callback.
      // Must return the replacement userdata.
      userdataAccessor: function(node, userdata) { return userdata; },

      // Function called for each node in the tree. When the
      // function finishes it needs to call callback to continue
      // the tree traversal.
      onNode: function(node, callback, userdata) { callback(); },

      // Function called when all nodes have been visited.
      onComplete: function(rootNode) {},

      // Optional application data.
      userdata: null
  }
  ```
* `breadthSync(rootNode, options)` - synchronous iterative breadth first traversal
  - `rootNode` - The root node of the tree structure
  - `options` - Object providing callbacks for traversing the tree:
  ```javascript
  // Options with default values:
  {
      // Subnode accessor: used to traverse the tree.
      // Must return an array of node's subnodes.
      subnodesAccessor: function(node) { return node.subnodes; },

      // Userdata accessor: allows modification of userdata
      // based on the current node. Note that this is called
      // after the onNode callback.
      // Must return the replacement userdata.
      userdataAccessor: function(node, userdata) { return userdata; },

      // Function called for each node in the tree.
      // Tree traversal continues when this callback returns.
      onNode: function(node, userdata) {},

      // Optional application data.
      userdata: null
  }
  ```
* `depth(rootNode, options)` - asynchronous iterative depth first traversal
  - `rootNode` - The root node of the tree structure
  - `options` - Object providing callbacks for traversing the tree:
  ```javascript
  // Options with default values:
  {
      // Subnode accessor: used to traverse the tree.
      // Must return an array of node's subnodes.
      subnodesAccessor: function(node) { return node.subnodes; },

      // Userdata accessor: allows modification of userdata
      // based on the current node. Note that this is called
      // after the onNode callback.
      // Must return the replacement userdata.
      userdataAccessor: function(node, userdata) { return userdata; },

      // Function called for each node in the tree. When the
      // function finishes it needs to call callback to continue
      // the tree traversal.
      onNode: function(node, callback, userdata) { callback(); },

      // Function called when all nodes have been visited.
      onComplete: function(rootNode) {},

      // Optional application data.
      userdata: null
  }
  ```
* `depthSync(rootNode, options)` - synchronous iterative depth first traversal
  - `rootNode` - The root node of the tree structure
  - `options` - Object providing callbacks for traversing the tree:
  ```javascript
  // Options with default values:
  {
      // Subnode accessor: used to traverse the tree.
      // Must return an array of node's subnodes.
      subnodesAccessor: function(node) { return node.subnodes; },

      // Userdata accessor: allows modification of userdata
      // based on the current node. Note that this is called
      // after the onNode callback.
      // Must return the replacement userdata.
      userdataAccessor: function(node, userdata) { return userdata; },

      // Function called for each node in the tree.
      // Tree traversal continues when this callback returns.
      onNode: function(node, userdata) {},

      // Optional application data.
      userdata: null
  }
  ```

## Dependencies

* async
