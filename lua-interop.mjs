/*
    DESCRIÇÃO GERADA POR INTELIGENCIA ARTIFICIAL!
    DESCRIÇÃO GERADA POR INTELIGENCIA ARTIFICIAL!
    DESCRIÇÃO GERADA POR INTELIGENCIA ARTIFICIAL!

    esse módulo não necessita de dependencias externas
    esse arquivo é um módulo javascript que permite a comunicação com o lua através de um child_process do nodejs e do protocolo de comunicação definido no arquivo lua-interop.lua
    para usar esse módulo, basta inicializar os git submodules(luatils), importar o arquivo lua-interop.lua no seu script lua e importar esse módulo no seu script javascript
    o módulo exporta duas classes: LuaSession e LuaSessionManager
    o módulo é feito para ser usado asincronamente, então todos os métodos retornam uma promise
    LuaSession é uma classe que representa uma sessão lua, ela é responsável por enviar comandos para o lua e receber respostas
    LuaSessionManager é uma classe que representa um gerenciador de sessões lua, ela é responsável por gerenciar várias sessões lua e distribuir os comandos entre elas
    LuaSessionManager é recomendado para aplicações que precisam de muitas sessões lua, como por exemplo, um servidor de um jogo multiplayer
    LuaSession é recomendado para aplicações que precisam de poucas sessões lua, como por exemplo, um bot de discord
    LuaSessionManager possui um método require que permite carregar bibliotecas lua em todas as sessões
    LuaSessionManager possui um método close que fecha todas as sessões
    LuaSession possui um método close que fecha a sessão
    LuaSessionManager e LuaSession possuem os métodos json, text e log que permitem enviar dados para o lua
    LuaSessionManager e LuaSession possuem o método eval que permite enviar comandos lua para o lua e receber respostas
    o módulo tambem exporta tolua e fromlua, que são funções que permitem converter dados entre lua e javascript
    tolua converte dados javascript para lua
    fromlua converte dados lua para javascript
    para usar essas funções, basta usar elas como se fossem uma função lua
    exemplo:
    const { tolua, fromlua } = require('./lua-interop.mjs');
    const data = { a: 1, b: 2 };
    const luaData = tolua(data);
    console.log(luaData); // { a: 1, b: 2 }
    const jsData = fromlua(luaData);
    console.log(jsData); // { a: 1, b: 2 }
    para usar o módulo, basta importar ele no seu script javascript
    exemplo:
    const { LuaSession, LuaSessionManager } = require('./lua-interop.mjs');
    const session = new LuaSession();
    session.eval('print("Hello World!")');
    session.close();

    USE O MÓDULO COM SABEDORIA!
    USE O ARQUIVO setup.sh PARA INSTALAR AS DEPENDENCIAS LUA!
    DEPENDENCIAS DO LUA: luatils

    DESCRIÇÃO GERADA POR INTELIGENCIA ARTIFICIAL!
    DESCRIÇÃO GERADA POR INTELIGENCIA ARTIFICIAL!
    DESCRIÇÃO GERADA POR INTELIGENCIA ARTIFICIAL!
*/

import { spawn } from 'child_process';

export function tolua(data) 
{
    return (`JSON.parse('${JSON.stringify(data)}')`);
};

export function fromlua(data) 
{
    return (`JSON.stringify(${data})`);
};

export class LuaSession 
{
    task = null;
    busy = false;
    timeout = null;
    queue = [];
    constructor(luaPath = 'luajit', luaEntryPoint = 'init.lua') 
    {
        this.childprocess = spawn(luaPath, [luaEntryPoint], { stdio: ['pipe', 'pipe', 'pipe'] });

        this.childprocess.stdout.on('data', (data) => 
        {
            //console.log(`Lua Output: ${data.toString()}`);
        });

        this.childprocess.stderr.on('data', (data) => 
        {
            console.error(`Lua Error: ${data.toString()}`);
        });

        this.childprocess.on('exit', (code) => 
        {
            console.log(`Lua process exited with code ${code}`);
        });
    }

    async advanceQueue()
    {
        if (this.queue.length > 0) 
        {
            let currenttask = this.queue.shift();
            if (currenttask.timeout) 
            {
                this.task = this.eval(currenttask.command, currenttask.timeout);
                currenttask.resolve(this.task);
            }
            else
            {
                this.task = this.eval(currenttask.command);
                currenttask.resolve(this.task);
            }
        }
    }

