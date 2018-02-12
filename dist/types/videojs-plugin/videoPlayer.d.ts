/**
 * Control JwPlayer video player to show video ad
 */
export default class VideoPlayer {
    player: any;
    div: HTMLElement;
    src: string;
    lastSrc: string;
    /**
     * @constructor
     * @param player
     * @param {HTMLElement} div
     * @param {string} src
     */
    constructor(player: any, div: HTMLElement, src: string);
    /**
     * @func play
     * @desc change source of the video element and play ad
     */
    play(): void;
    /**
     * @func skip
     * @desc skip ad
     * @param {boolean} replay
     */
    skip(replay: boolean): void;
    /**
     * @func getVideoElement
     * @desc get video element
     */
    private getVideoElement();
}
