import CONFIG from './../config'

export default class Controller {
  private jwplayer: JWPlayerStatic
  private player: any
  private div: HTMLElement
  private title: string
  private src: string
  private skipCountDown: HTMLElement
  private playerTimeLine: HTMLElement
  private onOpenAdClick: () => void
  private onEnd: () => void
  private onSkip: () => void
  private overlay: HTMLElement
  private isMobile = window.navigator.userAgent.match(
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  )
  private clickEvent = this.isMobile ? 'touchstart' : 'click'
  private linkWrapper: boolean = false

  constructor(
    jwplayer: JWPlayerStatic,
    player: any,
    div: HTMLElement,
    title: string,
    src: string,
    linkWrapper: boolean = false
  ) {
    console.debug('Create controller overlay instance.')
    this.jwplayer = jwplayer
    this.div = div
    this.player = player
    this.title = title
    this.src = src
    this.linkWrapper = linkWrapper
  }

  public show() {
    console.debug('Show controller overlay.')
    this.setTimeLine({ position: 0, duration: 0, type: 'start' })
    this.overlay = this.getWrapperElement()
    this.div.appendChild(this.overlay)
  }

  public remove() {
    console.debug('Remove controller overlay element.')
    if (this.div) {
      this.div.style = ''
    }
    this.overlay.remove()
  }

  public setOnSkip(fn: () => void) {
    this.onSkip = fn
  }

  public setOnEnd(fn: () => void) {
    this.onEnd = fn
  }

  public setOnAdClick(fn: () => void) {
    this.onOpenAdClick = fn
  }

  private getWrapperElement(): HTMLElement {
    let wrapper
    if (this.linkWrapper) {
      wrapper = document.createElement('a')
      wrapper.href = this.src
      wrapper.target = 'blank'
    } else {
      wrapper = document.createElement('div')
    }

    wrapper.onclick = () => {
      if (this.player.getState() === 'playing') {
        this.player.pause()
      } else {
        this.player.play()
      }
    }

    this.div.style.position = 'absolute'
    this.div.style.top = '0px'
    this.div.style.bottom = '0px'
    this.div.style.left = '0px'
    this.div.style.right = '0px'
    this.div.style.zIndex = '100'

    wrapper.id = 'vmap-image-wrapper'
    wrapper.style.position = 'absolute'
    wrapper.style.top = '0px'
    wrapper.style.bottom = '0px'
    wrapper.style.left = '0px'
    wrapper.style.right = '0px'

    wrapper.appendChild(this.getAdLink(this.title))
    wrapper.appendChild(this.getFullScreenButton())
    wrapper.appendChild(this.getSkipAd())
    wrapper.appendChild(this.getPauseButton())
    wrapper.appendChild(this.getProviderClick())
    wrapper.appendChild(this.getTimeLineWrapper())
    return wrapper
  }

  public setTimeLine(position: {
    duration: number
    position: number
    type: string
  }) {
    // console.debug("set time position.", position);
    let jack = position.position / position.duration * 100
    if (this.playerTimeLine) this.playerTimeLine.style.width = jack + '%'

    const remaining = this.formatDuration(
      position.duration - position.position + 1
    )
    if (this.skipCountDown)
      this.skipCountDown.innerText = `${remaining} ${CONFIG.REMAINING_TEXT}`
  }

  private getSkipElement(): HTMLElement {
    let skipElement = document.createElement('span')
    this.skipCountDown = skipElement
    return this.skipCountDown
  }

  private getTimeLineElement(): HTMLElement {
    let playerTimeLine = document.createElement('div')
    playerTimeLine.style.height = '4px'
    playerTimeLine.style.position = 'absolute'
    playerTimeLine.style.backgroundColor = 'rgba(238, 187, 59, 1)'
    playerTimeLine.style.zIndex = '999999'
    playerTimeLine.style.borderRadius = '4px'
    this.playerTimeLine = playerTimeLine
    return playerTimeLine
  }

