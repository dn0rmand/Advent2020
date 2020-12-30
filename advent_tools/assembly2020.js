import readFile from './readfile';

export class Instruction
{
    constructor(token, value)
    {
        this.token = token;
        this.value = value;
    }

    static parse(line)
    {
        const values = line.trim().split(' ');
        const token  = values[0].toLowerCase();
        const value  = +(values[values.length-1]);

        return Instruction.create(token, value);
    }

    static create(token, value)
    {
        switch(token) {
            case 'nop':
                return new NopInstruction(token, value);

            case 'acc':
                return new AccInstruction(token, value);

            case 'jmp':
                return new JmpInstruction(token, value);

            default:
                throw `Instruction "${token} ${value}" not supported`;
        }
    }

    execute(vm)
    {
        throw "Not Implemented";
    }
}

class NopInstruction extends Instruction
{
    constructor(token, value)
    {
        super(token, value);
    }

    execute(vm)
    {
        vm.ip += 1;
    }
}

class AccInstruction extends Instruction
{
    constructor(token, value)
    {
        super(token, value);
    }

    execute(vm)
    {
        vm.accumulator += this.value;
        vm.ip += 1;
    }
}

class JmpInstruction extends Instruction
{
    constructor(token, value)
    {
        super(token, value);
    }

    execute(vm)
    {
        vm.ip += this.value;
    }
}

export class VirtualMachine
{
    constructor(file)
    {
        this.instructions = [];
        this.accumulator  = 0;
        this.ip           = 0;

        if (typeof(file) === "string")
        {
            file = [...readFile(file)];
        }

        for(const line of file)
        {
            this.instructions.push(Instruction.parse(line));
        }
    }

    reset()
    {
        this.accumulator = 0;
        this.ip          = 0;
    }

    step()
    {
        if (this.ip < 0 || this.ip >= this.instructions.length)
        {
            throw "Invalid instruction pointer";
        }

        this.instructions[this.ip].execute(this);
    }

    execute()
    {
        while (this.ip >= 0 && this.ip < this.instructions.length)
        {
            this.step();
        }
    }
}
