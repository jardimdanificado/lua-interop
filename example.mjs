import { LuaSession, tolua, fromlua } from './lua-interop.mjs';

const lua0 = new LuaSession('luajit');
const lua1 = new LuaSession('luajit');

lua0.setDefaultTimeout(1000);

lua0.registerCallback('exampleprinter', (data) =>
{
    console.log(`Lua0: ${data}`);
});

lua0.registerCallback('simpleprinter', (data) =>
{
    return data;
});


const complexTestObject = {
    a: 1,
    b: 2,
    c: { a: 2, b: [1, 2, 3, 4, 5] }
};

let teste = lua0.call(`

call('exampleprinter', 'just a call')
call('exampleprinter', 'just a call')

call('exampleprinter', 'just a call')

text('done')


`,1000);

const luaOperations = [
    teste,
    lua0.json(tolua(complexTestObject)),
    lua1.eval('text("Operation 2 - lua0.eval")'),
    lua0.text('Operation 3 - lua0.text'),
    lua1.eval('text("Operation 4 - lua0.eval")'),
    lua0.text('Operation 5 - lua0.text'),
    lua1.json(tolua({ data: "Operation 6" })),
    lua0.json(tolua({ data: "Operation 7" })),
    lua1.json(tolua({ data: "Operation 8" })),
    lua0.json(tolua({ data: "Operation 9" })),
    lua1.json(tolua({ data: "Operation 10" })),
    lua0.json(tolua({ data: "Operation 11" })),
    lua1.json(tolua({ data: "Operation 12" })),
    lua0.json(tolua({ data: "Operation 13" })),
    lua1.json(tolua({ data: "Operation 14" })),
    lua0.json(tolua({ data: "Operation 15" })),
    lua1.eval('text("Operation 16 - lua0.eval")'),
    lua0.eval('text("Operation 17 - lua0.eval")'),
    lua1.text('Operation 18 - lua0.text'),
    lua0.eval('text("Operation 19 - lua0.eval")'),
    lua1.text('Operation 20 - lua0.text'),
    lua0.json(tolua({ data: "Operation 21" })),
    lua1.json(tolua({ data: "Operation 22" })),
    lua0.json(tolua({ data: "Operation 23" })),
    lua1.json(tolua({ data: "Operation 24" })),
    lua0.json(tolua({ data: "Operation 25" })),
];
let luaResults = [];
// Execute as operações em um loop
for (const operation of luaOperations) 
{
    luaResults.push(operation);
}

// Use Promise.all para aguardar a conclusão de todas as Promises
const allResults = await Promise.all(luaResults);

console.log(allResults);

lua0.close();
lua1.close();