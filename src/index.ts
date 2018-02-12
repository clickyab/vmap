import {VMAPParser as Parser} from "./parser/index";
import JwPlayer from "./jwplayer-plugin/index";
import VideoJs from "./videojs-plugin/index";

export default {Parser, JwPlayer, VideoJs};

//
// const xhr = new XMLHttpRequest();
//
// xhr.onreadystatechange = function() {
//     if (this.readyState === 4 && this.status === 200) {
//         let a = VMAP.JSON(xhr.responseText);
//         console.log(a);
//     }
// };
//
// xhr.open("GET", "vmap.xml");
// xhr.send();
//
