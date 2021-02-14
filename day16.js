import dataContent from './Data/day16.data';
import readFile from './advent_tools/readfile';

export default function dayBody(partToExecute)
{
    const DAY = 16;

    class Rule
    {
        constructor(min, max)
        {
            this.min = +min;
            this.max = +max;
        }

        valid(v)
        {
            return v >= this.min && v <= this.max;
        }
    }

    class Field
    {
        constructor(line)
        {
            const vs = line.split(':');

            this.name = vs[0].trim();
            this.rules= [];
            this.positions = [];

            for(const r of vs[1].split(' or '))
            {
                const values = r.split('-');
                const rule = new Rule(values[0], values[1]);
                this.rules.push(rule);
            }
        }

        get position()
        {
            if (this.positions.length === 1)
                return this.positions[0];

            return -1;
        }

        valid(value)
        {
            return this.rules.some(rule => rule.valid(value));
        }

        invalid(value)
        {
            return ! this.valid(value);
        }
    }

    class Ticket
    {
        constructor(line)
        {
            this.values = line.split(',').map(v => +v);
        }

        errorRate(fields)
        {
            let rate = 0;
            for(const value of this.values) {
                if (! fields.some(field => field.valid(value))) {
                    rate += value;
                }
            }
            return rate;
        }

        invalid(fields)
        {
            for(const value of this.values) {
                if (! fields.some(field => field.valid(value))) {
                    return true;
                }
            }
            return false;
        }
    }

    function loadData()
    {
        const input = {
            fields: [],
            myTicket: undefined,
            tickets: [],
        };

        let state = 1;

        for(const line of readFile(dataContent))
        {
            if (line.trim().length === 0)
                continue;

            if (line === 'your ticket:') {
                state = 2;
            } else if (line === 'nearby tickets:') {
                state = 3;
            }
            else if (state === 1) {
                input.fields.push(new Field(line));
            } else if (state === 2) {
                if (input.myTicket) {
                    throw "my ticket already defined";
                }
                input.myTicket = new Ticket(line);
            } else if (state === 3) {
                input.tickets.push(new Ticket(line));
            }
        }

        return input;
    }

    function part1(input)
    {
        let answer = 0;
        for(const ticket of input.tickets)
        {
            answer += ticket.errorRate(input.fields);
        }
        return answer;
    }

    function part2(data)
    {
        const tickets = data.tickets.filter(ticket => !ticket.invalid(data.fields));

        tickets.push(data.myTicket);

        const positions = data.fields.length;

        for(const field of data.fields) {
            for(let position = 0; position < positions; position++) {
                if (! tickets.some(ticket => field.invalid(ticket.values[position]))) {
                    field.positions.push(position);
                }
            }
            if (field.positions.length === 0) {
                throw "Can't solve";
            }
        }

        let fields = data.fields;
        while(fields.length > 0)
        {
            if (fields.some(field => field.positions.length === 0)) {
                throw "Not solvable";
            }

            const singlePositions = fields.filter(field => field.positions.length === 1);
            fields = fields.filter(field => field.positions.length > 1);
            for(const field of singlePositions)
            {
                for(const field2 of fields.filter(f => f.positions.includes(field.position))) {
                    // remove found position
                    field2.positions = field2.positions.filter(p => p !== field.position);
                }
            }
        }

        // Calculate Answer

        let answer = 1;
        for(const field of data.fields) {
            if(field.name.indexOf('departure') >= 0) {
                answer *= data.myTicket.values[field.position];
            }
        }
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