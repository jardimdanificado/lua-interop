import { spawn } from 'child_process';

export function tolua(data) 
{
    return (`JSON.parse('${JSON.stringify(data)}')`);
};

export function fromlua(data) 
{
    return (`JSON.stringify(${data})`);
};

function advanceQueue(session)
{
    if (session.queue.length > 0) 
    {
        let currenttask = session.queue.shift();
        if (currenttask.timeout) 
        {
            session.task = session.eval(currenttask.command, currenttask.timeout);
            currenttask.resolve(session.task);
        }
        else
        {
            session.task = session.eval(currenttask.command);
            currenttask.resolve(session.task);
        }
    }
}

export class LuaSession 
{
    _callback = {};
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

    registerCallback(name, callback)
    {
        this._callback[name] = callback;
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
                        advanceQueue(this);
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
                        advanceQueue(this);
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
                        advanceQueue(this);
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
                        advanceQueue(this);
                    }
                }
                else if(str[0] == '<')
                {
                    this.childprocess.stdout.off('data', onDataHandler); // Remove o manipulador de eventos
                    try 
                    {
                        str = str.substring(1, str.length - 1);
                        str = str.split('>');
                        let funcname = str[0];
                        let args = str[1][0] == '{' ? JSON.parse(str[1]) : str[1];
                        this.busy = false;
                        this.task = null;
                        if (this.timeout) 
                        {
                            clearTimeout(this.timeout);
                            this.timeout = null;
                        }
                        //console.log(`Calling callback ${funcname} with args ${args}`);
                        resolve(this._callback[funcname](args ?? null) ?? 'returned nothing');
                        advanceQueue(this);
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
                        advanceQueue(this);
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
    call = async (funcname, args) =>
    {
        return this.eval(`call('${funcname}','${args}')`);
    }
    close = () => 
    {
        this.childprocess.stdin.end();
    }
}