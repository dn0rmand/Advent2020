import dataContent from './Data/day2.data';
import readFile from './advent_tools/readfile';

export default function day2(partToExecute)
{
    const DAY = 2;

    function loadData()
    {
        const entries = [];

        for(const line of readFile(dataContent))
        {
            const [rule, password] = line.split(':');
            const [lengths, letter] = rule.split(' ');
            const [min, max] = lengths.split('-');

            entries.push({
                password: password.trim().split(''),
                rule: {
                    min: +min,
                    max: +max,
                    letter: letter.trim(),
                }
            });
        }

        return entries;
    }

    function part1(input)
    {
        const isValid = (min, max, count) => min <= count && count <= max;
        const countLetter = (pwd, letter) => pwd.reduce((a, l) => a + (l === letter), 0);

        const validPasswords = input.reduce((a, { password, rule: { letter, min, max }}) =>
                a + isValid(min, max, countLetter(password, letter)), 0);

        return validPasswords;
    }

    function part2(input)
    {
        const validPasswords = input.reduce((valid, { password, rule: { letter, min, max }}) =>
            valid + ((password[min-1] === letter && password[max-1] !== letter) ||
                    (password[min-1] !== letter && password[max-1] === letter))
        , 0);

        return validPasswords;
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