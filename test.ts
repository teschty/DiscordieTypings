/// <reference path="./discordie.d.ts" />

import * as Discordie from "discordie";

let client = new Discordie();

client.connect({
    email: "teschty@tamu.edu",
    password: "potatoman69plus1"
});

client.Dispatcher.on("VOICE_CHANNEL_JOIN", e => {
    console.log(e.user.username + " joined");
});