/**
 * VideoJs VMAP plugin
 * This plugin load VMAP xml and parse it with internal VMAP parser and show linear ads.
 * This plugin can show gif, png, jpeg and mp4 ads.
 */
/// <reference path="../../types/videojs.d.ts"/>

import {VMAPParser} from "../parser/index";
import {AdBreakType, IAdBreak, IVMAP} from "../definitions/VMAP" ;
import {Ad, ITrackingEvent, mimetype} from "../definitions/VAST3";
import ImagePlayer from "../lib/image-player/index";
import VideoPlayer from "./videoPlayer";
import Controller from "../lib/controller/index";
import FP from "fingerprintjs2";

/**
 * @interface IPosition
 * @desc interface of position of video player timer
 */
export interface IPosition {
    duration: number;
    position: number;
    type: string;
}

export default class VideoJsPlugin {
    /**
     * VideoJs Player Instance
     */
    private player: Player;

    /**
     * plugin config
     */
    private config: VideojsPluginOption;

    /**
     * VMAP object
     */
    private VMAP: IVMAP;

    /**
     * Plugin's div element that provide by VideoJs
     */
    private div: HTMLElement;

    /**
     * Ad's controller layout object
     */
    private overlayController: Controller;

    /**
     * The videoPlayer object to show video ad
     */
    private videoPlayer: VideoPlayer | null;

    /**
     * The imagePlayer object to show image ad
     */
    private imagePlayer: ImagePlayer | null;

    /**
     * Show ad status flag
     */
    private adIsShowing: boolean = false;

    /**  /**
     * Show ad status flag
     */
    private timerLock: number = 0;

    /**
     * Current adBreak that is showing
     */
    private currentAdBreak: IAdBreak;

    /**
     * Complete ad view api call locking flag
     */
    private callCompleteViewApiLock: boolean;

    /**
     * Impression ad view api call locking flag
     */
    private callImpressionViewApiLock: boolean;

    private mainVideoEnded = false;

    /**
     * @constructor
     * @param {VideoJsStatic} videoJsPlayer
     * @param {Object} config
     * @param player
     * @param {HTMLElement} div
     */
    constructor(videoJsPlayer: Player, config: VideojsPluginOption, div: HTMLElement) {
        if (config.debug) console.debug("Init VideoJs Vast Plugin Class.");

        this.player = videoJsPlayer;
        this.config = config;
        this.div = div;
    }

    /**
     * @func setup
     * @desc setup plugin by load VMAP object and set player events
     */
    public setup() {
        if (this.config.debug) console.debug("Setting VideoJs Vast Plugin up.");

        this.loadVMAP().then(vmap => {
            this.VMAP = vmap;
            if (this.config.debug) console.debug("VMAP object is loaded", vmap);

            this.player.on("timeupdate", () => {
                this.timeController()
            });

            this.player.on('play', () => {
                if (this.mainVideoEnded && this.currentAdBreak && this.currentAdBreak.timeOffset === "end") {
                    this.mainVideoEnded = false;
                    this.adIsShowing = false;
                    this.showStartLinearAd();
                }
            });
        });
    }

    /**
     * @func timeController
     * @des get position of player timer and call necessary functions
     */
    private timeController() {
        const position: IPosition = {
            position: this.player.currentTime(),
            duration: this.player.duration(),
            type: "time"
        };

        if (this.timerLock === position.position - position.duration) {
            return;
        }
        this.timerLock = position.position - position.duration;


        if (position.position - position.duration === 0) {
            this.onVideoEnd(false);
        } else {
            if (this.overlayController) this.overlayController.setTimeLine(position);
        }

        if (!this.callCompleteViewApiLock && this.adIsShowing && position.position >= 30) {
            this.callCompleteViewApi();
        }
    }

    /**
     * @func onVideoEnd
     * @desc This function had to call when a video completed or skipped (in ads).
     *       At first the ad's controller must remove.
     *       This function control the state of player and insure that ad is playing or not.
     *       If the ad's state is playing, the ad player (image or video) had to stop and the main video had to play
     * @param skipped
     */
    private onVideoEnd(skipped?: boolean) {
        if (this.overlayController) this.overlayController.remove();
        if (this.adIsShowing) {
            if (!skipped) {
                this.callCompleteViewApi();
            }

            setTimeout(() => {
                this.adIsShowing = false;
            }, 2000);

            if (this.currentAdBreak.timeOffset === "start") {
                if (!!this.videoPlayer) {
                    this.videoPlayer.skip(true);
                    this.videoPlayer = null;
                } else if (!!this.imagePlayer) {
                    this.imagePlayer.stop();
                    this.imagePlayer = null;
                    setTimeout(() => {
                        this.player.play();
                    }, 100);
                }
            } else if (this.currentAdBreak.timeOffset === "end") {
                if (!!this.videoPlayer) {
                    this.videoPlayer.skip(false);
                    this.videoPlayer = null;
                } else if (!!this.imagePlayer) {
                    this.imagePlayer.stop();
                    this.imagePlayer = null;
                }
            }
        } else if (skipped === false) {
            setTimeout(() => {
                this.showEndLinerAd();
            }, 100);
        }
    }

