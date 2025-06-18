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

const diaryTypes = {
    "foodCafe": "$1's diary: \"Today I met $2 at a $f café. We had a small talk about how good $f is and eventually decided to visit this place every week. So excited!\"",
    "giftTreasure": "$1's diary: \"$2 gave me a $t today!! I have an obsession with these, so this is a perfect gift! Would've never expected that from $2 but here we are\"",
    "foundTreasure": "$1's diary: \"I found a $t today. Not sure who it belings to, but I think I'm gonna ask $2 first. Going to keep it at home for now though.\"",
    "foodMeme": "$1's diary: \"I've created a meme!!! I made a meme about $f, and then $2 posted it on their Miibook page and now it's incredibly popular!!\"",
    "gamingConvention": "$1's diary: \"Today, $2 and I went to a gaming convention. It was fun and we met a couple of new friends there :)\"",
    "catFeed": "$1's diary: \"$2 and I met a very cute cat today! While I was making photos of it, $2 brought some food and we fed the cat.\"",
    "embarassFood": "$1's diary: \"Today I told my coworker $2 about how much i love $f. However, she and a couple of their friends made fun of me. T_T\"",
    "bookFood": "$1's diary: \"Today I bought a recipe book about $f and its variations. But the book is so poorly written that it makes me think it's a scam of some sort. Just a waste of money :(\"",
    "treasureLost": "$1's diary: \"I think I lost my $t today :( Hope someone will find it and return it...\"",
    "vacation": "$1's diary: \"I just bought some tickets to $t island for a vacation!! Can't wait for it!!\""
};

export const generateRandom = types => {
    const [mii1, mii2] = getRandomResidents(2);
    let news = Object.values(types)[Math.floor(Math.random() * Object.keys(types).length)];
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

export const generateNews = () => generateRandom(newsTypes);
export const generateDiary = () => generateRandom(diaryTypes);