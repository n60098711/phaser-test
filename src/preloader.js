import * as Phaser from 'phaser';

// Class to preload all the assets
// Remember you can load this assets in another scene if you need it
export class Preloader extends Phaser.Scene {
    constructor() {
        super({ key: "Preloader" });
    }

    preload() {
        // --- Звичайні асети під префіксом "assets/" ---
        this.load.setPath("assets");
        this.load.image("logo", "logo.png");
        this.load.image("floor");
        this.load.image("background", "background.png");

        this.load.image("grid", "gridMain/grid.png");
        this.load.image("grid-border", "gridMain/gridBorder.png");

        this.load.atlas("ui", "ui/interface.webp", "ui/interface.json");

        this.load.atlas("staticSymbols", "staticSymbols/staticSymbols.webp", "staticSymbols/staticSymbols.json");
        this.load.atlas("blurredSymbols", "blurredSymbols/blurredSymbols.webp", "blurredSymbols/blurredSymbols.json");

        // Fonts
        this.load.bitmapFont("pixelfont", "fonts/pixelfont.png", "fonts/pixelfont.xml");
        this.load.image("knighthawks", "fonts/knight3.png");

        this.load.setPath("");

        const symbolKeys = ["blank", "C",
            "H1", "H2",
            "J1", "J2", "J3",
            "L1", "L2", "L3", "L4", "L5",
            "M", "M1", "M2", "M3", "M4",
            "W"];

        symbolKeys.forEach((key) => {
            this.load.spineJson(`spine_${key}_data`, `assets/spines/symbols/${key}/${key}.json`);
            this.load.spineAtlas(`spine_${key}_atlas`, `assets/spines/symbols/${key}/${key}.atlas`, false);
        });

        // Event to update the loading bar
        this.load.on("progress", (progress) => {
            console.log("Loading: " + Math.round(progress * 100) + "%");
        });
    }

    create() {
        // Create bitmap font and load it in cache
        const config = {
            image: 'knighthawks',
            width: 31,
            height: 25,
            chars: Phaser.GameObjects.RetroFont.TEXT_SET6,
            charsPerRow: 10,
            spacing: { x: 1, y: 1 }
        };
        this.cache.bitmapFont.add('knighthawks', Phaser.GameObjects.RetroFont.Parse(this, config));

        // When all the assets are loaded go to the next scene
        this.scene.start("SplashScene");
    }
}
