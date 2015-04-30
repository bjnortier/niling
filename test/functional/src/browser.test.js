var lib = require('../../..');
var InMemoryContainer = lib.InMemoryContainer;

// Create a new container for objects
var container = new InMemoryContainer();

// Add an object
var ref1 = container.add({a: 1, b:2, c: 3});
console.log('obj ref:', ref1);

container.on('syncedObject', function(ref) {
  console.log('synced object', ref);
});

// // Commit the container, this will trigger a sync
// var headRef = container.commit();
// console.log('head ref:', headRef);



// container.on('syncedHead', function(ref) {
//   console.log('synced head', ref);
// });