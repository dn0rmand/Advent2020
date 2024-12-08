import dataContent from './Data/day24.data';
import readFile from './advent_tools/readfile';

export default async function dayBody(partToExecute, renderer)
{
    const DAY = 24;

    const DIRECTIONS = {
        e:  { x:  10, y:  0 },
        se: { x:   5, y:  5 },
        sw: { x:  -5, y:  5 },
        w:  { x: -10, y:  0 },
        nw: { x:  -5, y: -5 },
        ne: { x:   5, y: -5 },
    }

    const KEY_SIZE = 1000;
    const MAKE_KEY = (X, Y) => ((Math.abs(X) * KEY_SIZE + Math.abs(Y)) * 4) + (X < 0 ? 1 : 0) + (Y < 0 ? 2 : 0);

    function loadData()
    {
        const entries = [];

        for(const line of readFile(dataContent))
        {
            const directions = [];
            for(let i = 0; i < line.length; i++) {
                switch (line[i]) {
                    case 'e': 
                        directions.push(DIRECTIONS.e);
                        break;
                        
                    case 'w':
                        directions.push(DIRECTIONS.w);
                        break;
                        
                    case 's':
                        if (line[i+1] === 'e')
                            directions.push(DIRECTIONS.se);
                        else if (line[i+1] === 'w')
                            directions.push(DIRECTIONS.sw);
                        else
                            throw "Invalid direction";
                        i++;
                        break;

                    case 'n':
                        if (line[i+1] === 'e')
                            directions.push(DIRECTIONS.ne);
                        else if (line[i+1] === 'w')
                            directions.push(DIRECTIONS.nw);
                        else
                            throw "Invalid direction";
                        i++;
                        break;

                    default:
                        throw "Invalid direction";
                }
            }

            entries.push(directions);
        }

        return entries;
    }

    async function doRender(tiles)
    {
        if (renderer) { 
          let minX = Number.MAX_SAFE_INTEGER, 
              maxX = Number.MIN_SAFE_INTEGER, 
              minY = Number.MAX_SAFE_INTEGER, 
              maxY = Number.MIN_SAFE_INTEGER;

          tiles.forEach(({X, Y}) => {
            minX = Math.min(X, minX);
            maxX = Math.max(X, maxX);
            minY = Math.min(Y, minY);
            maxY = Math.max(Y, maxY);
          });

          await renderer.prepare(minX, minY, maxX, maxY);

          tiles.forEach(({X, Y}) => renderer.plot(X, Y, 'white'));

          await renderer.present();
        }
    }

    function process(tiles)
    {
        const neighbours = new Map();

        tiles.forEach(({X, Y}) => {
            for(const key in DIRECTIONS) {
                const direction = DIRECTIONS[key];
                const xx = X + direction.x;
                const yy = Y + direction.y;

                const k = MAKE_KEY(xx, yy);

                const neighbour = neighbours.get(k);
                if (neighbour) {
                    neighbour.count++;
                } else {
                    neighbours.set(k, { 
                        X: xx, 
                        Y: yy, 
                        count: 1,
                        black: tiles.has(k),
                    });
                }
            }
        });

        tiles.clear();

        neighbours.forEach((tile, key) => {
            if (tile.black) {
                if (tile.count > 0 && tile.count <= 2) {
                    tiles.set(key, tile);
                }
            } else if (tile.count === 2) {
                tiles.set(key, tile);
            }
        });

        return tiles;
    }

    function initialize()
    {
        const input = loadData();
        
        const tiles = new Map();

        for(const directions of input) 
        {
            let X = 0, Y = 0;

            for(const { x, y } of directions) 
            {
                X += x;
                Y += y;
            }

            const key = MAKE_KEY(X, Y);

            if (tiles.has(key)) {
                tiles.delete(key);
            } else {
                tiles.set(key, { X, Y });
            }
        }

        return tiles;
    }

    async function part1()
    {
        const tiles = initialize();

        await doRender(tiles);

        return { tiles, count: tiles.size };
    }

    async function part2(tiles)
    {
        for(let day = 0; day < 100; day++) {
            tiles = process(tiles);
            await doRender(tiles);
        }

        return tiles.size;
    }

    console.log(`--- Advent of Code day ${DAY} ---`);

    console.time(`${DAY}-part-1`);
    
    const { tiles, count } = await part1();

    console.log(`Part 1: ${ count }`);
    console.timeEnd(`${DAY}-part-1`, `to execute part 1 of day ${DAY}`);

    if (partToExecute === 1)
      return count;

    if (!partToExecute || partToExecute === 2)
    {
        console.time(`${DAY}-part-2`);
        const p2 = await part2(tiles);
        console.log(`Part 2: ${p2}`);
        console.timeEnd(`${DAY}-part-2`, `to execute part 2 of day ${DAY}`);
        if (partToExecute === 2)
            return p2;
    }
};
