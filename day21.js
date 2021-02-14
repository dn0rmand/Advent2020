import dataContent from './Data/day21.data';
import readFile from './advent_tools/readfile';

export default function dayBody(partToExecute)
{
    const DAY = 21;

    function loadData()
    {
        const input = {
            allergens:  {},
            ingredients: {},
            resolved: {},
        };

        for(const line of readFile(dataContent))
        {
            let [ingredients, allergens] = line.split(" (contains ");

            ingredients = ingredients.split(' ').reduce((a, i) => {
                i = i.trim();
                if (i)
                    a.push(i);
                return  a;
            }, []);

            ingredients.forEach(i => {
                i = i.trim();
                if (i) {
                    input.ingredients[i] = (input.ingredients[i] || 0) + 1;
                }
            });

            if (allergens) {
                allergens = allergens.substr(0, allergens.length-1).split(',');
                allergens = allergens.reduce((a, v) => {
                    v = v.trim();
                    if (!a)
                        a = v;
                    else if (v)
                        a = `${a}+${v}`;
                    return a;
                }, '');
                if (input.allergens[allergens]) {
                    ingredients = ingredients.filter(i1 => input.allergens[allergens].some(i2 => i1===i2));
                }
                input.allergens[allergens] = ingredients;

                allergens.split('+').forEach(allergen => {
                    allergen = allergen.trim();
                    if (!allergen)
                        return;
                    let oldValues = input.allergens[allergen];
                    if (! oldValues)
                        input.allergens[allergen] = ingredients;
                    else
                        input.allergens[allergen] = oldValues.filter(i1 => ingredients.some(i2 => i1 === i2));
                });
            }
        }

        return input;
    }

    function resolve(input)
    {
        const resolved = input.resolved;

        const allKeys = Object.keys(input.allergens);

        const multi = allKeys.filter(v => v.indexOf('+') >= 0);
        const single= allKeys.filter(v => v.indexOf('+') < 0);

        // get the already resolved ones.
        single.forEach(k => {
            if (input.allergens[k].length === 1) {
                resolved[input.allergens[k][0]] = k;
            };
        });

        while(true)
        {
            if (! single.some(k => input.allergens[k].length > 1))
            {
                // all resolved
                break;
            }
            // remove resolved from unresolved
            single.forEach(k => {
                if (input.allergens[k].length <= 1)
                    return;
                const values = input.allergens[k].filter(v => !resolved[v]);
                if (values.length === 1) {
                    resolved[values[0]] = k;
                }
                input.allergens[k] = values;
            });
            // process multi-keys
            multi.forEach(keys => {
                const all = input.allergens[keys];
                const allergens = keys.split('+');
                if (allergens.length === 1) throw "ERROR";
                for(const allergen of allergens) {
                    if (input.allergens[allergen].length === 1)
                        continue; // already resolved

                    // Find common ones
                    const values = input.allergens[allergen].filter(v1 => !resolved[v1] && all.some(v2 => v1 === v2));
                    input.allergens[allergen] = values;
                    if (values.length === 1) {
                        resolved[values[0]] = allergen;
                    }
                }
            });
        }

        return input;
    }

    function part1(input)
    {
        input = resolve(input);

        const okIngredients = Object.keys(input.ingredients).filter(k => ! input.resolved[k]);

        const answer = okIngredients.reduce((a, k) => a + input.ingredients[k], 0)
        return answer;
    }

    function part2(input)
    {
        let keys = Object.keys(input.resolved);
        if (keys.length === 0) {
            // part 1 not executed ...
            input = resolve(input);
            keys = Object.keys(input.resolved);
        }

        const riskList = keys.sort((a, b) => {
            const k1 = input.resolved[a];
            const k2 = input.resolved[b];

            if (k1 < k2)
                return -1;
            else if (k1 > k2)
                return 1;
            else
                return 0;
        });

        return riskList.join(',');
    }

    console.log(`--- Advent of Code day ${DAY} ---`);

    console.time(`${DAY}-loading`);
    const input = loadData();
    console.timeEnd(`${DAY}-loading`, `to load input of day ${DAY}`);

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
