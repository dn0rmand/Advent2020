import dataContent from './Data/day14.data';
import readFile from './advent_tools/readfile';

export default function dayBody(partToExecute)
{
    const DAY = 14;

    function loadData()
    {
        const entries = [];

        for(const line of readFile(dataContent))
        {
            const values = line.split(' = ');
            if (values[0] === 'mask') {
                const mask = values[1];
                entries.push({ mask });
            } else if (values[0].substr(0, 3) === 'mem') {
                const address = +(values[0].substring(4, values[0].length-1));
                const value   = BigInt(values[1]);

                entries.push({ address, value });
            }
        }

        if (entries.length === 0 || entries[0].mask === undefined) {
            throw "input need to start with the mask";
        }

        return entries;
    }

    function part1(input)
    {
        function getMask(mask)
        {
            let or   = 0n;
            let and  = 2n**36n-1n;
            let bit  = 2n**36n;
            for(const c of mask) {
                bit >>= 1n;
                if (c === '0') {
                    and ^= bit;
                } else if (c === '1') {
                    or |= bit;
                }
            }
            return { or, and };
        }

        const memory = {};
        let mask   = { or: 0n, and: 0n };

        for(const entry of input)
        {
            if (entry.mask !== undefined) {
                mask = getMask(entry.mask);
            } else {
                memory[entry.address] = (entry.value & mask.and) | mask.or;
            }
        }

        let total = 0n;
        for(const idx in memory)
        {
            total += (memory[idx] || 0n);
        }

        return total;
    }

    function part2(input)
    {
        const memory = new Map();
        let mask = '';

        function setValue(address, value)
        {
            address = BigInt(address);

            const AND = 2n**36n - 1n;

            function inner(index, bit, address)
            {
                bit >>= 1n;
                if (index >= 36) {
                    memory.set(address, value);
                } else {
                    if (mask[index] === '0') {
                        inner(index+1, bit, address);
                    } else if (mask[index] === '1') {
                        inner(index+1, bit, address | bit);
                    } else {
                        const and = AND ^ bit;

                        inner(index+1, bit, address & and);
                        inner(index+1, bit, address | bit);
                    }
                }
            }

            inner(0, 2n**36n, address);
        }

        for(const entry of input) {
            if (entry.mask !== undefined) {
                mask = entry.mask;
            } else {
                setValue(entry.address, entry.value);
            }
        }

        let total = 0n;
        for(const value of memory.values())
        {
            total += value;
        }
        return total;
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