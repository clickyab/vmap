/**
 * Parse VMAP document to Json
 */
import xmlConvert from 'xml-js'
import { IAdBreak, IExtension, IVMAP } from './definitions/VMAP'
import {
  Ad,
  AdType,
  CreativeType,
  IAdImpression,
  ICreative,
  IInlineAd,
  IMediaFile,
  ITrackingEvent,
  IVAST3,
  IVideoClick
} from './definitions/VAST3'

/**
 * main class for parse VMAP xml
 */
export class VMAPParser {
  private xml: string

  /**
   * @constructor
   * Set initial value
   * @param {string} xml
   */
  constructor(xml?: string) {
    if (xml) this.xml = xml
  }

  /**
   * Parse input xml string to IVMAP Object
   * @param {string} xml
   * @returns {IVMAP}
   */
  public JSON(xml?: string): IVMAP {
    if (!xml && !this.xml) {
      throw 'XML input is required.'
    }

    const xmlString: string = xml || this.xml

    const xmlObj: any = xmlConvert.xml2json(xmlString, {
      compact: true,
      spaces: 4
    })
    const VMAP = JSON.parse(xmlObj).VMAP
    return {
      version: this.getVersion(VMAP),
      breaks: VMAP.AdBreak.map(this.getBreaks.bind(this))
    }
  }

  /**
   * Parse version of VMAP
   * @param VMAP
   * @returns {string}
   */
  private getVersion(VMAP: any): string {
    return VMAP._attributes ? VMAP._attributes.version : null
  }

  /**
   * Parse ad breaks
   * @param AdBreak
   * @returns {IAdBreak}
   */
  private getBreaks(AdBreak: any): IAdBreak {
    return {
      breakTypes: [AdBreak._attributes ? AdBreak._attributes.breakType : null],
      breakId: AdBreak._attributes ? AdBreak._attributes.breakId : null,
      timeOffset: AdBreak._attributes ? AdBreak._attributes.timeOffset : null,
      adSource: {
        id: AdBreak.AdSource._attributes
          ? AdBreak.AdSource._attributes.id
          : null,
        VASTAdData: this.parseVASTAdDataAds(AdBreak.AdSource.VASTAdData.VAST),
        adDataType: AdBreak.AdSource.adDataType,
        adTagURI: AdBreak.AdSource.adTagURL,
        allowMultipleAds: AdBreak.AdSource.allowMultipleAds,
        dataType: AdBreak.AdSource._attributes
          ? AdBreak.AdSource._attributes.dataType
          : null,
        followRedirects: AdBreak.AdSource._attributes
          ? AdBreak.AdSource._attributes.followRedirects
          : null,
        customAdData: AdBreak.AdSource.customAdData
      },
      extensions: AdBreak.Extensions
        ? this.parseExtensions(AdBreak.Extensions.Extension)
        : [],
      repeatAfter: AdBreak._attributes.repeatAfter
    }
  }

  /**
   * Parse Vast ad Data
   * @param vast
   * @returns {IVAST3}
   */
  private parseVASTAdDataAds(vast: any): IVAST3 {
    return {
      version: vast._attributes ? vast._attributes.version : null,
      ads: this.parseAd(vast.Ad)
    }
  }

  /**
   * Parse ad
   * @param ad
   * @returns {Ad[]}
   */
  private parseAd(ad: any): Ad[] {
    console.log(ad.InLine)
    // if (ad["InLine"]) {
    let liner: IInlineAd = {
      id: ad._attributes.id,
      adSystem: {
        version: ad.InLine.AdSystem._attributes
          ? ad.InLine.AdSystem._attributes.version
          : null,
        name: ad.InLine.AdSystem._cdata
      },
      adTitle: ad.InLine.AdTitle._cdata,
      adType: AdType.inline,
      extensions: ad.InLine.Extensions.Extension
        ? this.parseExtensions(ad.InLine.Extensions.Extension)
        : [],
      creative: this.parseCreative(ad.InLine.Creatives.Creative),
      error: ad.InLine.Error ? ad.InLine.Error._text : null,
      sequence: ad.InLine.Sequence ? ad.InLine.Sequence._text : null,
      description: ad.InLine.Description._text,
      advertiser: ad.InLine.Advertiser ? ad.InLine.Advertiser._text : null,
      pricing: {
        value: ad.InLine.Pricing._text,
        currency: ad.InLine.Pricing._attributes
          ? ad.InLine.Pricing._attributes.currency
          : null,
        model: ad.InLine.Pricing._attributes
          ? ad.InLine.Pricing._attributes.model
          : null
      },
      survey: ad.InLine.Survey._text || ad.InLine.Survey._cdata,
      impressions: ad.InLine.Impression
        ? this.parseImpression(ad.InLine.Impression)
        : []
    }
    return [liner]
    // }
  }

  /**
   * Parse Creative
   * @param creativeInput
   * @returns {ICreative[]}
   */
  private parseCreative(creativeInput: any): ICreative[] {
    let creativeArray = creativeInput
    if (!Array.isArray(creativeInput)) {
      creativeArray = [creativeInput]
    }

    let creativeOutputArray: ICreative[] = []

    creativeArray.forEach((creative: any) => {
      const c: ICreative = {
        id: creative._attributes ? creative._attributes.id : null,
        adID: creative._attributes ? creative._attributes.AdID : null,
        sequence: creative._attributes ? creative._attributes.sequence : null,
        skipoffset: creative.Linear._attributes.skipoffset,
        trackings: this.parseTrackingEvents(
          creative.Linear.TrackingEvents.Tracking
        ),
        videoClicks: this.parseVideoClicks(creative.Linear.VideoClicks),
        extensions: creative.CreativeExtensions,
        mediaFiles: this.parseMediaFile(creative.Linear.MediaFiles.MediaFile),
        duration: creative.Linear.Duration._text,
        creativeType: CreativeType.linear
      }
      creativeOutputArray.push(c)
    })
    return creativeOutputArray
  }

