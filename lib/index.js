module.exports.containers = {
  InMemoryContainer: require('./containers/InMemoryContainer'),
  IndexedDBContainer: require('./containers/IndexedDBContainer'),
  SQLiteContainer: require('./containers/SQLiteContainer'),
};

module.exports.connectors = {
  EventConnector: require('./connectors/EventConnector'),
};