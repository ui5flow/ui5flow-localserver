const express = require('express');
const path = require('path');
const compression = require('compression');
const bodyParser = require('body-parser');
const httpProxy = require('http-proxy');
const https = require('https');
const routes = require('express').Router();
const serverConfig = require("./config.json");

var config = serverConfig;
var cnsColors = {
  reset: '\x1b[0m',
  success: '\x1b[32m',
  error: '\x1b[31m',
  warning: '\x1b[33m',
  emphasize: '\x1b[1m'
}

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
        console.log(cnsColors.error, 'Proxy error occured.');
        console.log(cnsColors.emphasize, err, cnsColors.reset);
    });

    var proxyHost = '';
    var proxyTarget = false;    
    routes.route(/^\/(.+)/).all(function(req, res, next) {

        proxyTarget = config.services.find(function(service) {
            return req.url.includes(service.path);
        });

        if (proxyTarget) {
            if (proxyTarget.path) {

                var targetPath = proxyTarget.path;
                if(proxyTarget.pathRewrite) {
                  for (var rewriteKey in proxyTarget.pathRewrite){
                      if (proxyTarget.pathRewrite.hasOwnProperty(rewriteKey)) {
                          try {
                              new RegExp(rewriteKey);
                          }
                          catch(e) {
                              console.log(cnsColors.error, 'Configuration error occured.');
                              console.log(cnsColors.emphasize, 'Invalid regular expression in "' + rewriteKey + '". Please review your configuration.', cnsColors.reset);
                              return res.status(500).json('Invalid regular expression in ' + rewriteKey + '. Please review your configuration.');  
                          }
                          targetPath = targetPath.replace(new RegExp( rewriteKey ), proxyTarget.pathRewrite[rewriteKey]);
                      }
                  } 
                }

                var proxyHost = proxyTarget.targetHost;
                target = proxyHost + targetPath;

                console.log(cnsColors.emphasize,'Requesting: ', target, cnsColors.reset);

                if (!proxyTarget.targetHeaders) {
                  proxyTarget.targetHeaders = {};
                }

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

    console.log(cnsColors.success, 'UI5 Server listening on port ' + port + ' ...', cnsColors.reset);
} catch (err) {
    console.log(cnsColors.error, 'Somehing bad happened ... ');
    console.log(cnsColors.emphasize, err, cnsColors.reset);
}

