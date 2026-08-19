import Card from "./card.js";
import { CARDS, ORDER } from "./constants.js";

export function createCards() {
    var cards = [];
    const tbl = createDeck(ORDER);
    for (let i = 0; i < CARDS; i++) {
        const card = new Card(
            shuffle(tbl[0][i]),
            tbl[1][i]
        )
        cards.push(card);
    }
    return shuffle(cards);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createDeck(order) {
    var grid = [];
    var count = 0;
    const size = (order*order)+order+1;
    var seen = new Array(size).fill(false);
    for (let i = 0; i < order+1; i++) {
        grid[i] = [];
        for (let j = 0; j < order; j++) {
            var rand = getRandomInt(0,size-1);
            while (seen[rand]) rand = getRandomInt(0,size-1);
            grid[i][j] = rand;
            seen[rand] = true;
        }
    }
    for (let i = 0; i < size; i++) {
        if (!seen[i]) {
            count = i;
        }
    }

    var res = [];
    for (var m = 1; m < order; m++) {
        for (let c = 0; c < order; c++) {
            var card = []
            for (let x = 0; x < order; x++) {
                const y = ((m * x) + c) % order;
                card.push(grid[x][y]);
            }
            card.push(grid[order][m]);
            res.push(card)
        }
    }

    for (let c = 0; c < order; c++) {
        var card = [];
        var card1 = [];
        for (let x = 0; x < order; x++) {
            const y = ((m*x)+c)%order;
            card.push(grid[x][y]);
            card1.push(grid[y][x]);
        }
        card.push(grid[order][0]);
        card1.push(count);
        res.push(card);
        res.push(card1);
    }
    var last = [];
    for (let m = 0; m < order; m++) {
        last.push(grid[order][m]);
    }
    last.push(count);
    res.push(last);

    const sizes = generateSizes(res);
    return [res, sizes];
}

/**
 * 
 * @param {number[][]} grid
 */
function generateSizes(grid) {
    const m = grid.length;
    const n = grid[0].length;
    const options = [20,25,30];
    var res = Array.from({ length: m }, () => new Array(n).fill(0));
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            res[i][j] = options[getRandomInt(0,2)];
        }
    }
    return res;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}