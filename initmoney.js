import * as db from "./index.js";

for(const resident of db.allResidents()) {
    db.setBalance(resident.id, Math.floor(Math.random() * 900) + 100);
}