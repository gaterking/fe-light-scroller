// eslint-disable-next-line import/no-extraneous-dependencies
const serve = require('webpack-serve');
const openBrowser = require('./open-browser');
const config = require('./example.config');

serve({ config, clipboard: false }).then((server) => {
    server.on('listening', () => {
        openBrowser(`http://${server.options.host}:${server.options.port}`);
    });
});
