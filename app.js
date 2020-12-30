import day1 from './day1.js'; //1
import day2 from './day2.js'; //2
import day3 from './day3.js'; //3
import day4 from './day4.js'; //4
import day5 from './day5.js'; //5
import day6 from './day6.js'; //6
import day7 from './day7.js'; //7
import day8 from './day8.js'; //8
import day9 from './day9.js'; //9
import day10 from './day10.js'; //10
import day11 from './day11.js'; //11
import day12 from './day12.js'; //12
import day13 from './day13.js'; //13
import day14 from './day14.js'; //14
import day15 from './day15.js'; //15
import day16 from './day16.js'; //16
import day17 from './day17.js'; //17
import day18 from './day18.js'; //18
import day19 from './day19.js'; //19
import day20 from './day20.js'; //20
import day21 from './day21.js'; //21
import day22 from './day22.js'; //22
import day23 from './day23.js'; //23
import day24 from './day24.js'; //24
import day25 from './day25.js'; //25

const advent2020_Days = [
  day1,
  day2,
  day3,
  day4,
  day5,
  day6,
  day7,
  day8,
  day9,
  day10,
  day11,
  day12,
  day13,
  day14,
  day15,
  day16,
  day17,
  day18,
  day19,
  day20,
  day21,
  day22,
  day23,
  day24,
  day25,
];

async function wait(ms) 
{
    return new Promise(resolve => { setTimeout(resolve, ms); });
}

window.execute = async function(day, part) 
{
    day = advent2020_Days[day-1];
    if (! day) {
        alert(`Day ${day} is not implemented yet`);
    } else {
        const button = window.event.target;
        const oldText = button.innerText;
        button.innerText = 'Calculating...';
        const card   = button.parentElement.parentElement;
        const part1  = card.getElementsByClassName(`part${part}`)[0];

        button.disabled = true;
        await wait(10);
        const result = await day(part);

        const small = part1.getElementsByTagName("small")[0];
        small.innerText = result;
        part1.className = `part${part}`; // removed the hiding class

        button.disabled  = false;
        button.innerText = oldText;
        button.blur();
    }
}

window.executeAll = async function(except) 
{
    except.disabled = true;
    except.innerText = 'Running...'
    await wait(10);
    const buttons = document.getElementsByTagName("button");
    
    for(const btn of buttons) {
        if (btn !== except) {
            btn.click();
            await wait(100);
        }
    }

    except.disabled = false;
    except.innerText = 'Run All';
    except.blur();
}

window.closeDialog = async function()
{
    const dlg = document.getElementById('visualizationModal');

    dlg.className = 'modal fade';
    await wait(100);
    dlg.style.display = 'none';
  }

window.openDialog = async function()
{
    const dlg = document.getElementById('visualizationModal');

    dlg.style.display = 'block';
    await wait(100);
    dlg.className = 'modal fade show';
    await wait(100);
}

let lastDay = -1;

window.visualize = async function(day, part)
{
    day = day || lastDay;
    lastDay = day;

    day = advent2020_Days[day-1];
    part = part || 1;

    if (! day) {
      alert(`Day ${day} is not implemented yet`);
    }

    await openDialog();

    const canvas = document.getElementById('visualizationCanvas');
    canvas.parentElement.style.padding = 0;
    const rect = canvas.parentElement.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height= rect.height;

    const context = canvas.getContext('2d');

    context.fillStyle = 'black';
    context.fillRect(0, 0, rect.width, rect.height);

    let doIt = false;

    await day(part, async (width, height, getState) => {
      doIt = ! doIt;
      if (!doIt) return;

      // context.fillStyle = 'black';
      // context.fillRect(0, 0, rect.width, rect.height);
  
      let sizeX = Math.floor(rect.width / width);
      let sizeY = Math.floor(rect.height / height);

      sizeX = sizeY = Math.min(sizeX, sizeY); // Squares

      const ox = Math.floor(rect.width - width * sizeX) / 2;
      const oy = Math.floor(rect.height - height * sizeY) / 2;
      
      for(let x = 0; x < width; x++)
      {
        for(let y = 0; y < height; y++)
        {
          const color = getState(x, y);
          if (color && color !== 'back') {
            context.fillStyle = color;
            context.fillRect(ox + x*sizeX, oy + y*sizeY, sizeX, sizeY);
          }
        }
      }
      await wait(100);
    });
}