    async eval(command, timeout) 
    {
        if (this.busy) 
        {
            if (timeout) 
            {
                return new Promise((resolve, reject) => 
                {
                    this.queue.push({ command, timeout, resolve, reject});
                });
            }
            else 
            {
                return new Promise((resolve, reject) => 
                {
                    this.queue.push({ command, undefined, resolve, reject });
                });
            }
        }

        this.busy = true;
        this.task = new Promise((resolve, reject) => 
        {
            this.childprocess.stdin.write(command + '\n');

            const onDataHandler = (data) => 
            {
                let str = data.toString();
                if(str[0] == '!')
                {
                    this.childprocess.stdout.off('data', onDataHandler); // Remove o manipulador de eventos
                    try 
                    {
                        str = str.substring(1, str.length - 1);
                        this.busy = false;
                        this.task = null;
                        if (this.timeout) 
                        {
                            clearTimeout(this.timeout);
                            this.timeout = null;
                        }
                        resolve(JSON.parse(str));
                        this.advanceQueue();
                    } 
                    catch (error) 
                    {
                        this.busy = null;
                        this.task = null;
                        if (this.timeout) 
                        {
                            clearTimeout(this.timeout);
                            this.timeout = null;
                        }
                        reject(error);
                        this.advanceQueue();
                    }
                }
                else if(str[0] == '?')
                {
                    this.childprocess.stdout.off('data', onDataHandler); // Remove o manipulador de eventos
                    try
                    {
                        str = str.substring(1, str.length - 1);
                        this.busy = false;
                        this.task = null;
                        if (this.timeout) 
                        {
                            clearTimeout(this.timeout);
                            this.timeout = null;
                        }
                        resolve(str);
                        this.advanceQueue();
                    }
                    catch (error)
                    {
                        this.busy = null;
                        this.task = null;
                        if (this.timeout) 
                        {
                            clearTimeout(this.timeout);
                            this.timeout = null;
                        }
                        reject(error);
                        this.advanceQueue();
                    }
                }

                if(timeout)
                {
                    this.timeout = setTimeout(() =>
                    {
                        reject('Timeout');
                    }, timeout);
                }
            };
            this.childprocess.stdout.on('data', onDataHandler);
        });
        return this.task;
    }

    json = async (data) => 
    {
        return this.eval(`json(${data})`);
    }
    text = async (data) =>
    {
        return this.eval(`text('${data}')`);
    }
    log = async (data) =>
    {
        return this.eval(`log('${data}')`);
    }
    close = () => 
    {
        this.childprocess.stdin.end();
    }
}

export class LuaSessionManager
{
    sessions = [];
    libs = [];
    cleanerInterval = null;
    constructor(luaPath = 'luajit', luaEntryPoint = 'init.lua', sessionAmount = 1, libs = []) 
    {
        for (let i = 0; i < sessionAmount; i++) 
        {
            this.sessions.push(new LuaSession(luaPath, luaEntryPoint));
            for (const libname of libs) 
            {
                this.sessions[this.sessions.length - 1].eval(`require('${libname}');`);
            }
        }
        this.cleanerInterval = setInterval(() =>
        {
            for (let i = 0; i < this.sessions.length; i++) 
            {
                const session = this.sessions[i];
                if(session.busy == null)
                {
                    this.sessions[i] = new LuaSession(luaPath, luaEntryPoint);
                    for (const libname of this.libs) 
                    {
                        this.sessions[i].eval(`require('${libname}');`);
                    }
                }
            }
        }, 700);
    }

    require(libname)
    {
        this.libs.push(libname);
        for (const session of this.sessions) 
        {
            session.eval(`require('${libname}');`);
        }
    }
    close()
    {
        clearInterval(this.cleanerInterval);
        for (const session of this.sessions) 
        {
            session.close();
        }
    }
    async eval(command, timeout) 
    {
        let found = false;
        let session = this.sessions[0];
        for (const session_ of this.sessions) 
        {
            if(session_.busy == false)
            {
                found = true;
                session = session_;
                break;
            }
        }
        return (found ? session.eval(command, timeout) : new Promise((resolve, reject) =>
        {
            session.queue.push({ command, timeout, resolve, reject});
        }));
    }
    json = async (data) => 
    {
        return this.eval(`json(${data})`);
    }
    text = async (data) =>
    {
        return this.eval(`text('${data}')`);
    }
    log = async (data) =>
    {
        return this.eval(`log('${data}')`);
    }

}