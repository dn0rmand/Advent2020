import dataContent from './Data/day19.data';
import readFile from './advent_tools/readfile';

export default function dayBody(partToExecute) 
{
    const DAY = 19;

    class CharacterExpression
    {
        constructor(c)
        {
            this.character = c;
        }

        matches(_rules, message, position, callback)
        {
            if (message[position] === this.character)
            {
                callback(1);
            }
        }
    }

    class SingleRuleExpression
    {
        constructor(id)
        {
            this.id = id;
        }

        matches(rules, message, index, callback)
        {
            rules[this.id].matches(rules, message, index, callback);
        }
    }

    class MultiRulesExpression
    {
        constructor(subRules)
        {
            this.subRules = subRules;
        }

        matches(rules, message, index, callback)
        {
            const self = this;

            function inner(ruleIndex, position)
            {
                if (ruleIndex >= self.subRules.length)
                {
                    callback(position);
                    return;
                }
                const rule = self.subRules[ruleIndex];
                const expression = typeof(rule) === 'number' ? rules[rule] : rule;

                expression.matches(rules, message, index + position, pos => {
                    inner(ruleIndex+1, pos + position);
                });
            }

            inner(0, 0, callback);
        }
    }

    class ComplexRuleExpression
    {
        constructor(subRules)
        {
            this.subRules = subRules.map(r => {
                r = r.trim();
                const innerRules = r.split(' ').map(v => {
                    v = v.trim();
                    if (v[0] === '"')
                        return new CharacterExpression(v[1]);
                    else
                        return new SingleRuleExpression(+v);
                });
                if (innerRules.length > 1)
                    return new MultiRulesExpression(innerRules);
                else
                    return innerRules[0];
            });
        }

        matches(rules, message, index, callback)
        {
            for(const rule of this.subRules)
            {
                rule.matches(rules, message, index, callback);
            }
        }
    }

    function loadData()
    {
        const rules = [];
        const messages = [];

        for(const line of readFile(dataContent))
        {
            if (line.length === 0)
                continue;

            if (line[0] >= '0' && line[0] <= '9') 
            {
                const [ruleId, syntax] = line.split(':');
                const syntaxes = syntax.split('|').map(v => v.trim());

                let expression;

                if (syntaxes.length > 1) {
                    expression = new ComplexRuleExpression(syntaxes);
                } else if (syntaxes[0][0] === '"') {
                    expression = new CharacterExpression(syntaxes[0][1]);
                } else {                    
                    const ids = syntaxes[0].split(' ').map(i => +i);
                    
                    if (ids.length === 1) {
                        expression = new SingleRuleExpression(+(ids[0]));
                    } else {
                        expression = new MultiRulesExpression(ids);
                    }
                }

                rules[+ruleId] = expression;
            }
            else
            {
                messages.push(line);
            }
        }

        return { rules, messages };
    }

    function part1(input)
    {
        const rule0 = input.rules[0];

        let total = input.messages.reduce((a, message) => {
            rule0.matches(input.rules, message, 0, l => {
                if (l === message.length)
                {
                    a++
                }
            });

            return a;
        }, 0);

        return total;
    }

    function part2(input)
    {
        const rule0 = input.rules[0];
        const rule11 = new ComplexRuleExpression([
            '42 31', 
            '42 11 31',
        ]);

        const rule8 = new ComplexRuleExpression([
            '42', 
            '42 8',
        ]);

        input.rules[8] = rule8;
        input.rules[11]= rule11;

        let total = input.messages.reduce((a, message) => {
            rule0.matches(input.rules, message, 0, l => {
                if (l === message.length)
                    a++;
            });
            return a; 
        }, 0);

        return total;
    }

    console.log(`--- Advent of Code day ${DAY} ---`);

    console.time(`${DAY}-load`);
    const input = loadData();
    console.timeEnd(`${DAY}-load`);

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