  private getPauseButton(): HTMLElement {
    let pauseBtn = document.createElement('div')
    pauseBtn.innerHTML = `<svg width="15px" height="16px" viewBox="0 0 15 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n +
          <!-- Generator: Sketch 44.1 (41455) - http://www.bohemiancoding.com/sketch -->\n +
          <title>pause</title>\n +
          <desc>Created with Sketch.</desc>\n +
          <defs></defs>\n +
          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n +
              <g id="Artboard" transform="translate(-33.000000, -33.000000)" fill-rule="nonzero" fill="#FAFAFA">\n +
                  <path d="M33,33 L39,33 L39,49 L33,49 L33,33 Z M41.3266667,33 L47.3266667,33 L47.3266667,49 L41.3266667,49 L41.3266667,33 Z" id="pause"></path>\n +
              </g>\n +
          </g>\n +
      </svg>`
    pauseBtn.style.fontSize = this.isMobile ? '13px' : '13px'
    pauseBtn.style.padding = this.isMobile ? '3px 5px' : '3px 5px'
    pauseBtn.style.textDecoration = 'none'
    pauseBtn.style.display = 'block'
    pauseBtn.style.position = 'absolute'
    pauseBtn.style.left = '10px'
    pauseBtn.style.bottom = '0px'
    pauseBtn.style.textAlign = 'center'
    pauseBtn.style.direction = 'rtl'
    pauseBtn.style.color = 'rgb(255, 255, 255)'
    pauseBtn.style.fontFamily = 'Tahoma, Arial, Helvetica, sans-serif'
    pauseBtn.style.zIndex = '214783647'
    pauseBtn.style.marginRight = '0px'
    pauseBtn.style.boxShadow = '0px'
    pauseBtn.onclick = e => {
      this.player.pause()
    }

    return pauseBtn
  }

  private getFullScreenButton(): HTMLElement {
    let fullScreenBtn = document.createElement('div')
    fullScreenBtn.innerHTML = `<svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n +
          <!-- Generator: Sketch 44.1 (41455) - http://www.bohemiancoding.com/sketch -->\n +
          <title>fullscreen</title>\n +
          <desc>Created with Sketch.</desc>\n +
          <defs></defs>\n +
          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n +
              <g id="Artboard" transform="translate(-33.000000, -265.000000)" fill-rule="nonzero" fill="#FAFAFA">\n +
                  <path d="M33,275.666667 L38.3333333,275.666667 L38.3333333,281 L33,281 L33,275.666667 Z M49,265 L49,281 L41,281 L41,278.333333 L46.3333333,278.333333 L46.3333333,267.666667 L35.6666667,267.666667 L35.6666667,273 L33,273 L33,265 L49,265 Z" id="fullscreen"></path>\n +
              </g>\n +
          </g>\n +
      </svg>`
    fullScreenBtn.style.fontSize = this.isMobile ? '13px' : '13px'
    fullScreenBtn.style.padding = this.isMobile ? '3px 5px' : '3px 5px'
    fullScreenBtn.style.textDecoration = 'none'
    fullScreenBtn.style.display = 'block'
    fullScreenBtn.style.position = 'absolute'
    fullScreenBtn.style.right = '10px'
    fullScreenBtn.style.bottom = '0px'
    fullScreenBtn.style.textAlign = 'center'
    fullScreenBtn.style.direction = 'rtl'
    fullScreenBtn.style.color = 'rgb(255, 255, 255)'
    fullScreenBtn.style.fontFamily = 'Tahoma, Arial, Helvetica, sans-serif'
    fullScreenBtn.style.zIndex = '214783647'
    fullScreenBtn.style.marginRight = '0px'
    fullScreenBtn.style.boxShadow = '0px'

    fullScreenBtn.onclick = () => {
      this.player.setFullscreen(!this.player.getFullscreen())
    }

    return fullScreenBtn
  }

