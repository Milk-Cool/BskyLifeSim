import fs from "fs";
import { join } from "path";

export class ItemManager {
    constructor(name, capName) {
        const mapRaw = fs.readFileSync(join("res", `${name}.map`), "utf-8");
        this.map = Object.fromEntries(mapRaw.split("\n").map(x => x.split(" - ")));
        this.name = name;
        this.capName = capName;
    }

    getRandomItemIndex() {
        const keys = Object.keys(this.map);
        return keys[Math.floor(Math.random() * keys.length)];
    }

    getItemName(i) {
        return this.map[i];
    }
    getItemPNG(i) {
        return fs.readFileSync(join("res", this.name, `item_${this.capName}${i}.png`));
    }
}

export const food = new ItemManager("food", "Food");
export const treasure = new ItemManager("treasure", "Treasure");