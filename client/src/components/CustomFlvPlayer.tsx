import React, { useEffect, useRef } from 'react';
import flvjs from 'flv.js';

const CustomFlvPlayer: React.FC<{ streamUrl: string }> = ({ streamUrl }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const flvPlayerRef = useRef<flvjs.Player | null>(null);

    useEffect(() => {
        if (flvjs.isSupported() && videoRef.current) {
            const flvPlayer = flvjs.createPlayer({
                type: 'flv',
                url: streamUrl,
                isLive: true,
            });

            flvPlayer.attachMediaElement(videoRef.current);
            flvPlayer.load();
            flvPlayer.play();

            flvPlayerRef.current = flvPlayer;

            flvPlayer.on(flvjs.Events.ERROR, (errorType, errorDetail) => {
                console.error('FLV player error:', errorType, errorDetail);
            });
        }

        return () => {
            if (flvPlayerRef.current) {
                flvPlayerRef.current.destroy();
            }
        };
    }, [streamUrl]);

    return (
        <div className="w-full h-full bg-black aspect-video">
            <video ref={videoRef} controls style={{ width: '100%', height: '100%' }} />
        </div>
    );
};

export default CustomFlvPlayer;