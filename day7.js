import dataContent from './Data/day7.data';
import readFile from './advent_tools/readfile';

export default function dayBody(partToExecute)
{
    const DAY = 7;

    function loadData()
    {
        const entries = {};

        for(const line of readFile(dataContent))
        {
            let input = line.replace(/ bags?\.?/g, '');

            input = input.replace(/, /g, ',');
            input = input.replace(/ contain /g, '|');
            input = input.replace(/no other/g, '');

            const root = input.split('|')[0];
            const values = input.split('|')[1].split(',').filter(v => v);

            entries[root] = {

            };

            values.forEach(value => {
                const data = value.split(' ', 1)[0];
                entries[root][value.substring(data.length+1)] = +data;
            });
        }

        return entries;
    }

    function part1(input)
    {
        const keys  = Object.keys(input);
        const counted = {};

        const calculate = bag => {
            if (counted[bag]) {
                return 0;
            }

            counted[bag] = 1;
            const goodKeys = keys.filter(key => !counted[key] && input[key][bag]);

            return goodKeys.reduce((a, key) => a + calculate(key), 1);
        }

        const count = calculate('shiny gold') - 1; // don't include 'shiny gold' itself

        return count;
    }

    function part2(input)
    {
        const calculate = bag => {
            const content = input[bag];

            return Object.keys(content).reduce((a, key) => a + (content[key] * calculate(key)), 1);
        }

        const count = calculate('shiny gold')-1; // don't include 'shiny gold' itself

        return count;
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