/// <reference path="../../types/jwplayer.d.ts"/>

import JwPlayerPlugin from "./plugin";

console.debug("Init JwPlayer Vast Plugin.");
(function(jwplayer: JWPlayerStatic) {
    const Plugin = function(player: any, config: any, div: HTMLElement) {
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
})(jwplayer);