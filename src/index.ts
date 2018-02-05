import VMAP from "./vmapParser";

const xhr = new XMLHttpRequest();

xhr.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
        let a = VMAP.JSON(xhr.responseText);
        console.log(a);
    }
};

xhr.open("GET", "vmap.xml");
xhr.send();

