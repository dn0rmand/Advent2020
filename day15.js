export default function dayBody(partToExecute)
{
    const DAY = 15;

    function search(input, target)
    {
        const indexes = new Int32Array(target + 1).fill(-1);

        let count = 0;
        let last  = 0;
        for(const i of input)
        {
            indexes[i] = count++;
            last = i;
        }

        let next = 0;
        while (count < target) {
            last = next;
            const index = indexes[next];
            indexes[next] = count++;

            if (index === -1) {
                next = 0;
            } else {
                next = count-index-1;
            }
        }

        return last;
    }

    function part1(input)
    {
        return search(input, 2020);
    }

    function part2(input)
    {
        return search(input, 30000000);
    }

    console.log(`--- Advent of Code day ${DAY} ---`);

    const input = [20, 9, 11, 0, 1, 2];

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