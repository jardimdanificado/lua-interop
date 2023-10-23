-- mude esse comentario de acordo com suas necessidades
-- package.path = package.path .. debug.getinfo(1, "S").source:match("@(.*[\\/])") .. "?.lua;"
    
JSON = require("json")

local loadtext = function(path) -- settar local garante que a função não será acessada de fora do arquivo
    local file = io.open(path, "r")
    local contents = file:read("*all")
    file:close()
    return contents
end

local savetext = function(path, text) -- settar local garante que a função não será acessada de fora do arquivo
    local file = io.open(path, "w")
    file:write(text)
    file:close()
end

_print = print -- faz um backup da função print original

savetext('luaside_log.txt', '') -- limpa o arquivo de log

function json(data) -- função para enviar json para o lado do cliente
    _print('!' .. JSON.stringify(data))
    io.flush()
end

function text(data) -- função para enviar texto para o lado do cliente
    _print('?' .. data)
    io.flush();
end
print = text; -- substitui a função print original pela função say

function log(data,filename) -- função para salvar dados no arquivo de log
    filename = filename or 'luaside_log.txt'
    local file = loadtext(filename);
    savetext(filename, file .. '\n' .. data)
end

-- Função para executar comandos Lua
function executeLuaCode(code)
    log("executing: " .. code)
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

-- Loop principal
while true do
    local command = io.read()
    local result = executeLuaCode(command or 'os.exit()')
    io.flush()
end
