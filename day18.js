import dataContent from './Data/day18.data';
import readFile from './advent_tools/readfile';

export default function dayBody(partToExecute)
{
    const DAY = 18;

    function loadData()
    {
        const entries = [];

        for(const line of readFile(dataContent))
        {
            entries.push(line);
        }

        return entries;
    }

    function evaluate(line, part2 = false, start = 0, end = 0)
    {
        let position = start || 0;
        let length   = end || line.length;

        function getExpression()
        {
            while (position < length)
            {
                if (line[position] === ' ')
                {
                    position++;
                }
                else if (line[position] === '(')
                {
                    position++;
                    // let value = '';
                    let opened = 1;
                    start = position;

                    while (position < length)
                    {
                        const c = line[position++];
                        if (c === '(')
                        {
                            opened++;
                        }
                        else if (c === ')')
                        {
                            opened--;
                            if (opened === 0)
                            {
                                end = position-1;
                                break;
                            }
                        }
                        // value += c;
                    }
                    if (opened !== 0)
                    {
                        throw ") expected";
                    }

                    const value = evaluate(line, part2, start, end);
                    if (typeof(value) !== "number")
                        throw "ERROR";
                    return value;
                }
                else if (line[position] >= '0' && line[position] <= '9')
                {
                    let value = 0;
                    while (position < length && line[position] >= '0' && line[position] <= '9')
                    {
                        value = value*10 + +(line[position++]);
                    }
                    return value;
                }
                else
                {
                    throw "Expression expected";
                }
            }

            throw "Expression expected";
        }

        function getOperator()
        {
            while (position < length)
            {
                if (line[position] === ' ')
                {
                    position++;
                }
                else if (line[position] === '+' || line[position] === '*')
                {
                    return line[position++];
                }
                else
                {
                    throw "+ or * expected";
                }
            }
        }

        let total = getExpression();
        let operator = getOperator();

        while (operator)
        {
            if (operator !== '+' && operator !== '*')
            {
                throw "Invalid operator";
            }

            let exp2 = getExpression();
            let op2 = getOperator();

            if (part2)
            {
                while (op2 === '+') {
                    exp2 += getExpression();
                    op2 = getOperator();
                }
            }

            if (operator === '+')
                total += exp2;
            else
                total *= exp2;

            operator = op2;
        }

        return total;
    }

    function part1(input)
    {
        const answer = input.reduce((a, v) => a + evaluate(v), 0);

        return answer;
    }

    function part2(input)
    {
        const answer = input.reduce((a, v) => a + evaluate(v, true), 0);

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
