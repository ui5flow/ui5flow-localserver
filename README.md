# ui5flow-localserver

Develop and run your OpenUI5/SAPUI5 applications locally in any code editor you want using a simple node.js based server with reverse proxy support.
 
Publish&Share your applications on [ui5flow.com](https://www.ui5flow.com) using the same proxy settings used in ui5flow-localserver.

## Configuration options

### port
Type: `string`  
Port of the server

### appsDir
Type: `string`  
Name of the directory where your UI5 applications are located

### services 
Type: `array` of `object`  
Array with proxy configuration objects

### path
Type: `string`  
Path of the of the webservice 

### pathRewrite
Type: `object`  
Option to rewrite the target path. 

Examples:
Change the target path
```
...
"pathRewrite": {"/V4/Northwind/": "/V2/Westwind/"},
...
```
Original path: `/V4/Northwind/`
Taget path: `http(s)://tagethost/V2/Westwind/` will be requested

```
...
"pathRewrite": {"/V4/Northwind": "/V2"},
...
```


* `targetHost:` target host of the webservice
* `targetHeaders:` headers to be sent with the request



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

### Path rewrite

