/// <reference path="../../types/jwplayer.d.ts"/>

import JwPlayerPlugin from "./plugin";

function JwPlayerPluginFn() {

    if (!jwplayer) return;

    const Plugin = function (player: any, config: any, div: HTMLElement) {
        const conf = player.getConfig();
        const plugin = new JwPlayerPlugin(jwplayer, conf.advertising, player, div);

        player.onReady(() => {
            // plugin.setup();
        });

        player.onPlay(() => {
            plugin.showStartLinearAd();
        });

        player.onPlaylistItem(() => {
            plugin.setup();
        });
        if (conf.advertising.debug) console.debug("Init JwPlayer Vast Plugin.");
    };

    const minPlayerVersion = "6.0";
    const pluginName = "vast";

    jwplayer("").registerPlugin(pluginName, minPlayerVersion, Plugin);
}

JwPlayerPluginFn();

export default JwPlayerPluginFn;

