/**
 * Control JwPlayer video player to show video ad
 */
export default class VideoPlayer {
    player: any;
    div: HTMLElement;
    src: string;
    lastSrc: string = "";

    /**
     * @constructor
     * @param player
     * @param {HTMLElement} div
     * @param {string} src
     */
    constructor(player: any, div: HTMLElement, src: string) {
        console.debug("create new instance of video player.");
        this.div = div;
        this.player = player;
        this.src = src;
    }

    /**
     * @func play
     * @desc change source of the video element and play ad
     */
    public play() {
        console.debug("play ad video player.");

        this.player.controls(false);
        let video = this.getVideoElement();
        this.lastSrc = video.currentSrc;
        this.player.pause();

        setTimeout(() => {
            video.setAttribute("src", this.src);
            video.pause();
            console.log(video.getAttribute("src"), {video});
            video.play();
        }, 1);
    }

    /**
     * @func skip
     * @desc skip ad
     * @param {boolean} replay
     */
    public skip(replay: boolean) {
        console.debug("skip ad video player.", this.lastSrc);
        let video = this.getVideoElement();
        video.setAttribute("src", this.lastSrc);
        this.player.controls(true);

        if (replay) {
            video.pause();
            setTimeout(() => {
                video.currentTime = 0.1;
                video.play();
            }, 10);
        }
    }

    /**
     * @func getVideoElement
     * @desc get video element
     */
    private getVideoElement() {
        console.log({a: this.div});
        let videoContainer = this.div.parentElement || document.createElement("div");
        return videoContainer.getElementsByTagName("video")[0];
    }
}
