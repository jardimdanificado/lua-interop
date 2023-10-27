import { PipeSession } from '../potpiper.mjs';

const s = new PipeSession('./repl.exe');
const lua = new PipeSession('luajit', ['init.lua']);
let txt = await lua.eval('text("Hello World!")');
process.stdout.write(txt)
txt = await s.eval('print("Hello World!")')
process.stdout.write(txt)
s.close();
lua.close();