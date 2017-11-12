const express = require('express');
const path = require('path');
const compression = require('compression');
const bodyParser = require('body-parser');
const httpProxy = require('http-proxy');
const https = require('https');
const routes = require('express').Router();
const serverConfig = require("./config.json");

var config = serverConfig;

try {
    var port = config.port;
    var appsDir = config.appsDir;

    var app = express();

    app.use(compression());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(express.static(path.join(__dirname, '..', appsDir)));

    var proxy = httpProxy.createProxyServer({});

    var target = '';
    proxy.on('proxyReq', function(proxyReq, req, res, options) {
        proxyReq.path = target;

        if(req.is('application/json')) {
            if (req.body) {
                var bodyData = JSON.stringify(req.body);

                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));

                proxyReq.write(bodyData);
            }
        }
    });


    proxy.on('error', function(err, preq, pres) {
        console.log('Proxy error: \n', err);
    });

    var proxyHost = '';
    var proxyTarget = false;    
    routes.route(/^\/(.+)/).all(function(req, res, next) {

        proxyTarget = config.services.find(function(service) {
            return req.url.includes(service.url);
        });

        if (proxyTarget) {
            if (proxyTarget.url) {
                var urlPath = req.url.replace(proxyTarget.originProxyPartPath, proxyTarget.targetProxyPartPath);
                proxyHost = proxyTarget.targetHost;
                target = proxyHost + urlPath;

                proxy.web(req, res, {
                    target: target,
                    agent: new https.Agent({ keepAlive: true }),
                    changeOrigin: true,
                    secure: false,
                    headers: proxyTarget.targetHeaders
                });
               
            } else {
                return next();
            }
        } else {
            return next();
        }


    });

    app.use('/', routes);
    app.listen(port);

    console.log('UI5 Server listening on port %s ...', port);
} catch (err) {
    console.log('Somehing bad happened ... \n', err);
}

