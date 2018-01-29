export default interface PlayerInterface {
  jwplayer: JWPlayerStatic
  player: any
  div: HTMLElement
  src: string

  play: () => void
  pause: () => void
  stop: () => void
}
