import React, { useEffect, useState } from 'react'

type Props = {
    isStart: boolean,
    isSuccess: boolean,
}

export default function Timer({ isStart, isSuccess }: Props) {
    const [seconds, setSeconds] = useState(0);

    // console.log(new Date().toString());
    // console.log(seconds);
    useEffect(() => {
        let interval: NodeJS.Timeout | null;
        console.log('xxxxx');
        if (!isStart && !isSuccess) {
            setSeconds(0);
        }
        if (isStart && !isSuccess) {
            interval = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        }
    }, [isStart, isSuccess]);

    return (
        <div>
            <span>已用时{seconds} </span>
            <span>{Math.floor(seconds / 3600)}小时</span>
            <span>{Math.floor(seconds / 60) % 60}分钟</span>
            <span>{seconds % 60}秒</span>
        </div>
    )
}