  private getProviderClick(): HTMLElement {
    let providerLink = document.createElement('div')
    providerLink.innerHTML = `<a style="position: relative; top: 2px" target="_blank" href="${
      CONFIG.PROVIDE_LINK
    }" alt="${CONFIG.PROVIDE_NAME}">
      <svg width="14px" height="14px" viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="Artboard" transform="translate(-885.000000, -64.000000)" fill-rule="nonzero" fill="#FFFFFF">
                  <path d="M892,64 C888.134007,64 885,67.1340068 885,71 C885,74.8659932 888.134007,78 892,78 C895.865993,78 899,74.8659932 899,71 C899,69.1434846 898.262502,67.3630072 896.949747,66.0502525 C895.636993,64.7374979 893.856515,64 892,64 Z M892.875,74.71875 L891.125,74.71875 L891.125,70.34375 L892.875,70.34375 L892.875,74.71875 Z M892.875,69.03125 L891.125,69.03125 L891.125,67.28125 L892.875,67.28125 L892.875,69.03125 Z" id="info"></path>
              </g>
          </g>
      </svg>
    </a>`
    providerLink.appendChild(this.getSkipElement())
    providerLink.style.fontSize = this.isMobile ? '13px' : '13px'
    providerLink.style.padding = this.isMobile ? '3px 5px' : '3px 5px'
    providerLink.style.textDecoration = 'none'
    providerLink.style.display = 'block'
    providerLink.style.position = 'absolute'
    providerLink.style.right = '10px'
    providerLink.style.bottom = '45px'
    providerLink.style.textAlign = 'center'
    providerLink.style.direction = 'rtl'
    providerLink.style.color = 'rgb(255, 255, 255)'
    providerLink.style.fontFamily = 'Tahoma, Arial, Helvetica, sans-serif'
    providerLink.style.zIndex = '214783647'
    providerLink.style.marginRight = '0px'
    providerLink.style.boxShadow = '0px'
    providerLink.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'
    providerLink.onclick = () => {
      if (this.player.getState() == 'playing') {
        this.player.pause()
      }
    }

    return providerLink
  }

  private getAdLink(title: string): HTMLElement {
    let adLink = document.createElement('a')
    adLink.href = this.src
    adLink.target = '_blank'
    adLink.innerHTML =
      `<span style="margin-left: 3px"><svg width="12px" height="12px" viewBox="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <title>external link</title>
          <desc>Created with Sketch.</desc>
          <defs></defs>
          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="Artboard" transform="translate(-886.000000, -95.000000)" fill-rule="nonzero" fill="#FFFFFF">
                  <path d="M897.397841,95 C897.704317,95 897.952696,95.2483788 897.952696,95.5548548 L897.952696,99.3770099 C897.952696,99.6834858 897.704317,99.9318646 897.397841,99.9318646 C897.091365,99.9318646 896.842987,99.6834858 896.842987,99.3770099 L896.842987,96.9558497 L891.459403,102.339566 C891.35107,102.447899 891.209025,102.502132 891.067114,102.502132 C890.925202,102.502132 890.783157,102.447899 890.674825,102.339566 C890.458026,102.122901 890.458026,101.77152 890.674825,101.554855 L896.11997,96.1097095 L893.575553,96.1097095 C893.269077,96.1097095 893.020698,95.8613307 893.020698,95.5548548 C893.020698,95.2483788 893.269077,95 893.575553,95 L897.397841,95 Z M895.478636,100.58799 C895.785111,100.58799 896.03349,100.836502 896.03349,101.142844 L896.03349,105.520387 C896.03349,106.33628 895.36977,107 894.553878,107 L887.479613,107 C886.66372,107 886,106.33628 886,105.520387 L886,98.4461224 C886,97.6302301 886.66372,96.9665097 887.479613,96.9665097 L891.872613,96.9665097 C892.179089,96.9665097 892.427467,97.2148885 892.427467,97.5213645 C892.427467,97.8278405 892.179089,98.0762192 891.872613,98.0762192 L887.479613,98.0762192 C887.279071,98.0762192 887.10971,98.2455805 887.10971,98.4461224 L887.10971,105.520387 C887.10971,105.720929 887.279071,105.89029 887.479613,105.89029 L894.553878,105.89029 C894.754419,105.89029 894.923781,105.720929 894.923781,105.520387 L894.923781,101.142844 C894.923781,100.836368 895.17216,100.58799 895.478636,100.58799 Z" id="external-link"></path>
              </g>
          </g>
      </svg></span>` + (title ? title : CONFIG.DEFAULT_AD_TEXT)
    adLink.style.fontSize = this.isMobile ? '13px' : '14px'
    adLink.style.padding = '3px 5px'
    adLink.style.textDecoration = 'none'
    adLink.style.display = 'block'
    adLink.style.position = 'absolute'
    adLink.style.right = '10px'
    adLink.style.bottom = '75px'
    adLink.style.textAlign = 'center'
    adLink.style.direction = 'rtl'
    adLink.style.color = 'rgb(255, 255, 255)'
    adLink.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'
    adLink.style.fontFamily = 'Tahoma, Arial, Helvetica, sans-serif'
    adLink.style.zIndex = '1999999'
    adLink.style.cursor = 'pointer'
    adLink.style.marginRight = '0px'
    adLink.style.boxShadow = '0px'

    adLink.onclick = () => {
      if (this.onOpenAdClick) this.onOpenAdClick()
    }

    return adLink
  }

