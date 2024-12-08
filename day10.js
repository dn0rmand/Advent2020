import dataContent from './Data/day10.data';
import readFile from './advent_tools/readfile';

export default function dayBody(partToExecute)
{
    const DAY = 10;

    function loadData()
    {
        const entries = [];

        for(const line of readFile(dataContent))
        {
            entries.push(+line);
        }

        entries.sort((a, b) => a-b);

        return entries;
    }

    function part1(input)
    {
        let j3 = 1;
        let j1 = 0;
        let j  = 0;

        for(const a of input) {
            const o = a-j;
            if (o === 1)
                j1++;
            else if (o === 3)
                j3++;
            j = a;
        }

        return j1*j3;
    }

    function part2(input)
    {
        const target = input[input.length-1] + 3;
        const counts = new Array(target+1);

        counts.fill(0);
        counts[0] = 1;

        input.push(target);

        for(let i = 0; i < input.length; i++) {
            const value = input[i];
            for(let a = 1; a <= 3; a++) {
                const idx = value-a;
                if (idx >= 0)
                    counts[value] += counts[idx];
            }
        }

        const answer = counts[target];

        return answer;
    }

    console.log(`--- Advent of Code day ${DAY} ---`);

    const input = loadData();

    if (!partToExecute || partToExecute === 1)
    {
        console.time(`${DAY}-part-1`);
        const p1 = part1(input);
        console.log(`Part 1: ${p1}`);
        console.timeEnd(`${DAY}-part-1`, `to execute part 1 of day ${DAY}`);
        if (partToExecute === 1)
            return p1;
    }

    if (!partToExecute || partToExecute === 2)
    {
        console.time(`${DAY}-part-2`);
        const p2 = part2(input);
        console.log(`Part 2: ${p2}`);
        console.timeEnd(`${DAY}-part-2`, `to execute part 2 of day ${DAY}`);
        if (partToExecute === 2)
            return p2;
    }
};

