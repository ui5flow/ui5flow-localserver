# ui5flow-localserver

Develop and run your OpenUI5/SAPUI5 applications locally in any code editor you want using a simple node.js based server with reverse proxy support.
 
Publish&Share your applications on [ui5flow.com](https://www.ui5flow.com) using the same proxy settings used in ui5flow-localserver.




## Configuration options
Change the  `conf.js` file to setup the server.

### port
Type: `string`  
Port of the local server.

### appsDir
Type: `string`  
Name of the directory where your UI5 applications are located. Relative path may be also used.

### services 
Type: `array` of `object`  
Array with proxy configuration objects.

### path
Type: `string`  
Path of the webservice.

### pathRewrite
Type: `object`  
Option to rewrite the target path. 

Examples:

```
...
  "pathRewrite": {
       "/V4/Northwind/": "/V2/Westwind/"
   },
   "targetHost": "http://services.odata.org"
...
```
Original path: `/V4/Northwind/`  
Taget path: `http://services.odata.org/V2/Westwind/` will be requested  



```
  ...
  "pathRewrite": { 
      "/V4/Northwind": "/V2/"
   },
   "targetHost": "http://services.odata.org"
   ...
```
Original path: `/V4/Northwind/`  
Taget path: `http://services.odata.org/V2/` will be requested  



```
  ...
  "pathRewrite": {
      ".+?/resources/": "/resources/"
  },
  "targetHost": "https://openui5.hana.ondemand.com",
  ...
```
Original path: `../resources/`  
Taget path: `https://https://openui5.hana.ondemand.com/resources/` will be requested


### targetHost
Type: `string`
Target host of the webservice.

### targetHeaders 
Type: `object`
Headers to be sent with the request.  

Example:
```
   ...
   "targetHeaders": {
       "Authorization": "Basic VVNFUjpQQVNTV09SRA=="
   }
   ...            
```

## Configuration example

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

## Usage

1. Copy your OpenUI5/SAPUI5 application into the `"appsDir":"<yourAppsDirectory>` directory. 
    > If you have more applications just store them in separated subdirectories. E.g. when `"appsDir":"ui5apps"`:
```
 - ui5apps
 -+ myApp1
 -+ myApp2
```

2. Go to the server directory and start the server by typing `node ui5server` in the command line.
    > If you have installed the server in the `C:\Users\myUser\UI5Development\ui5flow-localserver` directory and configured `"appsDir":"ui5apps"` then after successful server start you should see folowing lines in your console:
```
 UI5 Applications root path: C:\Users\myUser\UI5Development\ui5flow-localserver\ui5apps
 UI5 Server listening on port 8001 ...
```

3. Type `http://localhost:8001/myApp1` in browser and your application will start ...