  private getSkipAd(): HTMLElement {
    var skipBtn = document.createElement('div')

    skipBtn.style.fontSize = this.isMobile ? '13px' : '13px'
    skipBtn.style.padding = this.isMobile
      ? '7px 25px 8px 25px'
      : '7px 25px 8px 25px'
    skipBtn.style.textDecoration = 'none'
    skipBtn.style.display = 'block'
    skipBtn.style.position = 'absolute'
    skipBtn.style.left = '-1px'
    skipBtn.style.bottom = this.isMobile ? '50px' : '50px'
    skipBtn.style.textAlign = 'center'
    skipBtn.style.direction = 'rtl'
    skipBtn.style.color = 'rgba(255, 255, 255,1)'
    skipBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'
    skipBtn.style.fontFamily = 'Tahoma, Arial, Helvetica, sans-serif'
    skipBtn.style.zIndex = '1999999'
    skipBtn.style.cursor = 'pointer'
    skipBtn.style.marginRight = '0px'
    skipBtn.style.marginRight = '0px'
    skipBtn.style.border = '1px solid rgba(255,255,255, 0.20)'
    skipBtn.innerText = CONFIG.SKIP_TEXT

    skipBtn.onclick = () => {
      console.debug('skip ad.')
      if (this.onSkip) this.onSkip()
    }

    return skipBtn
  }

  private getTimeLineWrapper(): HTMLElement {
    let timeLineWrapper = document.createElement('div')
    timeLineWrapper.style.width = '96%'
    timeLineWrapper.style.margin = '2%'
    timeLineWrapper.style.bottom = '20px'
    timeLineWrapper.style.position = 'absolute'
    timeLineWrapper.style.height = '4px'
    timeLineWrapper.style.borderRadius = '4px'
    timeLineWrapper.style.backgroundColor = 'rgba(255, 255, 255, 0.4)'
    timeLineWrapper.appendChild(this.getTimeLineElement())

    return timeLineWrapper
  }

  private formatDuration(number: number): string {
    let sec_num = parseInt(number.toString(), 10).toString()
    let hours = Math.floor(parseInt(sec_num) / 3600).toString()
    let minutes = Math.floor(
      (parseInt(sec_num) - parseInt(hours) * 3600) / 60
    ).toString()
    let seconds = (
      parseInt(sec_num) -
      parseInt(hours) * 3600 -
      parseInt(minutes) * 60
    ).toString()

    if (parseInt(hours) < 10) {
      hours = '0' + hours
    }
    if (parseInt(minutes) < 10) {
      minutes = '0' + minutes
    }
    if (parseInt(seconds) < 10) {
      seconds = '0' + seconds
    }
    return minutes + ':' + seconds
  }
}
