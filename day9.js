import dataContent from './Data/day9.data';
import readFile from './advent_tools/readfile';

export default function dayBody(partToExecute)
{
    const DAY = 9;

    function loadData()
    {
        const entries = [];

        for(const line of readFile(dataContent))
        {
            entries.push(+line);
        }

        return entries;
    }

    function part1(input)
    {
        const preamble = input.slice(0, 25);
        let answer = -1;

        for(let i = preamble.length; i < input.length; i++) {
            const value = input[i];
            let found = false;

            for(const c of preamble) {
                const v = value-c;
                if (v !== c && v >= 0 && preamble.includes(v)) {
                    found = true;
                    break;
                }
            }

            if (! found)
            {
                answer = value;
                break;
            }

            preamble.shift();
            preamble.push(value);
        }

        return answer;
    }

    function part2(input, target)
    {
        target = target || part1();

        let sum = 0;
        let start = 0;
        let end = 0;

        for(let i = 0; !end && i < input.length; i++)
        {
            const value = input[i];
            sum += value;
            if (sum === target && i > start+1)
            {
                end = i+1;
            }
            else
            {
                while (sum > target)
                {
                    sum -= input[start++];
                    if (sum === target && i > start+1)
                    {
                        end = i+1;
                        break;
                    }
                }
            }
        }

        if (sum === target)
        {
            const values = input.slice(start, end).sort((a, b) => a-b);
            return values[0] + values[values.length-1]
        }

        throw "NO SOLUTION";
    }

    console.log(`--- Advent of Code day ${DAY} ---`);

    const input = loadData();
    let p1 = undefined;

    if (!partToExecute || partToExecute === 1)
    {
        console.time(`${DAY}-part-1`);
        p1 = part1(input);
        console.log(`Part 1: ${p1}`);
        console.timeLog(`${DAY}-part-1`, `to execute part 1 of day ${DAY}`);
        if (partToExecute === 1)
            return p1;
    }

    if (!partToExecute || partToExecute === 2)
    {
        console.time(`${DAY}-part-2`);
        const p2 = part2(input, p1 ?? part1(input));
        console.log(`Part 2: ${p2}`);
        console.timeLog(`${DAY}-part-2`, `to execute part 2 of day ${DAY}`);
        if (partToExecute === 2)
            return p2;
    }
};