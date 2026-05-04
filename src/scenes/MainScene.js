import { Scene } from "phaser";
import { getRandomSpin } from "../data/mockSpins";

const STATIC_FRAMES = [
    "staticC",
    "staticH1", "staticH2",
    "staticJ1", "staticJ2", "staticJ3",
    "staticL1", "staticL2", "staticL3", "staticL4", "staticL5",
    "staticM", "staticM1", "staticM2", "staticM3", "staticM4",
    "staticW"
];

const BLUR_FRAMES = [
    "blurredC",
    "blurredH1", "blurredH2",
    "blurredJ1", "blurredJ2", "blurredJ3",
    "blurredL1", "blurredL2", "blurredL3", "blurredL4", "blurredL5",
    "blurredM", "blurredM1", "blurredM2", "blurredM3", "blurredM4",
    "blurredW"
];

const COLS = 5;
const ROWS = 3;
const GRID_SCALE = 1.5;
const CELL_W = 196 * GRID_SCALE;
const CELL_H = 208 * GRID_SCALE;
const SYMBOL_SCALE = 1.4;

const DROP_DURATION = 520;
const BLUR_START_DELAY = 270;
const REEL_SPEED = 34;
const TICK_MS = 16;
const BASE_BLUR_MS = 1200;
const COL_STOP_OFFSET = 220;

const DEPTH_BG = 0;
const DEPTH_GRID = 1;
const DEPTH_SYMBOLS = 2;
const DEPTH_BORDER = 3;
const DEPTH_UI = 4;

export class MainScene extends Scene {
    constructor() {
        super("MainScene");
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }

    create() {
        const bg = this.add.image(this.scale.width / 2, this.scale.height / 2, "background");
        bg.setScale(1.5).setDepth(DEPTH_BG);

        const grid = this.add.image(this.scale.width / 2, this.scale.height / 2, "grid");
        grid.setScale(1.5).setDepth(DEPTH_GRID);

        const grid_border = this.add.image(this.scale.width / 2, this.scale.height / 2, "grid-border");
        grid_border.setScale(1.5).setDepth(DEPTH_BORDER);

        this.winText = this.add.bitmapText(this.scale.width / 2, 120, "knighthawks", "WIN: 0", 72)
            .setOrigin(0.5)
            .setTint(0xffd700)
            .setDepth(DEPTH_UI);

        this.startX = this.scale.width / 2 - ((COLS - 1) * CELL_W) / 2;
        this.startY = this.scale.height / 2 - ((ROWS - 1) * CELL_H) / 2;

        this.gridLeft = this.startX - CELL_W / 2;
        this.gridTop = this.startY - CELL_H / 2;
        this.gridWidth = COLS * CELL_W;
        this.gridHeight = ROWS * CELL_H;
        this.gridBottom = this.gridTop + this.gridHeight;

        const maskShape = this.make.graphics({ add: false });
        maskShape.fillStyle(0xffffff);
        maskShape.fillRect(this.gridLeft, this.gridTop, this.gridWidth, this.gridHeight);
        this.gridMask = maskShape.createGeometryMask();

        this.spinning = false;

        this.createRandomSymbolsGrid();

        const btn_start = this.add.image(this.scale.width - 250, this.scale.height / 2, "ui", "spinPlayDefault");
        btn_start.setDepth(DEPTH_UI);
        btn_start.setInteractive({ useHandCursor: true });
        btn_start.on("pointerover", () => btn_start.setFrame("spinPlayHover"));
        btn_start.on("pointerout",  () => btn_start.setFrame("spinPlayDefault"));
        btn_start.on("pointerdown", () => btn_start.setFrame("spinPlayPressed"));
        btn_start.on("pointerup", () => {
            btn_start.setFrame("spinPlayHover");
            this.spin();
        });
    }

    createRandomSymbolsGrid() {
        this.symbolsGrid = [];
        for (let row = 0; row < ROWS; row++) {
            this.symbolsGrid[row] = [];
            for (let col = 0; col < COLS; col++) {
                const frame = STATIC_FRAMES[Math.floor(Math.random() * STATIC_FRAMES.length)];
                this.symbolsGrid[row][col] = this.spawnSymbol(row, col, frame);
            }
        }
    }

