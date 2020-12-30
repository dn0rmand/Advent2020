import dataContent from './Data/day11.data';
import readFile from './advent_tools/readfile';

export default async function dayBody(partToExecute, render)
{
    const DAY = 11;

    function loadData()
    {
        const entries = [];

        for(const line of readFile(dataContent))
        {
            entries.push(line.split(''));
        }

        return entries;
    }

    async function doRender(width, height, state)
    {
        if (render) { 
          await render(width, height, (x, y) => {
            if (y < 0 || y >= height) {
              return 0;
            }

            switch(state[y][x]) {
              case 'L': return 'green';
              case '#': return 'red';
              default:  return 0;
            }
          });
        }
    }

    async function part1(state)
    {
        const height= state.length;
        const width = state[0].length;

        function countAdjacent(x, y)
        {
            function occupied(ox, oy)
            {
                ox += x;
                oy += y;
                if (ox < 0 || oy < 0 || ox >= width || oy >= height)
                    return 0;

                return state[oy][ox] === '#';
            }

            const count = occupied(-1,-1) +
                        occupied( 0,-1) +
                        occupied( 1,-1) +
                        occupied(-1, 0) +
                        occupied( 1, 0) +
                        occupied(-1, 1) +
                        occupied( 0, 1) +
                        occupied( 1, 1);

            return count;
        }

        let modified = true;
        let occupied = 0;

        while(modified)
        {
            await doRender(width, height, state);
            modified = false;
            occupied = 0;

            const newState = new Array(height);
            for(let y = 0; y < height; y++)
            {
                const source = state[y];
                const destin = new Array(width);

                for(let x = 0; x < width; x++)
                {
                    switch(source[x]) {
                        case '#':
                            if (countAdjacent(x, y) >= 4) {
                                destin[x] = 'L';
                                modified = true;
                            }
                            else {
                                destin[x] = '#';
                                occupied++;
                            }
                            break;

                        case 'L':
                            if (countAdjacent(x, y) === 0) {
                                destin[x] = '#';
                                modified = true;
                                occupied++;
                            }
                            else {
                                destin[x] = 'L';
                            }
                            break;

                        case '.':
                            destin[x] = '.';
                            break;
                    }
                }

                newState[y] = destin;
            }
            state = newState;
        }

        await doRender(width, height, state);

        return occupied;
    }

    async function part2(state)
    {
        const height= state.length;
        const width = state[0].length;

        function countVisible(x, y)
        {
            function seeOccupiedSeat(ox, oy)
            {
                while (true)
                {
                    x += ox;
                    y += oy;

                    if (x < 0 || x >= width || y < 0 || y >= height)
                        break;

                    const c = state[y][x];
                    if (c === '#')
                        return 1;
                    if (c !== '.')
                        break;
                }

                return 0;
            }

            let count = seeOccupiedSeat( 0, 1) +
                        seeOccupiedSeat( 0,-1) +
                        seeOccupiedSeat( 1, 0) +
                        seeOccupiedSeat(-1, 0) +
                        seeOccupiedSeat( 1, 1) +
                        seeOccupiedSeat( 1,-1) +
                        seeOccupiedSeat(-1, 1) +
                        seeOccupiedSeat(-1,-1);

            return count;
        }

        let modified = true;
        let occupied = 0;

        while(modified)
        {
            await doRender(width, height, state);

            modified = false;
            occupied = 0;

            const newState = new Array(height);
            for(let y = 0; y < height; y++)
            {
                const source = state[y];
                const destin = new Array(width);

                for(let x = 0; x < width; x++)
                {
                    switch(source[x]) {
                        case '#':
                            if (countVisible(x, y) >= 5) {
                                destin[x] = 'L';
                                modified = true;
                            }
                            else {
                                destin[x] = '#';
                                occupied++;
                            }
                            break;

                        case 'L':
                            if (countVisible(x, y) === 0) {
                                destin[x] = '#';
                                modified = true;
                                occupied++;
                            }
                            else {
                                destin[x] = 'L';
                            }
                            break;

                        case '.':
                            destin[x] = '.';
                            break;
                    }
                }

                newState[y] = destin;
            }
            state = newState;
        }

        await doRender(width, height, state);

        return occupied;
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
        const p2 = await part2(input);
        console.log(`Part 2: ${p2}`);
        console.timeLog(`${DAY}-part-2`, `to execute part 2 of day ${DAY}`);
        if (partToExecute === 2)
            return p2;
    }
};
