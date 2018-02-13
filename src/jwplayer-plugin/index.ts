/// <reference path="../../types/jwplayer.d.ts"/>

import JwPlayerPlugin from "./plugin";

function JwPlayerPluginFn() {
    console.debug("Init JwPlayer Vast Plugin.");

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
    };

    const minPlayerVersion = "6.0";
    const pluginName = "vmap";

    jwplayer("").registerPlugin(pluginName, minPlayerVersion, Plugin);
}

JwPlayerPluginFn();

export default JwPlayerPluginFn;

