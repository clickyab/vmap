import { IVMAP } from "../definitions/VMAP";
/**
 * main class for parse VMAP xml
 */
export declare class VMAPParser {
    private xml?;
    /**
     * @constructor
     * Set initial value
     * @param {string} xml
     */
    constructor(xml?: string);
    /**
     * Parse input xml string to IVMAP Object
     * @param {string} xml
     * @returns {IVMAP}
     */
    JSON(xml?: string): IVMAP;
    /**
     * Parse version of VMAP
     * @param VMAP
     * @returns {string}
     */
    private getVersion(VMAP);
    /**
     * Parse ad breaks
     * @param AdBreak
     * @returns {IAdBreak}
     */
    private getBreaks(AdBreak);
    /**
     * Parse Vast ad Data
     * @param vast
     * @returns {IVAST3}
     */
    private parseVASTAdDataAds(vast);
    /**
     * Parse ad
     * @param ad
     * @returns {Ad[]}
     */
    private parseAd(ad);
    /**
     * Parse Creative
     * @param creativeInput
     * @returns {ICreative[]}
     */
    private parseCreative(creativeInput);
    /**
     * Parse MediaFile
     * @param mediaFilesInput
     * @returns {IMediaFile[]}
     */
    private parseMediaFile(mediaFilesInput);
    /**
     * Parse TrackingEvents
     * @param trackingInput
     * @returns {ITrackingEvent[]}
     */
    private parseTrackingEvents(trackingInput);
    /**
     * Parse VideoClicks
     * @param videoClickInput
     * @returns {IVideoClick}
     */
    private parseVideoClicks(videoClickInput);
    /**
     * Parse Extensions
     * @param extensionsInput
     * @returns {IExtension[]}
     */
    private parseExtensions(extensionsInput);
    /**
     * Parse Impressions
     * @param impressionInput
     * @returns {IAdImpression[]}
     */
    private parseImpression(impressionInput);
}
declare const _default: VMAPParser;
export default _default;