    spawnSymbol(row, col, frameKey) {
        const x = this.startX + col * CELL_W;
        const y = this.startY + row * CELL_H;
        const sp = this.add.image(x, y, "staticSymbols", frameKey)
            .setScale(SYMBOL_SCALE)
            .setDepth(DEPTH_SYMBOLS);
        sp.setMask(this.gridMask);
        sp.frameKey = frameKey;
        return sp;
    }

    spin() {
        if (this.spinning) return;
        this.spinning = true;

        const result = getRandomSpin();
        this.winText.setText("WIN: 0");

        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const oldSp = this.symbolsGrid[row][col];
                if (!oldSp) continue;
                this.tweens.add({
                    targets: oldSp,
                    y: this.gridBottom + CELL_H,
                    duration: DROP_DURATION,
                    ease: "Sine.easeInOut",
                    onComplete: () => oldSp.destroy()
                });
            }
        }

        this.symbolsGrid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
        this.time.delayedCall(BLUR_START_DELAY, () => {
            this.startBlurReels(result);
        });
    }

    randomBlurFrame() {
        return BLUR_FRAMES[Math.floor(Math.random() * BLUR_FRAMES.length)];
    }

    startBlurReels(result) {
        const stackSize = ROWS + 2;
        const reels = [];

        for (let col = 0; col < COLS; col++) {
            const reel = [];
            const x = this.startX + col * CELL_W;
            for (let i = 0; i < stackSize; i++) {
                const y = this.startY + (i - 1) * CELL_H;
                const img = this.add.image(x, y, "blurredSymbols", this.randomBlurFrame())
                    .setScale(SYMBOL_SCALE)
                    .setDepth(DEPTH_SYMBOLS)
                    .setMask(this.gridMask);
                reel.push(img);
            }
            reels.push(reel);
        }

        const tickers = reels.map((reel) =>
            this.time.addEvent({
                delay: TICK_MS,
                loop: true,
                callback: () => this.scrollReel(reel)
            })
        );

        for (let col = 0; col < COLS; col++) {
            const stopAt = BASE_BLUR_MS + col * COL_STOP_OFFSET;
            this.time.delayedCall(stopAt, () => {
                tickers[col].remove();
                reels[col].forEach((img) => img.destroy());
                this.revealColumn(col, result);

                if (col === COLS - 1) {
                    this.finishSpin(result);
                }
            });
        }
    }

    scrollReel(reel) {
        for (const img of reel) {
            img.y += REEL_SPEED;
        }

        let top = reel[0];
        let bottom = reel[0];
        for (const img of reel) {
            if (img.y < top.y) top = img;
            if (img.y > bottom.y) bottom = img;
        }
        if (bottom.y - CELL_H / 2 > this.gridBottom) {
            bottom.y = top.y - CELL_H;
            bottom.setFrame(this.randomBlurFrame());
        }
    }

    revealColumn(col, result) {
        for (let row = 0; row < ROWS; row++) {
            const frame = result.grid[row][col];
            const sp = this.spawnSymbol(row, col, frame);
            this.symbolsGrid[row][col] = sp;

            const targetY = sp.y;
            sp.y = targetY - CELL_H;
            this.tweens.add({
                targets: sp,
                y: targetY,
                duration: 280,
                ease: "Sine.easeOut"
            });
        }
    }

    finishSpin(result) {
        this.winText.setText(`WIN: ${result.win}`);
        if (result.win > 0) {
            this.time.delayedCall(400, () => this.playWinPulse());
        }
        this.spinning = false;
    }

    playWinPulse() {
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const sp = this.symbolsGrid[row][col];
                if (!sp) continue;
                this.tweens.add({
                    targets: sp,
                    scale: SYMBOL_SCALE * 1.,
                    duration: 250,
                    yoyo: true,
                    repeat: 1,
                    ease: "Sine.easeInOut",
                    delay: (row * COLS + col) * 40
                });
            }
        }
    }
}
