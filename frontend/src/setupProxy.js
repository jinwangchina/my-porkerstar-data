const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function( app ) {
    app.use(
        "/devApi",
        createProxyMiddleware({
            target: "http://localhost:5001",
            pathRewrite: {
                "^/devApi" : "/my-porkerstar-data/us-central1"
            },
            changeOrigin: true,
        })
    );
};