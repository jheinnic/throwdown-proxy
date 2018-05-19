var mockserver = require('mockserver-node');
mockserver.start_mockserver({
	serverPort: 1080,
	proxyPort: 1090,
	verbose: false
});

// do something

function stop_it() {
mockserver.stop_mockserver({
	serverPort: 1080,
	proxyPort: 1090,
	verbose: true
});
}

// setTimeout(stop_it, 5000);
