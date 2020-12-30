export default function()
{
    Number.prototype.gcd = function(b)
    {
        let a = this.valueOf();
        if (a < b)
            [a, b] = [b, a];

        while (b !== 0)
        {
            let c = a % b;
            a = b;
            b = c;
        }
        return a;
    }

    Number.prototype.lcm = function(b)
    {
        let a = this;
        if (a < 0)
            a = -a;
        if (b < 0)
            b = -b;

        let g = a.gcd(b);
        let l = (a / g) * b;

        return l;
    }

    Number.prototype.modMul = function(value, modulo)
    {
        let r = this * value;
        if (r > Number.MAX_SAFE_INTEGER)
        {
            try
            {
                r = (BigInt(this) * BigInt(value)) % BigInt(modulo);
            }
            catch(error)
            {
                console.log(error);
            }
            r = Number(r);
        }
        else
        {
            if (r <= -modulo || r >= modulo)
                r %= modulo;
        }
        return r;
    }

    Number.prototype.modPow = function(exp, modulo)
    {
        if (modulo == 0)
            throw new Error("Cannot take modPow with modulus 0");

        let value = this;
        let r     = 1;
        let base  = value;
        if (base >= modulo || base <= -modulo)
            base %= modulo;

        if (base == 0)
            return 0;

        while (exp > 0)
        {
            if ((exp & 1) == 1)
            {
                r = r.modMul(base, modulo);
                exp--;
            }
            exp /= 2;
            base = base.modMul(base, modulo);
        }

        return r;
    };

    Number.prototype.modInv = function(modulo)
    {
        let t    = 0;
        let newT = 1;
        let r    = modulo;
        let newR = this;
        let q, lastT, lastR;

        if (newR < 0)
            newR = -newR;

        while (newR != 0)
        {
            q = Math.floor(r / newR);
            lastT = t;
            lastR = r;
            t = newT;
            r = newR;
            newT = lastT - q * newT;
            newR = lastR - q * newR;
        }
        if (r != 1)
            throw new Error(this.toString() + " and " + modulo.toString() + " are not co-prime");

        if (t < 0)
            t += modulo;

        if (modulo < 0)
            return -t;
        return t;
    };

    Number.prototype.modDiv = function(divisor, modulo)
    {
        if (divisor == 0)
            throw "Cannot divide by zero";
        if (modulo == 0)
            throw "Cannot take modDiv with modulus zero";

        divisor = divisor.modInv(modulo);
        let result = this.modMul(divisor, modulo);
        return result;
    };

    return Number;
}
