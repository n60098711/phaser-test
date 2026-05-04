import { Game } from "phaser";
import { Preloader } from "./preloader";
import { MainScene } from "./scenes/MainScene";
import { SplashScene } from "./scenes/SplashScene";
import { SpinePlugin } from "@esotericsoftware/spine-phaser";
import * as Phaser from 'phaser';

const config = {
    type: Phaser.AUTO,
    parent: "phaser-container",
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: "black",
    pixelArt: true,
    roundPixel: false,
    max: {
        width: window.innerWidth,
        height: window.innerHeight,
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 }
        }
    },
    plugins: {
        scene: [
            { key: "spine.SpinePlugin", plugin: SpinePlugin, mapping: "spine" }
        ]
    },
    scene: [
        Preloader,
        SplashScene,
        MainScene,
    ]
};

new Game(config);