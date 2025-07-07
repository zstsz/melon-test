"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
//const webhook_1 = require("@slack/webhook");
const fetch = require('node-fetch');
const axios_1 = require("axios");
const qs = require("querystring");
(async () => {
    var _a;
    // Validate parameters
    const [productId, scheduleId, seatId, webhookUrl] = [
        "product-id",
        "schedule-id",
        "seat-id",
        "slack-incoming-webhook-url",
    ].map((name) => {
        const value = core.getInput(name);
        if (!value) {
            throw new Error(`melon-ticket-actions: Please set ${name} input parameter`);
        }
        return value;
    });
    const message = (_a = core.getInput("message")) !== null && _a !== void 0 ? _a : "티켓사세요";
    //const webhook = new webhook_1.IncomingWebhook(webhookUrl);
    console.log("configuration success!\n");
    const res = await axios_1.default({
        method: "POST",
        url: "https://tkglobal.melon.com/tktapi/product/block/summary.json",
        params: {
            v: "1",
            callback: "getBlockSummaryCountCallBack",
        },
        headers: {
            Accept: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Accept-Language": "zh-CN,zh;q=0.9,ko;q=0.8,en;q=0.7",
            //Content-Length: 59,
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            Cookie: "PC_PCID=17503346733961389426620; keyCookie_T=1000403728",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
            "X-Requested-With": "XMLHttpRequest",
        },
        data: qs.stringify({
            prodId:productId,
            pocCode:"SC0002",
            scheduleNo:scheduleId,
            seatGradeNo:""
        }),
    });
    // tslint:disable-next-line
    console.log("Got response: ", res.data);
    if (res.data.chkResult) {
        const link = `http://tkglobal.melon.com/performance/index.htm?${qs.stringify({
            prodId: productId,
        })}`;
        //await webhook.send(`${message} ${link}`);
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: `${message} ${link}` })
        });
    }
})().catch((e) => {
    console.error(e.stack); // tslint:disable-line
    core.setFailed(e.message);
});
