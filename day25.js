import numberHelper from './advent_tools/numberHelper';

export default function dayBody(partToExecute) 
{
    const DAY = 25;

    numberHelper(); // initialize extension to Number object

    const DOOR_PUBLIC_KEY = 17786549;
    const CARD_PUBLIC_KEY = 7573546;

    function getMinLoopSize(key1, key2)
    {
        let k = 1;
        let loop = 0;
        while (true) {
            loop++;
            k = (k * 7) % 20201227;
            if (k === key1) {
                return { loop, publicKey: key2 };
            } else if (k === key2) {
                return { loop, publicKey: key1 };
            }
        }
    }

    function part1()
    {
        const { loop, publicKey } = getMinLoopSize(DOOR_PUBLIC_KEY, CARD_PUBLIC_KEY);

        return publicKey.modPow(loop, 20201227);
    }

    console.log(`--- Advent of Code day ${DAY} ---`);

    if (!partToExecute || partToExecute === 1)
    {
        console.time(`${DAY}-part-1`);
        const p1 = part1();
        console.log(`Part 1: ${p1}`);
        console.timeLog(`${DAY}-part-1`, `to execute part 1 of day ${DAY}`);
        if (partToExecute === 1)
            return p1;
    }

    if (partToExecute === 2)
    {
        return 'No part 2';
    }
};
