// Type definitions for JW Player 6.0
// Project: http://developer.longtailvideo.com/trac/
// Definitions by: Martin Duparc <https://github.com/martinduparc/>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

// JW Player is the leading HTML5 & Flash video player, optimized for mobile and the desktop. Easy enough for beginners, advanced enough for pros.

interface Source {
    type: string;
    src: string;
}

interface PlayerOptions {
    techOrder?: string[];
    sourceOrder?: boolean;
    html5?: any;
    width?: number;
    height?: number;
    defaultVolume?: number;
    children?: string[];
    loop?: boolean;
    muted?: boolean;
    controls?: boolean;
    src?: string;
    autoplay?: boolean;
    preload?: string;
    sources?: Source[];
    aspectRatio?: string;
    fluid?: boolean;
    language?: string;
    notSupportedMessage?: string;
    plugins?: any;
}

interface Player {

    id: () => string;

    play(): Player;

    pause(): Player;

    paused(): boolean;

    src(newSource: string | Source | Source[]): Player;

    currentTime(seconds: number): Player;

    currentTime(): number;

    duration(): number;

    buffered(): TimeRanges;

    bufferedPercent(): number;

    volume(percentAsDecimal: number): TimeRanges;

    volume(): number;

    width(): number;

    width(pixels: number): Player;

    height(): number;

    height(pixels: number): Player;

    size(width: number, height: number): Player;

    requestFullScreen(): Player;

    cancelFullScreen(): Player;

    requestFullscreen(): Player;

    exitFullscreen(): Player;

    ready(callback: (this: Player) => void): Player;

    on(eventName: string, callback: (eventObject: Event) => void): void;

    off(eventName?: string, callback?: (eventObject: Event) => void): void;

    dispose(): void;

    addRemoteTextTrack(options: {}): HTMLTrackElement;

    removeRemoteTextTrack(track: HTMLTrackElement): void;

    poster(val?: string): string | Player;

    playbackRate(rate?: number): number;
}

interface VideojsPluginOption {
    requestUrl: string;
}


interface VideojsStatic {
    player: Player;
    getPlugin: (name: string) => any;

    plugin(name: string, fn: any) : void;
    registerPlugin(name: string, fn: any): void;
}


declare var videojs: VideojsStatic;

