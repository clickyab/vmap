export default class VideoPlayer {
  jwplayer: JWPlayerStatic
  player: any
  div: HTMLElement
  src: string
  lastSrc: string

  constructor(
    jwplayer: JWPlayerStatic,
    player: any,
    div: HTMLElement,
    src: string
  ) {
    console.debug('create new instance of video player.')
    this.jwplayer = jwplayer
    this.div = div
    this.player = player
    this.src = src
  }

  public play() {
    console.debug('play ad video player.')

    this.player.setControls(false)
    let video = this.getVideoElement()
    this.lastSrc = video.currentSrc
    this.player.stop()

    setTimeout(() => {
      video.setAttribute('src', this.src)
      video.pause()
      console.log(video.getAttribute('src'), { video })
      video.play()
    }, 1)
  }

  public pause() {
    console.debug('pause ad video player.')
    this.player.pause()
  }

  public skip(replay: boolean) {
    console.debug('skip ad video player.', this.lastSrc)
    let video = this.getVideoElement()

    video.setAttribute('src', this.lastSrc)
    this.player.setControls(true)

    if (replay) {
      video.pause()
      video.currentTime = 0.1
      video.play()
    }
  }

  private getVideoElement() {
    let videoContainer = this.player.getContainer()
    return videoContainer.getElementsByTagName('video')[0]
  }
}
