const express = require('express');
const path = require('path');
const compression = require('compression');
const bodyParser = require('body-parser');
const httpProxy = require('http-proxy');
const https = require('https');
const session = require('express-session');
const routes = require('express').Router();

var proxyConf = {
    services: [{
        url: '',
        originProxyPartPath: '',
        targetProxyPartPath: '',
        targetHost: '',
        csrfEnabled: true,
        targetHeaders: {
        }
    }
    ]
}

try {
    var port = '8010';
    var appsDir = 'ui5apps';
    var proxyTarget = false;
    var proxyHost = '';

    var app = express();
    app.use(compression());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, '..', appsDir)));

    var proxy = httpProxy.createProxyServer({});

    var target = '';

    proxy.on('proxyReq', function(proxyReq, req, res, options) {
        proxyReq.path = target;
        /*
        Http-proxy has a problem with using body-parser supposedly because it parses the body 
        as a stream and never closes it so the proxy never never completes the request.
        Therefore there is following workaround necessary.
        */
        if (req.get('Content-Type') == 'application/json' || req.get('content-type') == 'application/json') {
            if (req.body) {
                var bodyData = JSON.stringify(req.body);

                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));

                // stream the content
                proxyReq.write(bodyData);
            }
        }
    });


    proxy.on('error', function(err, preq, pres) {
        /*
        pres.writeHead(500, { 'Content-Type': 'text/plain' });
        pres.write("An error happened at server. Please contact your administrator.");
        pres.end();
        */
    });

    routes.route(/^\/(.+)/).all(function(req, res, next) {


        proxyTarget = proxyConf.services.find(function(service) {
            return req.url.includes(service.url);
        });

        if (proxyTarget) {
            if (proxyTarget.url) {
                var urlPath = req.url.replace(proxyTarget.originProxyPartPath, proxyTarget.targetProxyPartPath);
                proxyHost = proxyTarget.targetHost;
                target = proxyHost + urlPath;

                console.log('\nheaders: \n', proxyTarget.targetHeaders);
                console.log('target: \n', target);
                //console.log('req: \n', req);

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

    console.log('Listening on port %s ...', port);
} catch (err) {
    console.log('Somehing bad happened ... \n', err);
}

