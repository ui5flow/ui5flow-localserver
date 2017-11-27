# ui5flow-localserver

Develop and run your OpenUI5/SAPUI5 applications locally in any code editor you want using a simple node.js based server with reverse proxy support.
 
Publish&Share your applications on [ui5flow.com](https://www.ui5flow.com) using the same proxy settings used in ui5flow-localserver.

## Configuration

ui5flow-localserver supports the following configuration options:

* `port:` port of the server
* `appsDir:` string with the name of the directory where your UI5 applications are located
* `services:` array with proxy configuration objects
* `path:` path of the of the webservice 
* `pathRewrite:` option the rewrite the path within the reverse-proxy
* `targetHost:` target host of the webservice
* `targetHeaders:` headers to be sent within the request



### Server configuration example

```
{
    "port": "8001",
    "appsDir": "ui5apps",
    "services": [
        {
            "path": "/V4/Northwind/Northwind.svc/",
            "pathRewrite": {},
            "targetHost": "http://services.odata.org",
            "targetHeaders": {}
        },
        {
            "path": "resources/",
            "pathRewrite":
            {
                ".+?/resources/": "/resources/"
            },
            "targetHost": "https://openui5.hana.ondemand.com",
            "targetHeaders": {}
        }

    ]
}
```
