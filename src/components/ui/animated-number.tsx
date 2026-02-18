import { useEffect, useState } from "react";

interface AnimatedNumberProps {
    value: number;
    formatFn?: (value: number) => string;
    duration?: number;
    className?: string;
}

export const AnimatedNumber = ({ value, formatFn, duration = 1000, className }: AnimatedNumberProps) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let startTimestamp: number | null = null;
        const startValue = displayValue; // Start from current display value to animate changes smoothly

        // If value is 0 (initial load often), maybe we want to start from 0. 
        // But if we are updating, we animate from current.

        // Simplified easing function (easeOutExpo)
        const easeOutExpo = (t: number) => {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        };

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            const nextValue = startValue + (value - startValue) * easeOutExpo(progress);

            setDisplayValue(nextValue);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }, [value, duration]);

    const formattedValue = formatFn ? formatFn(displayValue) : Math.round(displayValue).toString();

    return <span className={className}>{formattedValue}</span>;
};
