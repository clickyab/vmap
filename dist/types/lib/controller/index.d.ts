import { IPosition } from "../../jwplayer-plugin/plugin";
export default class Controller {
    /**
     * Player reference
     */
    private player;
    /**
     * Plugin's div element that provide by JwPlayer
     */
    private div;
    /**
     * Title or TLD of the ad
     */
    private title;
    /**
     * Source of the ad's. This is the link of ads
     */
    private src;
    /**
     * Show ad's skip button timeoffset
     */
    private skipAfter;
    /**
     * Element of count down
     */
    private skipCountDown?;
    /**
     * Element of player time line
     */
    private playerTimeLine?;
    /**
     * on click on ad link event
     */
    private onOpenAdClick?;
    /**
     * on ad's show video end event
     */
    private onEnd?;
    /**
     * on skip ad's video click event
     */
    private onSkip?;
    /**
     * Overlay element
     */
    private overlay?;
    /**
     * Show controller Btn element
     */
    private showControllerBtn;
    /**
     * define the user's browser is mobile or not
     */
    private isMobile;
    /**
     * define click event name
     */
    private clickEvent;
    /**
     * Link all controller area to ad's link or not
     * @type {boolean}
     */
    private linkWrapper;
    /**
     * Link all controller area to ad's link or not
     * @type {boolean}
     */
    private debugMode;
    /**
     * @constructor
     * @param player
     * @param {HTMLElement} div
     * @param {string} title
     * @param {string} src
     * @param {number} skipAfter
     * @param {boolean} linkWrapper
     */
    constructor(player: any, div: HTMLElement, title: string, src: string, skipAfter: number, linkWrapper?: boolean, debugMode?: boolean);
    /**
     * @func show
     * @desc show controller over the player.
     */
    show(): void;
    /**
     * @func remove
     * @desc remove controller element and erase all its elements.
     */
    remove(): void;
    /**
     * @func setOnSkip
     * @desc set on skip event
     * @param {() => void} fn
     */
    setOnSkip(fn: () => void): void;
    /**
     * @func setOnEnd
     * @desc set on end event
     * @param {() => void} fn
     */
    setOnEnd(fn: () => void): void;
    /**
     * @func setOnAdClick
     * @desc set on ad click event
     * @param {() => void} fn
     */
    setOnAdClick(fn: () => void): void;
    setShowControllerBtn(status: boolean): void;
    /**
     * @func getWrapperElement
     * @desc generate and set wrapper element of controller
     * @returns {HTMLElement}
     */
    private getWrapperElement();
    /**
     * @func setTimeLine
     * @desc set position of ad's player and calculate position of timeline jack
     * @param {IPosition} position
     */
    setTimeLine(position: IPosition): void;
    /**
     * @func getSkipElement
     * @desc generate and set skip count down element
     * @returns {HTMLElement}
     */
    private getSkipElement();
    /**
     * @func getTimeLineElement
     * @desc generate and set time line element
     * @returns {HTMLElement}
     */
    private getTimeLineElement();
    /**
     * @func getPauseButton
     * @desc generate pause button element
     * @returns {HTMLElement}
     */
    private getPauseButton();
    /**
     * @func getFullScreenButton
     * @desc generate full screen button element
     * @returns {HTMLElement}
     */
    private getFullScreenButton();
    /**
     * @func getProviderClick
     * @desc generate provider anchor element
     * @returns {HTMLElement}
     */
    private getProviderClick();
    private getAdLink(title);
    private getSkipAd();
    /**
     * @func getTimeLineWrapper
     * @desc generate time line wrapper
     * @returns {HTMLElement}
     */
    private getTimeLineWrapper();
    /**
     * @func getShadow
     * @desc generate shadow element
     * @returns {HTMLElement}
     */
    private getShadow();
    /**
     * @func formatDuration
     * @desc mask seconds number to time format
     * @param {number} input
     * @returns {string}
     */
    private formatDuration(input);
}
