import React, { useEffect, useState } from 'react'

type Props = {
    isStart: boolean,
    isSuccess: boolean,
}

export default function Timer({ isStart, isSuccess }: Props) {
    const [seconds, setSeconds] = useState(0);

    console.log(isStart);
    let interval: NodeJS.Timeout | null;
    useEffect(() => {
        if (isStart && !isSuccess) {
            console.log('sssss');
            interval = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        } else {
            setSeconds(0);
            clearInterval(interval as NodeJS.Timeout);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        }
    }, [seconds, isStart]);

    return (
        <div>
            <span>已用时 </span>
            <span>{Math.floor(seconds / 3600)}小时</span>
            <span>{Math.floor(seconds / 60) % 60}分钟</span>
            <span>{seconds % 60}秒</span>
        </div>
    )
}