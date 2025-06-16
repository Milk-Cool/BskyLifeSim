import * as db from "./index.js";
import fs from "fs";

if(db.residentsExist()) throw new Error("Residents exist! Can't initialize. Delete data.db first!");

const names = fs.readFileSync("names.txt", "utf-8").split("\n").filter(Boolean);
for(const name of names) {
    db.createResident(name);
    console.log(name);
}
for(const resident1 of db.allResidents())
    for(const resident2 of db.allResidents()) {
        if(resident1.id <= resident2.id) continue;
        if(Math.random() < .5) db.setRelation(resident1.id, resident2.id, 1);
        else if(Math.random() < .05) db.setRelation(resident1.id, resident2.id, 2);
        console.log(resident1.name, resident2.name);
    }
console.log("All done!");