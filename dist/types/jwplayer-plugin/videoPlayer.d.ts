/**
 * Control JwPlayer video player to show video ad
 */
export default class VideoPlayer {
    jwplayer: JWPlayerStatic;
    player: any;
    div: HTMLElement;
    src: string;
    lastSrc: string;
    debugMode: boolean;
    /**
     * @constructor
     * @param {JWPlayerStatic} jwplayer
     * @param player
     * @param {HTMLElement} div
     * @param {string} src
     */
    constructor(jwplayer: JWPlayerStatic, player: any, div: HTMLElement, src: string, debugMode?: boolean);
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
