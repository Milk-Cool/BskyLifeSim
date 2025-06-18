import "dotenv/config";

import { AtpAgent } from "@atproto/api";
import * as db from "./index.js";
import { food, treasure } from "./items.js";
import { imageSize } from "image-size";
import * as imgUtils from "./image.js";
import { generateDiary, generateNews } from "./news.js";
import fs from "fs";
import { join } from "path";
import { randomUUID } from "crypto";

const agent = new AtpAgent({
    service: "https://bsky.social"
});

const uploadPNG = async buf => {
    const size = imageSize(buf);
    const { data } = await agent.uploadBlob(buf, { encoding: "image/png" });
    return { image: data.blob, aspectRatio: { width: size.width, height: size.height }, alt: "Life sim" };
};

const post = async (text, uploadedImage) => {
    await agent.post({
        text,
        embed: {
            $type: "app.bsky.embed.images",
            images: [uploadedImage]
        }
    });
};

const tryToPost = async (mii1, mii2, iconPath, itemBuf, text) => {
    try {
        const img = await imgUtils.create2ResIconItem(imgUtils.randBgPath(), mii1, mii2, iconPath, itemBuf);
        if(process.env.DEBUG) {
            if(!fs.existsSync("debug")) fs.mkdirSync("debug");
            const fname = randomUUID() + ".png";
            fs.writeFileSync(join("debug", fname), img);
            console.log(fname);
            return;
        }
        const uploadedImage = await uploadPNG(img);
        await post(text, uploadedImage);
    } catch(e) {
        if(process.env.DEBUG) console.error(e);
    }
}

const cycle = async () => {
    for(let i = 0; i < 2; i++) {
        const [mii1, mii2] = db.getRandomResidents(2);
        const relation = db.getRelation(mii1.id, mii2.id);
        let itemBuf = null, iconPath = null, text = null;
        const bal = db.getBalance(mii1.id);
        const sum = Math.floor(Math.random() * 10) + 5;
        if(relation === 0 && Math.random() < .75) {
            // new friends
            iconPath = imgUtils.iconPaths.friend;
            text = `${mii1.name} and ${mii2.name} are now friends!`;
            db.setRelation(mii1.id, mii2.id, 1);
        } else if(relation === 1 && Math.random() < .25) {
            // fight
            iconPath = imgUtils.iconPaths.fight;
            const type = (Math.random() < .5 ? food : treasure);
            const id = type.getRandomItemIndex();
            itemBuf = type.getItemPNG(id);
            text = `${mii1.name} and ${mii2.name} fought over a ${type.getItemName(id)}!`;
            db.setRelation(mii1.id, mii2.id, 0);
        } else if(relation === 1 && Math.random() < .5) {
            // fallen in love
            iconPath = imgUtils.iconPaths.love;
            text = `${mii1.name} and ${mii2.name} have fallen in love and started dating!`;
            db.setRelation(mii1.id, mii2.id, 2);
        } else if(relation === 2 && Math.random() < .5) {
            // marriage
            iconPath = imgUtils.iconPaths.love;
            text = `${mii1.name} and ${mii2.name} just got married!`;
            db.setRelation(mii1.id, mii2.id, 3);
        } else if(relation === 2 && Math.random() < .35 || relation === 3 && Math.random() < .15) {
            // breakup
            iconPath = imgUtils.iconPaths.breakup;
            text = `${mii1.name} and ${mii2.name} just broke up!`;
            db.setRelation(mii1.id, mii2.id, 1);
        } else if(bal >= sum &&  Math.random() < 0.15) {
            iconPath = imgUtils.iconPaths.money;
            const randTreasure = treasure.getRandomItemIndex();
            itemBuf = treasure.getItemPNG(randTreasure);
            text = `${mii1.name} bought a ${treasure.getItemName(randTreasure)} from ${mii2.name} for $${sum}!`;
            db.setBalance(mii1.id, bal - sum);
        } else continue;
        console.log(text);

        await tryToPost(mii1.id, mii2.id, iconPath, itemBuf, text);
    }

    if(Math.random() < .07) {
        const news = generateNews();
        console.log(news.text);
        await tryToPost(news.res1, news.res2, imgUtils.iconPaths.news, news.item, news.text);
    }
    if(Math.random() < .07) {
        const entry = generateDiary();
        console.log(entry.text);
        await tryToPost(entry.res1, entry.res2, imgUtils.iconPaths.diary, entry.item, entry.text);
    }
}

(async () => {
    await agent.login({
        identifier: process.env.BSKY_USERNAME,
        password: process.env.BSKY_PASSWORD
    });

    if(process.env.DEBUG) cycle();
    setInterval(cycle, 5 * 60 * 1000);
})();