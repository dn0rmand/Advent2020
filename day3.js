import dataContent from './Data/day3.data';
import readFile from './advent_tools/readfile';

export default function day3(partToExecute)
{
    const DAY = 3;

    function loadData()
    {
        const entries = [];

        for(const line of readFile(dataContent))
        {
            entries.push(line);
        }

        return entries;
    }

    function calculateTrees(input, {  right, down })
    {
        let x = 0, y = 0;
        const width = input[0].length;

        let trees = 0;
        while (y < input.length) {
            x = (x + right) % width;
            y = y + down;

            if (y < input.length && input[y][x] === '#') {
                trees++;
            }
        }

        return trees;
    }

    function part1(input)
    {
        const slope = {right: 3, down: 1};

        const trees = calculateTrees(input, slope);

        return trees;
    }

    function part2(input)
    {
        const slopes = [
            {right: 1, down: 1},
            {right: 3, down: 1},
            {right: 5, down: 1},
            {right: 7, down: 1},
            {right: 1, down: 2},
        ];

        const trees = slopes.reduce((a, slope) => a * calculateTrees(input, slope), 1);

        return trees;
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
