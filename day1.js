import dataContent from './Data/day1.data';
import readFile from './advent_tools/readfile';

export default function day1(partToExecute)
{
    const DAY = 1;

    function loadData()
    {
        const entries = [];

        for(const line of readFile(dataContent))
        {
            entries.push(+line);
        }

        entries.sort((a, b) => a-b);

        const map = entries.reduce((a, v, i) => {
            a[v] = i;
            return a;
        }, []);

        return { entries, map };
    }

    function search({ entries, map }, value, count, index)
    {
        index = index || 0;

        for(let i = index; i < entries.length; i++)
        {
            const v1 = entries[i];
            if (v1 > value)
                break;

            const v2 = value - v1;

            if (count > 2) {
                const v3 = search({ entries, map  }, v2, count-1, i+1);
                if (v3 !== 0) {
                    return v3 * v1;
                }
            } else if (map[v2] && map[v2] > i) {
                return v1 * v2;
            }
        }

        return 0;
    }

    function part1(input)
    {
        const answer = search(input, 2020, 2);
        return answer;
    }

    function part2(input)
    {
        const answer = search(input, 2020, 3);
        return answer;
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