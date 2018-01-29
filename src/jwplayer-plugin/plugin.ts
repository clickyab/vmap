/// <reference path="../../types/jwplayer.d.ts"/>
import VMAPParser from './../vmapParser'
import { AdBreakType, IAdBreak, IVMAP } from '../definitions/VMAP'
import { Ad, mimetype } from '../definitions/VAST3'
import ImagePlayer from '../image-player/index'
import VideoPlayer from './videoPlayer'
import Controller from '../controller/index'

export default class JwPlayerPlugin {
  private jwPlayerIns: JWPlayerStatic
  private config: any
  private VMAP: IVMAP
  private player: any
  private div: HTMLElement
  private overlayController: Controller
  private videoPlayer: VideoPlayer | null
  private imagePlayer: ImagePlayer | null
  private adIsShowing: boolean = false
  private currentAdBreak: IAdBreak

  constructor(
    jwplayer: JWPlayerStatic,
    config: object,
    player: any,
    div: HTMLElement
  ) {
    // console.debug("Init JwPlayer Vast Plugin Class.");

    this.jwPlayerIns = jwplayer
    this.config = config
    this.player = player
    this.div = div
  }

  public setup() {
    // console.debug("Setting JwPlayer Vast Plugin up.");
    this.loadVMAP().then(vmap => {
      this.VMAP = vmap
      // console.log(vmap);
      this.player.onTime(this.timeController.bind(this))
      this.player.onComplete(() => {
        this.onVideoEnd(false)
      })
    })
  }

  private timeController(position: {
    duration: number
    position: number
    type: string
  }) {
    this.overlayController.setTimeLine(position)
  }

  private onVideoEnd(skipped?: any) {
    if (this.adIsShowing) {
      setTimeout(() => {
        this.adIsShowing = false
      }, 5000)
      this.overlayController.remove()

      if (this.currentAdBreak.timeOffset === 'start') {
        if (!!this.videoPlayer) {
          this.videoPlayer.skip(true)
          this.videoPlayer = null
        } else if (!!this.imagePlayer) {
          this.player.play()
          this.imagePlayer.stop()
          this.imagePlayer = null
        }
      } else if (this.currentAdBreak.timeOffset === 'end') {
      }
    } else if (skipped === false) {
      this.showEndLinerAd()
    }
  }

  public showStartLinerAd() {
    console.debug('show start liner ad')
    let skipShowAd = false

    if (this.player.getPosition() >= 0.1) return

    this.VMAP.breaks.forEach(adBreak => {
      if (
        adBreak.breakTypes[0] === AdBreakType.linear &&
        adBreak.timeOffset === 'start' &&
        !skipShowAd
      ) {
        this.showAd(adBreak)
        skipShowAd = true
      }
    })
  }

  private showEndLinerAd() {
    let skipShowAd = false

    this.VMAP.breaks.forEach(adBreak => {
      if (
        adBreak.breakTypes[0] === AdBreakType.linear &&
        adBreak.timeOffset === 'end' &&
        !skipShowAd
      ) {
        this.showAd(adBreak)
        skipShowAd = true
      }
    })
  }

  private loadVMAP(url: string = this.config.tag): Promise<IVMAP> {
    // console.debug(`Try to load JwPlayer VMAP from ${url}`);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          let VMAP = VMAPParser.JSON(xhr.responseText)
          // console.debug(`VMAP loaded:`, VMAP);
          resolve(VMAP)
        }
      }

      xhr.onerror = error => {
        reject()
        throw (new Error(`Failed to load JwPlayer VMAP from ${url}`), error)
      }

      xhr.open('GET', url)
      xhr.send()
    })
  }

  private showAd(adBreak: IAdBreak) {
    if (this.adIsShowing) return
    this.adIsShowing = true

    // console.debug("show ad break", adBreak);
    switch (adBreak.breakTypes[0]) {
      case AdBreakType.linear:
        const mediaFile =
          adBreak.adSource.VASTAdData.ads[0].creative[0].mediaFiles[0]
        switch (mediaFile.mimetype) {
          case mimetype.IMAGE_GIF:
          case mimetype.IMAGE_JPEG:
          case mimetype.IMAGE_PNG:
            this.showImagePlayer(adBreak.adSource.VASTAdData.ads[0], adBreak)
            break

          case mimetype.VIDEO_MP4:
            this.showVideoPlayer(adBreak.adSource.VASTAdData.ads[0], adBreak)
            break

          default:
            throw new Error(
              `Media file type "${mediaFile.mimetype}" is not support.`
            )
        }
        break

      default:
        throw new Error(
          `AdBreak type "${this.VMAP.breaks[0].breakTypes[0]}" is not support.`
        )
    }

    this.currentAdBreak = adBreak
  }

  private showImagePlayer(ad: Ad, adBreak: IAdBreak) {
    let clickThroughUri = ad.creative[0].videoClicks.clickThrough.uri
    let domainEx = adBreak.extensions
      ? adBreak.extensions.findIndex(e => e.extensionType === 'domain')
      : -1
    this.imagePlayer = new ImagePlayer(
      this.div,
      ad.creative[0].mediaFiles[0].uri,
      {}
    )
    this.imagePlayer.play()
    this.player.stop()

    this.overlayController = new Controller(
      this.jwPlayerIns,
      this.player,
      this.div,
      domainEx > -1 && adBreak.extensions
        ? adBreak.extensions[domainEx].value.toString()
        : '',
      clickThroughUri
    )

    this.overlayController.setOnSkip(() => {
      if (this.imagePlayer) this.imagePlayer.stop()
      this.onVideoEnd(true)
    })

    setTimeout(() => {
      if (this.imagePlayer) this.imagePlayer.stop()
      this.onVideoEnd(true)
    }, 5000)

    this.overlayController.show()
  }

  private showVideoPlayer(ad: Ad, adBreak: IAdBreak) {
    // console.debug("show video ad", ad);
    let clickThroughUri = ad.creative[0].videoClicks.clickThrough.uri
    let domainEx = adBreak.extensions
      ? adBreak.extensions.findIndex(e => e.extensionType === 'domain')
      : -1

    this.videoPlayer = new VideoPlayer(
      this.jwPlayerIns,
      this.player,
      this.div,
      ad.creative[0].mediaFiles[0].uri
    )

    this.overlayController = new Controller(
      this.jwPlayerIns,
      this.player,
      this.div,
      domainEx > -1 && adBreak.extensions
        ? adBreak.extensions[domainEx].value.toString()
        : '',
      clickThroughUri
    )

    this.overlayController.setOnSkip(() => {
      this.onVideoEnd(true)
    })

    this.videoPlayer.play()
    this.overlayController.show()
  }
}
