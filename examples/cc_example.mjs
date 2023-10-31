import { PipeSession } from "../potpiper.mjs";

let c0 = new PipeSession('./cctest');
let c1 = new PipeSession('./cctest');

async function main()
{
    let results = await Promise.all([c0.send('teste1'), c1.send('testeteste')]);
    console.log(results);
    c0.close();
    c1.close();
}
main();