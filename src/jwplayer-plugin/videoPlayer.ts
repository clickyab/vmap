/**
 * Control JwPlayer video player to show video ad
 */
export default class VideoPlayer {
    jwplayer: JWPlayerStatic;
    player: any;
    div: HTMLElement;
    src: string;
    lastSrc: string = "";
    debugMode: boolean = false;

    /**
     * @constructor
     * @param {JWPlayerStatic} jwplayer
     * @param player
     * @param {HTMLElement} div
     * @param {string} src
     */
    constructor(jwplayer: JWPlayerStatic,
                player: any,
                div: HTMLElement,
                src: string,
                debugMode:boolean = false) {
        if (this.debugMode) console.debug("create new instance of video player.");
        this.jwplayer = jwplayer;
        this.div = div;
        this.player = player;
        this.src = src;
        this.debugMode = debugMode;
    }

    /**
     * @func play
     * @desc change source of the video element and play ad
     */
    public play() {
        if (this.debugMode) console.debug("play ad video player.");

        this.player.setControls(false);
        let video = this.getVideoElement();
        this.lastSrc = video.currentSrc;
        this.player.stop();

        setTimeout(() => {
            video.setAttribute("src", this.src);
            video.pause();
            if (this.debugMode) console.log(video.getAttribute("src"), {video});
            video.play();
        }, 1);
    }

    /**
     * @func skip
     * @desc skip ad
     * @param {boolean} replay
     */
    public skip(replay: boolean) {
        if (this.debugMode) console.debug("skip ad video player.", this.lastSrc);
        let video = this.getVideoElement();
        video.setAttribute("src", this.lastSrc);
        this.player.setControls(true);

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
        let videoContainer = this.player.getContainer();
        return videoContainer.getElementsByTagName("video")[0];
    }
}
