import React, { useEffect, useState } from 'react'

type Props = {
    isSuccess: boolean,
}

export default function Timer({ isSuccess }: Props) {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isSuccess) {
                setSeconds(s => s + 1);
            }
        }, 1000);

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        }
    }, [isSuccess]);

    return (
        <div>
            <span>已用时 </span>
            <span>{Math.floor(seconds / 3600)}小时</span>
            <span>{Math.floor(seconds / 60) % 60}分钟</span>
            <span>{seconds % 60}秒</span>
        </div>
    )
}