    /**
     * @func callCompleteViewApi
     * @desc call complete ad view's api if the type of ad is video.
     *       the api call will be lock for 2 seconds
     */
    private callCompleteViewApi() {
        if (this.config.debug) console.debug("Call complete view api");

        if (this.callCompleteViewApiLock) {
            return;
        }
        this.callCompleteViewApiLock = true;

        const ad = this.currentAdBreak.adSource.VASTAdData.ads[0];
        const creative = ad.creative[0];
        const completeTrackingIndex: number = creative.trackings.findIndex(
            (i: ITrackingEvent) => i.event === "complete"
        );
        if (
            completeTrackingIndex === -1 ||
            this.currentAdBreak.adSource.VASTAdData.ads[0].creative[0].mediaFiles[0]
                .mimetype !== "video/mp4"
        ) {
            return;
        }

        if (this.config.debug) console.debug("Call complete view api with url: ",creative.trackings[completeTrackingIndex].uri);
        const xhr = new XMLHttpRequest();
        xhr.open("get", creative.trackings[completeTrackingIndex].uri);
        xhr.send();
    }

    /**
     * @func callImpressionAdi
     * @desc call impression's api.
     *       the api call will be lock for 2 seconds
     */
    private callImpressionAdi() {
        if (this.config.debug) console.debug("Call impression api");

        if (this.callImpressionViewApiLock) {
            return;
        }
        this.callImpressionViewApiLock = true;

        setTimeout(() => {
            this.callImpressionViewApiLock = false;
        }, 2000);

        const ad = this.currentAdBreak.adSource.VASTAdData.ads[0];
        const impression = ad.impressions[0];
        if (!impression) return;

        if (this.config.debug) console.debug("Call impression api with url: ", impression.uri);
        let imgDom = document.createElement("img");
        imgDom.src = impression.uri;
        imgDom.style.display = "none";
        this.div.appendChild(imgDom);
    }

    /**
     * @func showStartLinearAd
     * @desc show linear ad. this method check ad is not playing and check vmap object for start type of ad
     */
    public showStartLinearAd() {
        if (this.config.debug)  console.debug("show start liner ad");
        let skipShowAd = false;

        if (this.adIsShowing) return;
        this.adIsShowing = true;

        if (this.player.currentTime() >= 0.1) return;

        this.VMAP.breaks.forEach(adBreak => {
            if (
                adBreak.breakTypes[0] === AdBreakType.linear &&
                adBreak.timeOffset === "start" &&
                !skipShowAd
            ) {
                this.showAd(adBreak);
                skipShowAd = true;
            }
        });
    }

    /**
     * @func showEndLinerAd
     * @desc show linear ad. this method check ad is not playing and check vmap object for end type of ad
     */
    private showEndLinerAd() {
        if (this.config.debug) console.debug("show end liner ad");
        let skipShowAd = false;

        setTimeout(() => {
            this.mainVideoEnded = true;
        }, 1000);

        if (this.adIsShowing) return;
        this.adIsShowing = true;

        this.VMAP.breaks.forEach(adBreak => {
            if (
                adBreak.breakTypes[0] === AdBreakType.linear &&
                adBreak.timeOffset === "end" &&
                !skipShowAd
            ) {
                this.showAd(adBreak);
                skipShowAd = true;
            }
        });
    }

