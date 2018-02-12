/**
 * VAST documents interface.
 * this file has copied from https://github.com/etf1/IAB
 */
/**
 * IAB VAST, Video Ad Serving Template, video xml ad response.
 */
export interface IVAST3 {
    ads: Ad[];
    version: string;
}
/**
 * Top-level element, wraps each ad in the response.
 */
export interface IBaseAd {
    adType: AdType;
    adSystem: IAdSystem;
    impressions: IAdImpression[];
    creative: ICreative[];
    id?: string;
    sequence?: number;
    error?: string;
    extensions?: Object[];
}
/**
 * Inline ad.
 */
export interface IInlineAd extends IBaseAd {
    adType: AdType.inline;
    adTitle: string;
    description?: string;
    advertiser?: string;
    pricing?: IAdPricing;
    survey?: string;
}
/**
 * Wrapped ad.
 */
export interface IWrappedAd extends IBaseAd {
    adType: AdType.wrapper;
    VASTAdTagURI: string;
}
export declare type Ad = IInlineAd | IWrappedAd;
/**
 * Ad types.
 */
export declare enum AdType {
    inline = "inline",
    wrapper = "wrapper",
}
/**
 * AdSystem .
 */
export interface IAdSystem {
    name: string;
    version?: string;
}
/**
 * Ad's pricing.
 */
export interface IAdPricing {
    value: number;
    model?: AdPricingModel;
    currency?: string;
}
/**
 * Ad pricing models.
 */
export declare enum AdPricingModel {
    cpc = "cpc",
    cpm = "cpm",
    cpe = "cpe",
    cpv = "cpv",
}
/**
 * Ad impression tracker.
 */
export interface IAdImpression {
    uri: string;
    id?: string;
}
/**
 * Wraps each creative element within an InLine or Wrapper Ad.
 */
export interface ICreative {
    creativeType: CreativeType;
    duration: string;
    extensions?: Object[];
    adParameters?: IAdParameters;
    trackings: ITrackingEvent[];
    videoClicks: IVideoClick;
    mediaFiles: IMediaFile[];
    skipoffset?: string;
    id?: string;
    sequence?: number;
    adID?: string;
}
/**
 * Creative types.
 */
export declare enum CreativeType {
    linear = "linear",
}
/**
 * Container for ad parameters.
 */
export interface IAdParameters {
    xmlEncoded: boolean;
    value: string | Object;
}
/**
 * Container for tracking URIs for events specific to creative.
 */
export interface ITrackingEvent {
    event: TrackingEventType;
    uri: string;
    offset?: string;
}
/**
 * Tracking event types.
 */
export declare enum TrackingEventType {
    creativeView = "creativeView",
    start = "start",
    firstQuartile = "firstQuartile",
    midpoint = "midpoint",
    thirdQuartile = "thirdQuartile",
    complete = "complete",
    mute = "mute",
    unmute = "unmute",
    pause = "pause",
    rewind = "rewind",
    resume = "resume",
    fullscreen = "fullscreen",
    exitFullscreen = "exitFullscreen",
    expand = "expand",
    collapse = "collapse",
    acceptInvitation = "acceptInvitation",
    close = "close",
    skip = "skip",
    progress = "progress",
}
/**
 * Container for video clicks destination uri.
 */
export interface IVideoClick {
    clickThrough: IClickTracking;
    clickTrackings: IClickTracking[];
    customClicks?: IClickTracking[];
}
/**
 * Click tracking uri.
 */
export interface IClickTracking {
    [key: string]: string;
    uri: string;
    id: string;
}
/**
 * mimeType enum
 */
export declare enum mimetype {
    "IMAGE_GIF" = "image/gif",
    "IMAGE_PNG" = "image/png",
    "IMAGE_JPEG" = "image/jpeg",
    "VIDEO_MP4" = "video/mp4",
}
/**
 * Container for creative's media file.
 */
export interface IMediaFile {
    uri: string;
    delivery: DeliveryType;
    mimetype: mimetype;
    width: number;
    height: number;
    id?: string;
    bitrate?: number;
    minBitrate?: number;
    maxBitrate?: number;
    scalable?: boolean;
    maintainAspectRatio?: boolean;
    apiFramework?: string;
    codec?: string;
}
/**
 * Mediafile delivery types.
 */
export declare enum DeliveryType {
    streaming = 1,
    progressive = 2,
}
