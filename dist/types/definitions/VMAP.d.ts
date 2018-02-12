/**
 * VMAP documents interface.
 * this file has copied from
 */
import { IVAST3 } from './VAST3';
/**
 * IAB VMAP, Video Multiple AD Playlist.
 */
export interface IVMAP {
    version: string;
    breaks: IAdBreak[];
}
/**
 * AdBreak : Top-level element, represents a single ad break, but may allow for multiple ads.
 */
export interface IAdBreak {
    timeOffset: Date | number | "start" | "end";
    breakTypes: AdBreakType[];
    adSource: IAdSource;
    trackings?: ITrackingEvent[];
    extensions?: IExtension[];
    breakId?: string;
    repeatAfter?: string;
}
/**
 * AdBreak types.
 */
export declare enum AdBreakType {
    linear = "linear",
    nonlinear = "nonlinear",
    display = "display",
}
/**
 * AdBreak events types.
 */
export declare enum TrackingEvent {
    breakStart = "breakStart",
    breakEnd = "breakEnd",
    error = "error",
}
/**
 * Container for tracking URIs for events specific to VMAP.
 */
export interface ITrackingEvent {
    uri: string;
    level: TrackingEvent;
}
/**
 * Container for Extensions that express additional information not supported by VMAP.
 */
export interface IExtension {
    extensionType: string;
    value: string | Object;
}
/**
 * AdSource : Represents the ad data that will be used to fill the ad break.
 */
export interface IAdSource {
    dataType: AdSourceTypes;
    VASTAdData: IVAST3;
    customAdData?: string | Object;
    adTagURI?: string;
    adDataType?: customAdSourceTypes | adTagURITypes;
    id?: string;
    allowMultipleAds?: boolean;
    followRedirects?: boolean;
}
/**
 * AdSource types.
 */
export declare enum AdSourceTypes {
    VAST3 = "vast3",
    custom = "custom",
    adTagURI = "adTagURL",
}
/**
 * CustomAdSource types.
 */
export declare enum customAdSourceTypes {
    vast1 = "vast1",
    vast2 = "vast2",
    proprietary = "proprietary",
}
/**
 * AdTagURI types.
 */
export declare enum adTagURITypes {
    vast1 = "vast1",
    vast2 = "vast2",
    vast3 = "vast3",
    proprietary = "proprietary",
}
