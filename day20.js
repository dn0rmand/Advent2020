import dataContent from './Data/day20.data';
import readFile from './advent_tools/readfile';

export default function dayBody(partToExecute)
{
    const DAY = 20;

    const IMAGE_SIZE = 10;

    const SEA_MONSTER = [
        '                  # ',
        '#    ##    ##    ###',
        ' #  #  #  #  #  #   ',
    ];
    const SEA_MONTER_SIZE = 15;

    const SEA_MONSTER_WIDTH = SEA_MONSTER[0].length;
    const SEA_MONSTER_HEIGHT= SEA_MONSTER.length;

    const $mirrors = [];
    function getMirror(value)
    {
        if ($mirrors[value])
            return $mirrors[value];

        let mirror = 0;
        for(let v = value, size = IMAGE_SIZE; size; size--)
        {
            mirror *= 2;
            if (v & 1) {
                mirror += 1;
                v -= 1;
            }
            v /= 2;
        }

        $mirrors[value] = mirror;

        return mirror;
    }

    class Image
    {
        constructor(id)
        {
            this.id   = id;
            this.data = [];
            this.possibleMatches = [];
            this.states = [
                { rotation: 0, flipped: false },
                { rotation: 1, flipped: false },
                { rotation: 2, flipped: false },
                { rotation: 3, flipped: false },

                { rotation: 0, flipped: true },
                { rotation: 1, flipped: true },
                { rotation: 2, flipped: true },
                { rotation: 3, flipped: true },
            ];
            this.state     = 0;
            this.imageSize = IMAGE_SIZE
        }

        get(x, y)
        {
            const { rotation, flipped } = this.states[this.state];
            if (flipped) {
                x = this.imageSize-1-x;
            }

            switch(rotation)
            {
                case 1: {
                    [x, y] = [this.imageSize - 1 - y, x];
                    break;
                }
                case 2:
                    x = this.imageSize - 1 - x;
                    y = this.imageSize - 1 - y;
                    break;
                case 3: {
                    [x, y] = [y, this.imageSize - 1 - x];
                    break;
                }
            }

            return this.data[y][x];
        }

        addRow(row)
        {
            if (! row)
                throw "Invalid data";

            if (row.length !== this.imageSize) {
                throw "Invalid row length";
            } else {
                this.data.push(row);
            }
        }

        analyze()
        {
            if (this.data.length !== this.imageSize) {
                throw 'Image not square';
            }

            this.top = 0;
            this.right = 0;
            this.bottom = 0;
            this.left = 0;

            for(let i = 0; i < this.imageSize; i++) {
                this.top   = (this.top   * 2) + (this.get(i, 0) === '#' ? 1 : 0);
                this.right = (this.right * 2) + (this.get(this.imageSize-1, i) === '#');
                this.bottom= (this.bottom* 2) + (this.get(this.imageSize-1-i, this.imageSize-1) === '#');
                this.left  = (this.left  * 2) + (this.get(0, this.imageSize-1-i) === '#');
            }
        }

        isPossibleMatch(image)
        {
            const canValueMatch = value => (
                value === image.top ||
                value === image.right ||
                value === image.bottom ||
                value === image.left);

            if (canValueMatch(getMirror(this.top)))
                return true;
            if (canValueMatch(getMirror(this.right)))
                return true;
            if (canValueMatch(getMirror(this.bottom)))
                return true;
            if (canValueMatch(getMirror(this.left)))
                return true;

            if (canValueMatch(this.top))
                return true;
            if (canValueMatch(this.right))
                return true;
            if (canValueMatch(this.bottom))
                return true;
            if (canValueMatch(this.left))
                return true;

            return false;
        }

        dump()
        {
            this.data.forEach(r => console.log(r));
            console.log('\n');
        }

        matchLeft(image)
        {
            for(let y = 0; y < this.imageSize; y++)
            {
                if (this.get(0, y) !== image.get(this.imageSize-1,y))
                    return false;
            }
            return true;
        }

        matchTop(image)
        {
            for(let x = 0; x < this.imageSize; x++)
            {
                if (this.get(x, 0) !== image.get(x, this.imageSize-1))
                    return false;
            }
            return true;
        }

        flipVertical(oldData)
        {
            const data = Array(this.imageSize);
            for(let y1 = 0, y2 = this.imageSize-1; y1 < y2; y1++, y2--)
            {
                data[y1] = oldData[y2];
                data[y2] = oldData[y1];
            }
            return data;
        }

        flipHorizontal(oldData)
        {
            const data = Array(this.imageSize);
            for(let y = 0; y < this.imageSize; y++)
            {
                data[y] = oldData[y].split('').reverse().join('');
            }
            return data;
        }

        rotate(oldData)
        {
            const data = Array(this.imageSize);
            for(let x = 0; x < this.imageSize; x++)
            {
                const row = Array(this.imageSize);
                for(let y = this.imageSize; y; y--)
                {
                    row[this.imageSize-y] = oldData[y-1][x];
                }
                data[x] = row.join('');
            }

            return data;
        }

        next()
        {
            this.state = (this.state+1) % this.states.length;
        }
    }

    function loadData()
    {
        const images = [];
        let currentImage = undefined;

        for(const line of readFile(dataContent))
        {
            if (line.length === 0) {
                if (currentImage)
                {
                    images.push(currentImage);
                    currentImage = undefined;
                }
            } else if (line.startsWith('Tile ')) {
                const id = line.substring(5, line.length-1);
                currentImage = new Image(+id);
            } else {
                if (! currentImage)
                    throw "ERROR";
                currentImage.addRow(line);
            }
        }
        if (currentImage)
            images.push(currentImage);

        return images;
    }

    function prepare(images)
    {
        images.forEach(image => image.analyze());

        for(let i = 0; i < images.length; i++)
        {
            const image1 = images[i];
            for(let j = i+1; j < images.length; j++) {
                const image2 = images[j];

                if (image1.isPossibleMatch(image2)) {
                    image1.possibleMatches.push(image2);
                    image2.possibleMatches.push(image1);
                }
            }
        }

        images.sort((a, b) => a.possibleMatches.length - b.possibleMatches.length);

        if (images[0].possibleMatches.length < 2)
            throw "NOT SOLVABLE";

        return images;
    }

    function part1(images)
    {
        images = prepare(images);

        const corners = images.filter(img => img.possibleMatches.length === 2);
        if (corners.length === 4) {
            return corners.reduce((a, i) => a * i.id, 1);
        }
        return 0;
    }

    function generateImage(images)
    {
        // const images = prepare();

        const SIZE = Math.sqrt(images.length);
        if (SIZE !== Math.floor(SIZE))
            throw "Invalid number of images";

        const fullImage = Array(SIZE).fill(0).map(r => Array(SIZE));

        const used = [];

        // Fill diagonaly

        const positions = (function() {
            const pos = [];
            for(let Y = 0; Y < SIZE; Y++)
            {
                for(let y = Y, x = 0; y >= 0 && x < SIZE; x++, y--) {
                    pos.push({x, y});
                }
            }
            for(let X = 1; X < SIZE; X++) {
                for(let y = SIZE-1, x = X; y >= 0 && x < SIZE; x++, y--) {
                    pos.push({x, y});
                }
            }
            if (pos.length != SIZE*SIZE)
                throw "ERROR";
            return pos;
        })();

        //

        function search(pos, possibleMatches)
        {
            if (pos >= positions.length)
                return true;

            const { x, y } = positions[pos];

            possibleMatches = possibleMatches.filter(img => !used[img.id]);
            let left, top;

            if (x > 0) {
                left = fullImage[y][x-1];
                possibleMatches = possibleMatches.filter(img1 => left.possibleMatches.some(img2 => img1.id === img2.id));
            }
            if (y > 0) {
                top = fullImage[y-1][x];
                possibleMatches = possibleMatches.filter(img1 => top.possibleMatches.some(img2 => img1.id === img2.id));
            }

            for(const image of possibleMatches)
            {
                for(let i = 0; i < image.states.length; i++)
                {
                    if ((!left || image.matchLeft(left)) && (!top || image.matchTop(top)))
                    {
                        used[image.id] = true;
                        fullImage[y][x] = image;
                        if (search(pos+1, images))
                        {
                            return true;
                        }
                        fullImage[y][x] = undefined;
                        used[image.id] = false;
                    }
                    image.next();
                }
            }

            return false;
        }

        const corners = images.filter(img => img.possibleMatches.length === 2);

        if (! search(0, corners))
            throw "Can't do it :(";

        // Now generate the big image

        const PICTURE_SIZE = SIZE*(IMAGE_SIZE-2)
        const picture = Array(PICTURE_SIZE).fill(0).map(r => Array(PICTURE_SIZE).fill('.'));

        for(let y = 0, yp = 0; y < SIZE; y++, yp += IMAGE_SIZE-2) {
            for(let x = 0, xp = 0; x < SIZE; x++, xp += IMAGE_SIZE-2) {
                const image = fullImage[y][x];

                for(let y = 0; y < IMAGE_SIZE-2; y++)
                for(let x = 0; x < IMAGE_SIZE-2; x++)
                    picture[yp+y][xp+x] = image.get(x+1, y+1);
            }
        }

        return picture.map(r => r.join(''));
    }

    function countSeaMonster(picture)
    {
        function matches(x, y)
        {
            for(let ox = 0; ox < SEA_MONSTER_WIDTH; ox++)
            for(let oy = 0; oy < SEA_MONSTER_HEIGHT; oy++)
            {
                if (SEA_MONSTER[oy][ox] === ' ')
                    continue; // ignore spaces
                if (picture.get(x+ox, y+oy) !== '#')
                    return false;
            }

            return true;
        }

        let total = 0;

        for(let x = 0; x+SEA_MONSTER_WIDTH < picture.imageSize; x++)
        {
            for(let y = 0; y+SEA_MONSTER_HEIGHT < picture.imageSize; y++)
            {
                if (matches(x, y))
                {
                    total++;
                }
            }
        }

        return total;
    }

    function part2(images)
    {
        const picture = new Image(0);

        picture.data = generateImage(images);
        picture.imageSize = picture.data.length;

        let total = 0;
        for(let i = 0; i < picture.states.length; i++)
        {
            total = countSeaMonster(picture);
            if (total)
                break;

            picture.next();
        }

        const roughness = picture.data.reduce((a, r) => {
            for(const c of r) {
                if (c === '#') {
                    a++;
                }
            }
            return a;
        }, 0);

        const answer = roughness - total*SEA_MONTER_SIZE;
        return answer;
    }

    console.log(`--- Advent of Code day ${DAY} ---`);

    console.time(`${DAY}-loading`);
    const input = loadData();
    console.timeEnd(`${DAY}-loading`, `to load the input of day ${DAY}`);

    // Part 1 always needs to run to help part 2
    console.time(`${DAY}-part-1`);
    const p1 = part1(input);
    console.log(`Part 1: ${p1}`);
    console.timeEnd(`${DAY}-part-1`, `to execute part 1 of day ${DAY}`);
    if (partToExecute === 1)
        return p1;

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
