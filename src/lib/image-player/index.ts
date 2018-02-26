export default class ImagePlayer {
    private div: HTMLElement;
    private src: string;
    private config: any;
    private imageWrapper: HTMLElement;

    constructor(div: HTMLElement, src: string, config: any) {
        this.div = div;
        this.src = src;
        this.config = config;
    }

    public play() {
        if (this.config.debug) console.log("Play image ad", this.div);
        this.imageWrapper = this.getImageWrapperElement();
        this.div.appendChild(this.imageWrapper);
    }

    public stop() {
        this.imageWrapper.remove();
        this.div.style.position = "";
        this.div.style.top = "";
        this.div.style.bottom = "";
        this.div.style.left = "";
        this.div.style.right = "";
        this.div.style.zIndex = "";
    }

    private getImageWrapperElement(): HTMLElement {
        let wrapper = document.createElement("div");
        let img = document.createElement("img");

        img.src = this.src;
        img.style.width = "100%";
        img.style.height = "100%";
        wrapper.appendChild(img);

        this.div.style.position = "absolute";
        this.div.style.top = "0px";
        this.div.style.bottom = "0px";
        this.div.style.left = "0px";
        this.div.style.right = "0px";
        this.div.style.zIndex = "100";

        wrapper.id = "vmap-image-wrapper";
        wrapper.style.position = "absolute";
        wrapper.style.top = "0px";
        wrapper.style.bottom = "0px";
        wrapper.style.left = "0px";
        wrapper.style.right = "0px";
        wrapper.style.backgroundColor = "#000";

        return wrapper;
    }
}