  /**
   * Parse MediaFile
   * @param mediaFilesInput
   * @returns {IMediaFile[]}
   */
  private parseMediaFile(mediaFilesInput: any) {
    let mediaFilesArray = mediaFilesInput
    if (!Array.isArray(mediaFilesInput)) {
      mediaFilesArray = [mediaFilesInput]
    }

    let mediaFilesOutputArray: IMediaFile[] = []
    mediaFilesArray.forEach((file: any) => {
      const f: IMediaFile = {
        id: file._attributes ? file._attributes.id : null,
        height: file._attributes ? file._attributes.height : null,
        width: file._attributes ? file._attributes.width : null,
        delivery: file._attributes ? file._attributes.delivery : null,
        codec: file._attributes ? file._attributes.codec : null,
        mimetype: file._attributes ? file._attributes.type : null,
        apiFramework: file._attributes ? file._attributes.apiFramework : null,
        bitrate: file._attributes ? file._attributes.bitrate : null,
        minBitrate: file._attributes ? file._attributes.minBitrate : null,
        maxBitrate: file._attributes ? file._attributes.maxBitrate : null,
        scalable: file._attributes ? file._attributes.scalable : null,
        maintainAspectRatio: file._attributes
          ? file._attributes.maintainAspectRatio
          : null,
        uri: file._cdata
      }
      mediaFilesOutputArray.push(f)
    })

    return mediaFilesOutputArray
  }

  /**
   * Parse TrackingEvents
   * @param trackingInput
   * @returns {ITrackingEvent[]}
   */
  private parseTrackingEvents(trackingInput: any): ITrackingEvent[] {
    let trackingInputArray = trackingInput
    if (!Array.isArray(trackingInput)) {
      trackingInputArray = [trackingInput]
    }

    let trackingOutputArray: ITrackingEvent[] = []
    trackingInputArray.forEach((tracking: any) => {
      const f: ITrackingEvent = {
        uri: tracking._cdata,
        event: tracking._attributes ? tracking._attributes.event : null
      }
      trackingOutputArray.push(f)
    })

    return trackingOutputArray
  }

  /**
   * Parse VideoClicks
   * @param videoClickInput
   * @returns {IVideoClick}
   */
  private parseVideoClicks(videoClickInput: any): IVideoClick {
    const f: IVideoClick = {
      clickTrackings: [],
      clickThrough: { uri: '', id: '' }
    }
    if (videoClickInput.ClickThrough) {
      f.clickThrough = {
        uri: videoClickInput.ClickThrough._cdata,
        id: videoClickInput.ClickThrough._attributes
          ? videoClickInput.ClickThrough._attributes.id
          : null
      }
    }

    if (videoClickInput.clickTrackings) {
      let clickTracking = videoClickInput.clickTrackings
      if (!Array.isArray(videoClickInput.clickTrackings)) {
        clickTracking = [clickTracking]
      }
      f.clickTrackings = []
      clickTracking.forEach((c: any) => {
        if (f.clickTrackings)
          f.clickTrackings.push({
            uri: c._cdata,
            id: c._attributes ? c._attributes.id : null
          })
      })
    }

    if (videoClickInput.customClicks) {
      let customClicks = videoClickInput.customClicks
      if (!Array.isArray(videoClickInput.customClicks)) {
        customClicks = [customClicks]
      }
      f.customClicks = []
      customClicks.forEach((c: any) => {
        if (f.customClicks)
          f.customClicks.push({
            uri: c._cdata,
            id: c._attributes ? c._attributes.id : null
          })
      })
    }

    return f
  }

  /**
   * Parse Extensions
   * @param extensionsInput
   * @returns {IExtension[]}
   */
  private parseExtensions(extensionsInput: any): IExtension[] {
    let extensionsArray = extensionsInput
    if (!Array.isArray(extensionsInput)) {
      extensionsArray = [extensionsInput]
    }

    let extensionsOutputArray: IExtension[] = []
    extensionsArray.forEach((extension: any) => {
      const e: IExtension = {
        value: extension._text,
        extensionType: extension._attributes ? extension._attributes.type : null
      }
      extensionsOutputArray.push(e)
    })

    return extensionsOutputArray
  }

  /**
   * Parse Impressions
   * @param impressionInput
   * @returns {IAdImpression[]}
   */
  private parseImpression(impressionInput: any): IAdImpression[] {
    console.log(impressionInput._cdata)
    let impressionInputArray = impressionInput
    if (!Array.isArray(impressionInput)) {
      impressionInputArray = [impressionInput]
    }

    let impressionOutput: IAdImpression[] = []
    impressionInputArray.forEach((impression: any) => {
      impressionOutput.push({
        uri: impression._cdata
      })
    })

    return impressionOutput
  }
}

/**
 * export new Object of class
 */
export default new VMAPParser()
