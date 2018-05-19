var mockserver = require('mockserver-node');

// do something

mockserver.stop_mockserver({
	serverPort: 1080,
	proxyPort: 1090
});
