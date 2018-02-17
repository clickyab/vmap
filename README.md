# VMAP Parser, JwPlayer and VideoJs plugin 
 
 VMAP Parser, JwPlayer and VideoJs plugin.
 
 Showing a VMAP ad require to parse the VMAP xml and show ad in video player. This package
 handle VMAP parsing (to a JS object), VideoJs plugin and JwPlayer plugin. You can use this 
 package in Browser (umd) or Node (es).
 
 ## Install 
 You can install this package with npm:
 
 ```bash
npm install vmap-kit@latest
```
or with yarn:
 ```bash
yarn add vmap-kit@latest
```
 
 
## Parse VMAP
To parse VMAP xml in browser you need to load the script:

```html
<script src="dist/parser/browser.js"></script> 
```

and then parse the xml. An example of load VMAP from remote can be found in bellow:  
 
```javascript
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
        var vmapObject = VMAP.JSON(xhr.responseText);
        console.log(vmapObject);
    }
};
xhr.open("GET", "vmap.xml");
xhr.send();
```

## Video Player plugin
The official JwPlayer's ad plugin isn't free and you can find a free version here.
The VideoJs and JwPlayer plugins load the VMAP xml and show the ad.

Currently these plugins support these types of MediaFile's mimetype:
* image/gif
* image/png
* image/jpeg
* video/mp4

and also can play ads this `start` and `end` time offset.

**Warning: from 1.0.3 version, the plugin name change from `vmap` to `vast`.**

### JwPlayer VMAP Plugin

To show ad in JwPlayer you need put this config in your JwPlayer config:
```javascript
var playerInstance = jwplayer("video");
playerInstance.setup({
    ....
    plugins: {
        "dist/jwplayer/vmap.js": {}
    },

    advertising: {
        client: "vast",
        tag: "/sample/vmap.xml" // VMAP endpoint address
    }
    ....
});
```
 
 An example of JwPlayer can be found [here](sample/jwPlayer.html).
 
### VideoJs VMAP Plugin

To show ad in VideoJs you need load the plugin script:

```javascript
<script src="/dist/videojs/vmap.js"></script>
```
and then config the VideoJs to show ad in its options:
```javascript
plugins: {
        vast: {
            requestUrl: '/sample/vmap.xml',
        }
    }
```
 
 An example of JwPlayer can be found [here](sample/videoJs.html).
 
 ### Todo List
 * Tests
 * Support other time offsets
 
 ## License
 The license of this package is [MIT License](LICENSE.txt) and is being developed in [ClickYab](http://clickyab.com).  