    /**
     * @func loadVMAP
     * @desc Load VMAP xml data and parse that
     * @param {string} url
     * @returns {Promise<IVMAP>}
     */
    private loadVMAP(url: string = this.config.requestUrl): Promise<IVMAP> {
        let that = this;
        if (this.config.debug) console.debug(`Try to load VideoJs VMAP from ${url}`);

        return new Promise((resolve, reject) => {
            new FP().get((r: string) => {
                const xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState === 4 && this.status === 200) {
                        let parser = new VMAPParser(xhr.responseText, that.config.debug);
                        let VMAP = parser.JSON(xhr.responseText);
                        if (that.config.debug) console.debug(`VMAP loaded:`, VMAP);
                        resolve(VMAP);
                    }
                };

                xhr.onerror = () => {
                    reject();
                    throw new Error(`Failed to load VideoJs VMAP from ${url}`);
                };

                xhr.open("GET", `${url}${url.indexOf('?') === -1 ? '?' : '&'}tid=${r}&p=${window.location.href}&r=${document.referrer}` );
                xhr.send();
            });
        });
    }

    /**
     * @func showAd
     * @desc Check ad's media type and show player
     * @param {IAdBreak} adBreak
     */
    private showAd(adBreak: IAdBreak) {
        if (this.config.debug) console.debug("show ad break", adBreak);

        this.currentAdBreak = adBreak;
        switch (adBreak.breakTypes[0]) {
            case AdBreakType.linear:
                const mediaFile =
                    adBreak.adSource.VASTAdData.ads[0].creative[0].mediaFiles[0];
                switch (mediaFile.mimetype) {
                    case mimetype.IMAGE_GIF:
                    case mimetype.IMAGE_JPEG:
                    case mimetype.IMAGE_PNG:
                        this.showImagePlayer(adBreak.adSource.VASTAdData.ads[0], adBreak);
                        break;

                    case mimetype.VIDEO_MP4:
                        this.showVideoPlayer(adBreak.adSource.VASTAdData.ads[0], adBreak);
                        break;

                    default:
                        throw new Error(
                            `Media file type "${mediaFile.mimetype}" is not support.`
                        );
                }
                break;

            default:
                throw new Error(
                    `AdBreak type "${this.VMAP.breaks[0].breakTypes[0]}" is not support.`
                );
        }
    }

    /**
     * @func showImagePlayer
     * @desc Create imagePlayer object and set it's event.
     * @param {Ad} ad
     * @param {IAdBreak} adBreak
     */
    private showImagePlayer(ad: Ad, adBreak: IAdBreak) {
        if (this.config.debug) console.debug("show image player", ad, adBreak);
        let clickThroughUri = ad.creative[0].videoClicks.clickThrough.uri;
        let domainEx = adBreak.extensions
            ? adBreak.extensions.findIndex(e => e.extensionType === "domain")
            : -1;

        let skipAfter = adBreak.extensions
            ? adBreak.extensions.findIndex(e => e.extensionType === "skip")
            : -1;

        this.imagePlayer = new ImagePlayer(
            this.div,
            ad.creative[0].mediaFiles[0].uri,
            {}
        );

        this.overlayController = new Controller(
            this.player,
            this.div,
            domainEx > -1 && adBreak.extensions
                ? adBreak.extensions[domainEx].value.toString()
                : "",
            clickThroughUri,
            skipAfter > -1 && adBreak.extensions
                ? parseInt(adBreak.extensions[skipAfter].value.toString(), 10)
                : 1000,
            true,
            this.config.debug
        );
        this.overlayController.setShowControllerBtn(false);

        this.imagePlayer.play();
        this.player.pause();
        const duration : number = parseInt(ad.creative[0].duration.replace(new RegExp(":", "g"), ""), 10);

        let timer = 0;
        let interval = setInterval(() => {
            timer++;
            if (timer - duration > 0) {
                if (this.imagePlayer) this.imagePlayer.stop();
                this.onVideoEnd(false);
                if (timer) clearInterval(interval);
                return;
            }
            this.overlayController.setTimeLine({
                duration: duration,
                position: timer,
                type: "time"
            });

        }, 1000);

        this.overlayController.setOnSkip(() => {
            if (this.imagePlayer) this.imagePlayer.stop();
            this.onVideoEnd(true);
            this.overlayController.remove();
            if (timer) clearInterval(interval);
        });

        this.overlayController.show();
        this.callImpressionAdi();
    }

    /**
     * @func showVideoPlayer
     * @desc Create videoPlayer object and set it's event.
     * @param {Ad} ad
     * @param {IAdBreak} adBreak
     */
    private showVideoPlayer(ad: Ad, adBreak: IAdBreak) {
        if (this.config.debug) console.debug("show video ad", ad);
        let clickThroughUri = ad.creative[0].videoClicks.clickThrough.uri;
        let domainEx = adBreak.extensions
            ? adBreak.extensions.findIndex(e => e.extensionType === "domain")
            : -1;

        let skipAfter = adBreak.extensions
            ? adBreak.extensions.findIndex(e => e.extensionType === "skip")
            : -1;

        this.videoPlayer = new VideoPlayer(
            this.player,
            this.div,
            ad.creative[0].mediaFiles[0].uri
        );

        this.overlayController = new Controller(
            this.player,
            this.div,
            (domainEx > -1 && adBreak.extensions)
                ? adBreak.extensions[domainEx].value.toString()
                : "",
            clickThroughUri,
            (skipAfter > -1 && adBreak.extensions)
                ? parseInt(adBreak.extensions[skipAfter].value.toString(), 10)
                : 1000,
            false,
            this.config.debug
        );
        this.overlayController.setShowControllerBtn(true);
        this.overlayController.setOnSkip(() => {
            this.onVideoEnd(true);
            this.overlayController.remove();
        });

        this.videoPlayer.play();
        this.overlayController.show();

        this.callImpressionAdi();
    }
}
