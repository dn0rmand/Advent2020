import dataContent from './Data/day5.data';
import readFile from './advent_tools/readfile';

export default function day5(partToExecute)
{
    const DAY = 5;

    function loadData()
    {
        const entries = [];

        for(const line of readFile(dataContent))
        {
            entries.push(line);
        }

        return entries;
    }

    function decode(data)
    {
        let minRow = 0, maxRow = 127;
        let minCol = 0, maxCol = 7;

        for(const d of data)
        {
            switch(d)
            {
                case 'F':
                    maxRow = Math.floor((maxRow+minRow) / 2);
                    break;
                case 'B':
                    minRow = Math.ceil((maxRow+minRow) / 2);
                    break;
                case 'L':
                    maxCol = Math.floor((maxCol+minCol) / 2);
                    break;
                case 'R':
                    minCol = Math.ceil((maxCol+minCol) / 2);
                    break;
            }
        }

        return (minRow * 8) + minCol;
    }

    function part1(input)
    {
        return input.reduce((a, v) => Math.max(a, decode(v)), 0);
    }

    function part2(input)
    {
        const MAX = 128*8;

        const map   = input.reduce((a, v) => {
            a[decode(v)] = 1;
            return a;
        }, new Uint8Array(MAX));

        for(let id = 1; id < MAX-1; id++) {
            if (!map[id] && map[id-1] && map[id+1]) {
                return id;
            }
        }

        throw "Seat not found";
    }

    console.log(`--- Advent of Code day ${DAY} ---`);

    const input = loadData();

    if (!partToExecute || partToExecute === 1)
    {
        console.time(`${DAY}-part-1`);
        const p1 = part1(input);
        console.log(`Part 1: ${p1}`);
        console.timeLog(`${DAY}-part-1`, `to execute part 1 of day ${DAY}`);
        if (partToExecute === 1)
            return p1;
    }

    if (!partToExecute || partToExecute === 2)
    {
        console.time(`${DAY}-part-2`);
        const p2 = part2(input);
        console.log(`Part 2: ${p2}`);
        console.timeLog(`${DAY}-part-2`, `to execute part 2 of day ${DAY}`);
        if (partToExecute === 2)
            return p2;
    }
};
