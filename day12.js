import dataContent from './Data/day12.data';
import readFile from './advent_tools/readfile';

export default function dayBody(partToExecute)
{
    const DAY = 12;

    /*
            N
            |
        W ---+--- E
            |
            S
    */

    const DIRECTION_MODULO = 4

    const NORTH   = 0;
    const EAST    = 1;
    const SOUTH   = 2;
    const WEST    = 3;

    const LEFT    = 4;
    const RIGHT   = 5;

    const FORWARD = 6;

    const directions = [
        { dx: 0, dy: -1}, // NORTH
        { dx: 1, dy:  0}, // EAST
        { dx: 0, dy:  1}, // SOUTH
        { dx:-1, dy:  0}, // WEST
    ];

    function loadData()
    {
        const directionMap = {
            'F': FORWARD,
            'L': LEFT,
            'R': RIGHT,
            'N': NORTH,
            'S': SOUTH,
            'W': WEST,
            'E': EAST,
        };

        const entries = [];

        const simplify = ({ direction, distance }) =>
        {
            if (direction === LEFT || direction === RIGHT) {
                if (distance % 90 !== 0) {
                    throw "Invalid data";
                }
                distance %= 360;
                if (distance === 0) {
                    direction = LEFT;
                }
                else if (distance === 180) {
                    direction = LEFT;
                } else if (distance === 270) {
                    distance = 90;
                    direction = (direction === LEFT ? RIGHT : LEFT); // Switch direction
                } else if  (distance !== 90) {
                    throw "Invalid data";
                }
            }
            return { direction, distance };
        };

        const empty = { direction: -1, distance: 0 };
        let previous = empty;

        for(const line of readFile(dataContent))
        {
            let direction = directionMap[line[0]];
            let distance  = +(line.substr(1));

            if (distance === 0) {
                continue; // just in case
            }

            if (direction === LEFT || direction === RIGHT) {
                if (distance % 90 !== 0) {
                    throw "Invalid data";
                }
                distance %= 360;
                if (distance === 0) {
                    continue; // just in case
                }
                else if (distance === 180) {
                    direction = LEFT; //both directions the same
                } else if (distance === 270) {
                    distance = 90;
                    direction = (direction === LEFT ? RIGHT : LEFT); // Switch direction
                } else if  (distance !== 90) {
                    throw "Invalid data";
                }
            }

            if (previous.direction === direction)
            {
                // merge them :)
                previous.distance += distance;
                const newValue = simplify(previous);
                if (newValue.distance !== 0) {
                    previous.direction = newValue.direction;
                    previous.distance  = newValue.distance;
                } else {
                    entries.pop(); // remove it ... useless
                    previous = entries.length ? entries[entries.length-1] : empty;
                }
            }
            else {
                previous = { direction, distance };
                entries.push(previous);
            }
        }

        return entries;
    }

    function part1(input)
    {
        let X = 0, Y = 0, D = EAST;

        input.forEach(({ direction, distance }) => {
            switch(direction) {
                case RIGHT:
                    if (++D >= DIRECTION_MODULO)
                        D -= DIRECTION_MODULO;
                    break;
                case LEFT:
                    if(distance === 180) {
                        D = (D+2) % DIRECTION_MODULO
                    } else {
                        if (--D < 0) {
                            D += DIRECTION_MODULO;
                        }
                    }
                    break;
                case FORWARD: {
                    const { dx, dy } = directions[D];
                    X += dx * distance;
                    Y += dy * distance;
                    break;
                }
                default: {
                    const { dx, dy } = directions[direction];
                    X += dx * distance;
                    Y += dy * distance;
                    break;
                }
            }
        })

        return Math.abs(X) + Math.abs(Y);
    }

    function part2(input)
    {
        let X = 0, Y = 0;
        let WX = 10, WY = -1;

        input.forEach(({ direction, distance }) => {
            switch(direction) {
                case RIGHT: {
                    [WX, WY] = [-WY, WX];
                    break;
                }

                case LEFT:
                    if (distance === 180) {
                        WX = -WX;
                        WY = -WY;
                    } else {
                        [WX, WY] = [WY, -WX];
                    }
                    break;

                case FORWARD:
                    X += distance * WX;
                    Y += distance * WY;
                    break;

                default: {
                    const { dx, dy } = directions[direction];
                    WX += dx * distance;
                    WY += dy * distance;
                    break;
                }
            }
        });

        return Math.abs(X) + Math.abs(Y);
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
