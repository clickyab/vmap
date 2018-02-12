export default class ImagePlayer {
    private div;
    private src;
    private config;
    private imageWrapper;
    constructor(div: HTMLElement, src: string, config: any);
    play(): void;
    stop(): void;
    private getImageWrapperElement();
}
