import Database from "better-sqlite3";
import * as mii from "./mii.js";
import fs from "fs";
import { join } from "path";

const db = new Database("data.db");
db.pragma("journal_mode = WAL");

if(!fs.existsSync("miis"))
    fs.mkdirSync("miis");

/**
 * @typedef {object} Resident A resident
 * @prop {number} id ID
 * @prop {string} name Name
 * @prop {string} mii Mii data
 */
db.prepare(`CREATE TABLE IF NOT EXISTS residents (
    id INTEGER PRIMARY KEY,
    name TEXT,
    mii TEXT
)`).run();
/** @typedef {0 | 1 | 2 | 3} Relation */
/** @type {Record<string, Relation>} */
export const relations = {
    "acquaintances": 0,
    "friends": 1,
    "lovers": 2,
    "spouses": 3
};
/*
Relations:
nonexistent - acquaintances
1 - friends
2 - lovers
3 - spouses
*/
db.prepare(`CREATE TABLE IF NOT EXISTS relations (
    id INTEGER PRIMARY KEY,
    resident1 INTEGER,
    resident2 INTEGER,
    relation INTEGER
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS balance (
    id INTEGER PRIMARY KEY,
    resident INTEGER,
    balance INTEGER
)`).run();

/** @returns {boolean} */
export function residentsExist() {
    return !!db.prepare(`SELECT * FROM residents LIMIT 1`).get();
}
/** @returns {Resident[]} */
export function allResidents() {
    return db.prepare(`SELECT * FROM residents`).all();
}

/** @param {Resident["name"]} name  */
export function createResident(name) {
    const miiData = mii.getRanomMiiData();
    db.prepare(`INSERT INTO residents (name, mii) VALUES (?, ?)`)
        .run(name, miiData);
}
/**
 * @param {Resident["id"]} id 
 * @returns {Resident}
 */
export function getResident(id) {
    return db.prepare(`SELECT * FROM residents WHERE id = ?`).get(id);
}

/**
 * @returns {Resident}
 */
export function getRandomResident() {
    return db.prepare(`SELECT * FROM residents ORDER BY RANDOM() LIMIT 1`).get();
}
/**
 * @param {number} n
 * @returns {Resident[]}
 */
export function getRandomResidents(n) {
    return db.prepare(`SELECT * FROM residents ORDER BY RANDOM() LIMIT ?`).all(n);
}

/**
 * @param {Resident["id"]} id1
 * @param {Resident["id"]} id2
 * @returns {Relation}
 */
export function getRelation(id1, id2) {
    return db.prepare(`SELECT * FROM relations WHERE (resident1 = ? AND resident2 = ?)
        OR (resident1 = ? AND resident2 = ?)`).get(id1, id2, id2, id1)?.relation || 0;
}
/**
 * @param {Resident["id"]} id1
 * @param {Resident["id"]} id2
 * @param {Relation} relation 
 */
export function setRelation(id1, id2, relation) {
    if(getRelation(id1, id2))
        db.prepare(`UPDATE relations SET relation = ? WHERE (resident1 = ? AND resident2 = ?)
            OR (resident1 = ? AND resident2 = ?)`).run(relation, id1, id2, id2, id1);
    else if(relation !== 0)
        db.prepare(`INSERT INTO relations (relation, resident1, resident2) VALUES (?, ?, ?)`).run(relation, id1, id2);
    else
        db.prepare(`DELETE FROM relations WHERE (resident1 = ? AND resident2 = ?)
            OR (resident1 = ? AND resident2 = ?)`).run(id1, id2, id2, id1);
}

/**
 * @param {Resident["id"]} id
 * @returns {Buffer}
 */
export async function getMiiPNG(id) {
    const path = join("miis", `${id}.png`);
    if(fs.existsSync(path))
        return fs.readFileSync(path);
    
    const resident = getResident(id);
    const img = await mii.getMiiImage(resident.mii);
    fs.writeFileSync(path, img);
    return img;
}

/**
 * @param {Resident["id"]} id
 * @returns {number}
 */
export function getBalance(id) {
    return db.prepare(`SELECT * FROM balance WHERE resident = ?`).get(id)?.balance || 0;
}
/**
 * @param {Resident["id"]} id
 * @param {number} balance
 */
export function setBalance(id, balance) {
    if(getBalance(id))
        db.prepare(`UPDATE balance SET balance = ? WHERE id = ?`).run(balance, id);
    else
        db.prepare(`INSERT INTO balance (balance, resident) VALUES (?, ?)`).run(balance, id);
}