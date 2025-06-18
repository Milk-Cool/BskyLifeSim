import * as db from "./index.js";
import fs from "fs";
import { join } from "path";
import { Jimp } from "jimp";

const getImage = (...p) => fs.readFileSync(join("res", ...p));

export const randBgPath = () => `interview_bg_${Math.floor(Math.random() * 4) + 1}.png`;
export const iconPaths = {
    friend: "star.png",
    fight: "squiggle.png",
    love: "heart.png",
    breakup: "heartbreak.png",
    money: "money.png",
    diary: "book.png",
    news: "news.png",
};

export const create2ResIconItem = async (bgPath, id1, id2, iconPath, itemBuf) => {
    const img = await Jimp.read(getImage(bgPath));
    const mii1 = await Jimp.read(await db.getMiiPNG(id1));
    const mii2 = await Jimp.read(await db.getMiiPNG(id2));
    const icon = iconPath === null ? null : await Jimp.read(getImage(iconPath));
    const item = itemBuf === null ? null : await Jimp.read(itemBuf);

    img.color([{ apply: "desaturate", params: [50] }]);
    img.composite(mii1, Math.floor(img.width * 0.25 - mii1.width / 2), Math.floor(img.height - mii1.height));
    img.composite(mii2, Math.floor(img.width * 0.75 - mii2.width / 2), Math.floor(img.height - mii2.height));
    if(icon !== null) img.composite(icon, Math.floor(img.width / 2 - icon.width / 2), Math.floor(img.height * 0.15 - icon.height / 2));
    if(item !== null) img.composite(item, Math.floor(img.width / 2 - item.width / 2), Math.floor(img.height / 2 - item.height / 2));

    return await img.getBuffer("image/png");
}