// Замокані результати спінів для слот-машини 5x3.
// Кожен запис містить розкладку символів (3 ряди × 5 колонок) і суму виграшу.
// Для додавання нових результатів просто допиши новий обʼєкт у масив.

export const SYMBOLS = [
    "staticC",
    "staticH1", "staticH2",
    "staticJ1", "staticJ2", "staticJ3",
    "staticL1", "staticL2", "staticL3", "staticL4", "staticL5",
    "staticM",  "staticM1", "staticM2", "staticM3", "staticM4",
    "staticW",
    "staticBlank"
];

export const mockSpins = [
    // --- Програш: жодних співпадінь ---
    {
        id: "spin-001",
        grid: [
            ["staticH1", "staticL1", "staticM",  "staticC",  "staticJ1"],
            ["staticL2", "staticH2", "staticM2", "staticL3", "staticH1"],
            ["staticJ2", "staticL4", "staticH2", "staticM3", "staticL5"]
        ],
        win: 0
    },

    // --- Малий виграш: 3 однакових символи в ряд (low pay) ---
    {
        id: "spin-002",
        grid: [
            ["staticL1", "staticL1", "staticL1", "staticC",  "staticJ1"],
            ["staticH2", "staticM2", "staticL3", "staticH1", "staticJ2"],
            ["staticL4", "staticH2", "staticM3", "staticL5", "staticC"]
        ],
        win: 25
    },

    // --- Малий виграш: 3 J у середньому ряді ---
    {
        id: "spin-003",
        grid: [
            ["staticH1", "staticL1", "staticM",  "staticC",  "staticH2"],
            ["staticJ1", "staticJ2", "staticJ3", "staticL3", "staticH1"],
            ["staticL2", "staticL4", "staticH2", "staticM3", "staticL5"]
        ],
        win: 40
    },

    // --- Середній виграш: 4 H в ряд ---
    {
        id: "spin-004",
        grid: [
            ["staticH1", "staticH2", "staticH1", "staticH2", "staticC"],
            ["staticL2", "staticM2", "staticL3", "staticJ1", "staticL5"],
            ["staticJ2", "staticL4", "staticM3", "staticL1", "staticH1"]
        ],
        win: 120
    },

    // --- Середній виграш: 4 M у ряд (medium pay) ---
    {
        id: "spin-005",
        grid: [
            ["staticL1", "staticH1", "staticJ1", "staticC",  "staticH2"],
            ["staticM",  "staticM1", "staticM2", "staticM3", "staticL3"],
            ["staticJ2", "staticL4", "staticH2", "staticL5", "staticC"]
        ],
        win: 200
    },

    // --- Великий виграш: 5 в ряд (low symbol) ---
    {
        id: "spin-006",
        grid: [
            ["staticH1", "staticC",  "staticJ1", "staticM",  "staticH2"],
            ["staticL1", "staticL2", "staticL3", "staticL4", "staticL5"],
            ["staticJ2", "staticH2", "staticM3", "staticC",  "staticL1"]
        ],
        win: 350
    },

    // --- Великий виграш: 5 H ---
    {
        id: "spin-007",
        grid: [
            ["staticH1", "staticH2", "staticH1", "staticH2", "staticH1"],
            ["staticL2", "staticM2", "staticL3", "staticJ1", "staticC"],
            ["staticJ2", "staticL4", "staticM3", "staticL1", "staticL5"]
        ],
        win: 750
    },

    // --- Джекпот: 5 W (Wild) ---
    {
        id: "spin-008",
        grid: [
            ["staticW",  "staticW",  "staticW",  "staticW",  "staticW"],
            ["staticL2", "staticH2", "staticM2", "staticL3", "staticH1"],
            ["staticJ2", "staticL4", "staticH2", "staticM3", "staticL5"]
        ],
        win: 5000
    },

    // --- Виграш по діагоналі (3 C) ---
    {
        id: "spin-009",
        grid: [
            ["staticC",  "staticL1", "staticM",  "staticH1", "staticJ1"],
            ["staticL2", "staticC",  "staticM2", "staticL3", "staticH2"],
            ["staticJ2", "staticL4", "staticC",  "staticM3", "staticL5"]
        ],
        win: 80
    },

    // --- Wild замінює символ: 3 H + 1 W ---
    {
        id: "spin-010",
        grid: [
            ["staticH1", "staticW",  "staticH2", "staticH1", "staticC"],
            ["staticL2", "staticM2", "staticL3", "staticJ1", "staticL5"],
            ["staticJ2", "staticL4", "staticM3", "staticL1", "staticC"]
        ],
        win: 180
    },

    // --- Програш ---
    {
        id: "spin-011",
        grid: [
            ["staticC",  "staticH1", "staticL1", "staticJ1", "staticM"],
            ["staticH2", "staticL2", "staticJ2", "staticM2", "staticL3"],
            ["staticL4", "staticJ3", "staticM3", "staticC",  "staticH2"]
        ],
        win: 0
    },

    // --- Програш ---
    {
        id: "spin-012",
        grid: [
            ["staticL5", "staticM4", "staticH1", "staticJ3", "staticC"],
            ["staticC",  "staticL1", "staticH2", "staticM1", "staticJ1"],
            ["staticH1", "staticL3", "staticM2", "staticJ2", "staticL2"]
        ],
        win: 0
    }
];

// Повертає випадковий результат спіну з масиву.
export function getRandomSpin() {
    return mockSpins[Math.floor(Math.random() * mockSpins.length)];
}

// Повертає результат за індексом (для тестування конкретного сценарію).
export function getSpinByIndex(index) {
    return mockSpins[index % mockSpins.length];
}
