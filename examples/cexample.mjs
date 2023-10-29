import { PipeSession } from '../potpiper.mjs';

const s = new PipeSession('./repl.exe');
const lua = new PipeSession('luajit', ['init.lua']);
let txt = await lua.eval('text("Hello World!")');
process.stdout.write(txt)
txt = await s.direct('print("Hello World!")')
process.stdout.write(txt)
await s.direct("exit")
s.close();
lua.close();