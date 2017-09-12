let logger = require('../')({file:true});

logger.log('hello');
logger.trace('hello', 'world');
logger.debug('hello %s',  'world', 123);
logger.info('hello %s %d',  'world', 123, {foo:'bar'});
logger.warn('hello %s %d %j', 'world', 123, {foo:'bar'});
logger.error('hello %s %d %j', 'world', 123, {foo:'bar'}, [1, 2, 3, 4], Object);

var obj = {
  Request: [{
    IsValid: ['True'],
    ItemSearchRequest: [{
      ResponseGroup: ['Small', 'OfferSummary'],
      Sort: ['salesrank'],
      SearchIndex: ['DVD']
    }]
  }]
};

(function testfunc () {
  logger.info(obj);
})()
