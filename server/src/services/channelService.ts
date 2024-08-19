import http2 from "http2";
import Channel from "../models/Channel.js";

const RTMP_HTTPS_SERVER_URL = "https://localhost:8443/api/streams";

export async function isStreamLive(streamKey: string): Promise<boolean> {
    return new Promise((resolve) => {
        const url = new URL(`${RTMP_HTTPS_SERVER_URL}/api/streams`);

        const client = http2.connect(url.origin, {
            rejectUnauthorized: false,
        });

        client.on("error", (err) => {
            console.error("HTTP/2 client error:", err);
            resolve(false);
        });

        const req = client.request({
            ":path": url.pathname,
            ":method": "GET",
            accept: "application/json",
        });

        let data = "";
        req.on("data", (chunk) => {
            data += chunk;
        });

        req.on("end", () => {
            client.close();
            try {
                const streams = JSON.parse(data);
                resolve(Object.keys(streams?.live || {}).includes(streamKey));
            } catch (error) {
                console.error("Error parsing response:", error);
                resolve(false);
            }
        });

        req.on("error", (err) => {
            console.error("Request error:", err);
            resolve(false);
        });

        req.end();
    });
}

export async function updateChannelsStatus() {
    try {
        const channels = await Channel.find();

        console.log("update chennels")

        for (const channel of channels) {
            const isActive = await isStreamLive(channel.streamKey);
            channel.isActive = isActive;
            await channel.save();
        }
    } catch (error) {
        console.error("Error updating channel status:", error);
    }
}

// Schedule the status update every 15 seconds
setInterval(updateChannelsStatus, 15000);
