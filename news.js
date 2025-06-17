/** @typedef {{ res1: number, res2: number, text: string, item: Buffer | null }} */

import { getRandomResidents } from "./index.js";
import { food, treasure } from "./items.js";

const newsTypes = {
    "fire2": "$1's house is on fire! Witnesses say the fire started after an incident caused by $2 at their hot-dog party. Firefighters are already working on putting out the fire.",
    "disease": "An unknown disease spread across the city after $2 went to visit their sick friend $1. Authorities recommend staying home for now in order to avoid getting sick as well.",
    "foodSingingFest": "The annual $f singing festival is going to take place tommorow at the City Plaza. Its organizers, $1 and $2, are going to give a lifetime supply of $f to the person with the best performance. We wish all contestants luck!",
    "treasureShrine": "A $t shrine is going to be built in the city. Its architects, $1 and $2, say that \"it's going to be one of the structures ever built\".",
    "foodDay": "Today has been made the national $f day! The idea was initially suggested by $1. After careful consideration, mayor $2 decided to make it a national holiday.",
    "rescueWater": "$1 almost drowned today as they were hanging out with $2 by the ocean. However, $2, being one of the smartest people in the city, was quick to grab a $t and throw it into the ocean. $1 grabbed the $t and $2 pulled the rope, saving the day.",
    "flowers": "$1 and $2 have concluded the annual \"Everyone gets a flower\" event, where they gave away over 2000 flowers to people in need.",
    "corpTreasure": "The $t corp. has started its work on the brand new $t 2! The lead designers, $1 and $2, say: \"It's trully an innovation in the $t industry. We were very excited to announce $t 2 today.",
    "foodShopOpen": "A $f shop has opened in downtown. Its owner, $1, has just concluded the grand opening by giving $2 a 500 dollars coupon on everything in the store. \"They might just go broke after that\", says $2.",
    "treasureConvention": "The annual $t convention has started today by $1. The biggest fan of $ts, $2, said: \"This is like the best thing EVER. I'm never gonna forget this\"."
};

export const generateNews = () => {
    const [mii1, mii2] = getRandomResidents(2);
    let news = Object.values(newsTypes)[Math.floor(Math.random() * Object.keys(newsTypes).length)];
    let itemBuf = null;
    if(news.includes("$t")) {
        const randItem = treasure.getRandomItemIndex();
        news = news.replaceAll("$t", treasure.getItemName(randItem));
        itemBuf = treasure.getItemPNG(randItem);
    } else if(news.includes("$f")) {
        const randItem = food.getRandomItemIndex();
        news = news.replaceAll("$f", food.getItemName(randItem));
        itemBuf = food.getItemPNG(randItem);
    }
    news = news.replaceAll("$1", mii1.name);
    news = news.replaceAll("$2", mii2.name);
    return {
        res1: mii1.id, res2: mii2.id,
        text: news, item: itemBuf
    };
}