/// <reference path="../../../types/jwplayer.d.ts" />
/**
 * @interface IPosition
 * @desc interface of position of video player timer
 */
export interface IPosition {
    duration: number;
    position: number;
    type: string;
}
export default class JwPlayerPlugin {
    /**
     * JwPlayer Instance
     */
    private jwPlayerIns;
    /**
     * plugin config
     */
    private config;
    /**
     * VMAP object
     */
    private VMAP;
    /**
     * Player reference
     */
    private player;
    /**
     * Plugin's div element that provide by JwPlayer
     */
    private div;
    /**
     * Ad's controller layout object
     */
    private overlayController;
    /**
     * The videoPlayer object to show video ad
     */
    private videoPlayer;
    /**
     * The imagePlayer object to show image ad
     */
    private imagePlayer;
    /**
     * Show ad status flag
     */
    private adIsShowing;
    /**
     * Current adBreak that is showing
     */
    private currentAdBreak;
    /**
     * Complete ad view api call locking flag
     */
    private callCompleteViewApiLock;
    /**
     * Impression ad view api call locking flag
     */
    private callImpressionViewApiLock;
    /**
     * @constructor
     * @param {JWPlayerStatic} jwplayer
     * @param {Object} config
     * @param player
     * @param {HTMLElement} div
     */
    constructor(jwplayer: JWPlayerStatic, config: object, player: any, div: HTMLElement);
    /**
     * @func setup
     * @desc setup plugin by load VMAP object and set player events
     */
    setup(): void;
    /**
     * @func timeController
     * @des get position of player timer and call necessary functions
     * @param {IPosition} position
     */
    private timeController(position);
    /**
     * @func onVideoEnd
     * @desc This function had to call when a video completed or skipped (in ads).
     *       At first the ad's controller must remove.
     *       This function control the state of player and insure that ad is playing or not.
     *       If the ad's state is playing, the ad player (image or video) had to stop and the main video had to play
     * @param skipped
     */
    private onVideoEnd(skipped?);
    /**
     * @func callCompleteViewApi
     * @desc call complete ad view's api if the type of ad is video.
     *       the api call will be lock for 2 seconds
     */
    private callCompleteViewApi();
    /**
     * @func callImpressionAdi
     * @desc call impression's api.
     *       the api call will be lock for 2 seconds
     */
    private callImpressionAdi();
    /**
     * @func showStartLinearAd
     * @desc show linear ad. this method check ad is not playing and check vmap object for start type of ad
     */
    showStartLinearAd(): void;
    /**
     * @func showEndLinerAd
     * @desc show linear ad. this method check ad is not playing and check vmap object for end type of ad
     */
    private showEndLinerAd();
    /**
     * @func loadVMAP
     * @desc Load VMAP xml data and parse that
     * @param {string} url
     * @returns {Promise<IVMAP>}
     */
    private loadVMAP(url?);
    /**
     * @func showAd
     * @desc Check ad's media type and show player
     * @param {IAdBreak} adBreak
     */
    private showAd(adBreak);
    /**
     * @func showImagePlayer
     * @desc Create imagePlayer object and set it's event.
     * @param {Ad} ad
     * @param {IAdBreak} adBreak
     */
    private showImagePlayer(ad, adBreak);
    /**
     * @func showVideoPlayer
     * @desc Create videoPlayer object and set it's event.
     * @param {Ad} ad
     * @param {IAdBreak} adBreak
     */
    private showVideoPlayer(ad, adBreak);
}
