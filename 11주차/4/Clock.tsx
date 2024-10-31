import React, { useEffect, useState } from "react";

const Clock: React.FC = () => {
    const [time, setTime] = useState<Date>(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date());
            console.log("interval 수행!");
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            <h1>현재 시간: {time.toLocaleTimeString()}</h1>
        </div>
    );
};

export default Clock;
