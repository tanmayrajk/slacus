import express from "express";
import fs from "fs";

let canUpdate = true;

try {
    const data = fs.readFileSync("src/db.json", "utf-8");
    const db = JSON.parse(data);
    canUpdate = db.canUpdate;
} catch (err) {
    console.error(err);
}

function setCanUpdate(value: boolean) {
    canUpdate = value;
    const db = { canUpdate: value };
    fs.writeFileSync("src/db.json", JSON.stringify(db, null, 4), "utf-8");
}

const app = express();

app.get("/disable", (req, res) => {
    setCanUpdate(false);
    res.send("Status updates disabled");
})

app.get("/enable", (req, res) => {
    setCanUpdate(true);
    res.send("Status updates enabled");
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});