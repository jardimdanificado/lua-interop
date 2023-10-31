import * as fs from 'fs';
import { PipeSession } from  '../potpiper.mjs';

const lua_repl = `
function executeLuaCode(code)
    local chunk, err = load(code)
    if chunk then
        local success, result = pcall(chunk)
        if success then
            return result
        else
            return "Error: " .. result
        end
    else
        return "Error: " .. err
    end
end

print('ready') -- this is a signal to the nodejs side that the lua side is ready to receive commands

while true do
    
    local command = io.read()
    local result = executeLuaCode(command or 'os.exit()')
    io.flush()
end

`
if (fs.existsSync('lua_repl.lua')) 
{    
    fs.unlinkSync('lua_repl.lua');
}
fs.writeFileSync('lua_repl.lua', lua_repl);

const lua0 = new PipeSession('luajit',['lua_repl.lua']);
const lua1 = new PipeSession('luajit',['lua_repl.lua']);

lua0.setDefaultTimeout(1000);

let teste = lua0.call(`
-- in a call the string is read
print('exampleprinter', 'just a call')
print('exampleprinter', 'just a call')

print('exampleprinter', 'just a call')

print('done') -- in a call the last command must be a print to signal the nodejs side that the call is done


`,1000);

await lua0.send(lua_repl);
await lua1.send(lua_repl);

let luaResults = [ lua1.send('print("hello world")'), lua0.send('print("hello world")'), teste];



const main = async ()=>
{
    // Use Promise.all para aguardar a conclusão de todas as Promises
    const allResults = await Promise.all(luaResults);
    console.log(allResults);
    lua0.close();
    lua1.close();
    fs.unlinkSync('lua_repl.lua');
}
main();
