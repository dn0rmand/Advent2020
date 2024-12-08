import dataContent from './Data/day6.data';
import readFile from './advent_tools/readfile';

export default function day6(partToExecute)
{
    const DAY = 6;

    function loadData()
    {
        const input = [];
        let group = undefined;

        for(const line of readFile(dataContent))
        {
            if (line === '')
            {
                if (group !== undefined)
                {
                    group.questions = Object.keys(group.questions);
                    input.push(group);
                    group = undefined;
                }
            }
            else
            {
                if (group === undefined)
                {
                    group = {
                        questions: {},
                        persons: [],
                    };
                }

                for (const entry of line.split(' '))
                {
                    const values = entry.split('');
                    group.persons.push(values);
                    values.forEach((question) => group.questions[question] = 1);
                }
            }
        }

        if (group !== undefined)
        {
            group.questions = Object.keys(group.questions);
            input.push(group);
        }

        return input;
    }

    function part1(input)
    {
        const answer = input.reduce((count, group) => count + group.questions.length, 0);

        return answer;
    }

    function part2(input)
    {
        const answer = input.reduce((a, group) =>
            a + group.questions.reduce((a, question) => a + (group.persons.some((v) => !v.includes(question)) ? 0 : 1), 0)
        , 0);

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