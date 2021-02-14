export default function dayBody(partToExecute)
{
    const DAY = 23;

    const INPUT = '318946572';

    const ONE_MILLION = 1000000;

    function loadData(part)
    {
        const map = Array(part === 2 ? ONE_MILLION+1 : 11);

        let first = undefined;
        let last  = undefined;

        const constructValue = value => {
            if (map[value])
                return map[value];

            const o = { value };

            map[value] = o;

            if (value-1 > 0) {
                o.previous = map[value-1] || constructValue(value-1);
            }

            return o;
        };

        const addValue = value => {
            const o = constructValue(value);

            if (first) {
                last.next = o;
                last = o;
            } else {
                first = last = o;
            }
        };

        for(let i = 0; i < INPUT.length; i++) {
            const value = +(INPUT[i]);

            addValue(value);
        }

        if (part === 2) {
            for(let i = 10; i <= ONE_MILLION; i++)
                addValue(i);
        }

        map[1].previous = map[part === 2 ? ONE_MILLION : 9];

        // close the loop
        last.next = first;

        return { list: first, one: map[1] };
    }

    function run(current, moves)
    {
        for(let move = 0; move < moves; move++) {
            const v1 = current.next;
            const v2 = v1.next;
            const v3 = v2.next;

            let target = current.previous;
            while (target === v1 || target === v2 || target === v3)
            {
                target = target.previous;
            }

            current = current.next = v3.next;

            v3.next = target.next;
            target.next = v1;
        }
    }

    function part1()
    {
        const { list, one } = loadData(1);

        run(list, 100);

        let result = '';
        for(let o = one.next; o.value !== 1; o = o.next)
            result += o.value;

        return result;
    }

    function part2()
    {
        const { list, one } = loadData(2);

        run(list, 10000000);

        const cup1 = one.next.value;
        const cup2 = one.next.next.value;

        return cup1 * cup2;
    }

    console.log(`--- Advent of Code day ${DAY} ---`);

    if (!partToExecute || partToExecute === 1)
    {
        console.time(`${DAY}-part-1`);
        const p1 = part1();
        console.log(`Part 1: ${p1}`);
        console.timeEnd(`${DAY}-part-1`, `to execute part 1 of day ${DAY}`);
        if (partToExecute === 1)
            return p1;
    }

    if (!partToExecute || partToExecute === 2)
    {
        console.time(`${DAY}-part-2`);
        const p2 = part2();
        console.log(`Part 2: ${p2}`);
        console.timeEnd(`${DAY}-part-2`, `to execute part 2 of day ${DAY}`);
        if (partToExecute === 2)
            return p2;
    }
};
