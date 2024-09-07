const NodeMediaServer = require("node-media-server");

const config = {
    rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60,
    },
    http: {
        port: 8000,
        allow_origin: "https://twitch-tv-seven.vercel.app/"
    },
    https: {
        port: 8443,
        key: "./key.pem",
        cert: "./cert.pem",
        allow_origin: "*",
    },
};

var nms = new NodeMediaServer(config);
nms.run();
