# ui5flow-localserver

Develop and run your OpenUI5/SAPUI5 applications locally in any code editor you want using a simple node.js based server with reverse proxy support.
 
Publish&Share your applications on [ui5flow.com](https://www.ui5flow.com) using the same proxy settings used in ui5flow-localserver.

## Configuration

Server configuration

```json
{
    "port": "8001",
    "appsDir": "ui5apps",
    "services": [
        {
            "path": "",
            "pathRewrite":
            {
            },
            "targetHost": "",
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
