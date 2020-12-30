export default function(dataContent)
{
    function *read()
    {
        const lines = dataContent.split('\n');

        for(let i = 0; i < lines.length; i++) {
            const l = lines[i].trim();
            if (l.length !== 0 || (i > 0 && i < lines.length-1)) {
              yield l;
            }
        }
    }

    return read();
}
