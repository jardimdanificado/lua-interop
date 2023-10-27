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

export class PipeSession
{
    _callback = {};
    default_timeout = null;
    task = null;
    busy = false;
    timeout = null;
    queue = [];
    constructor(executablePath = 'luajit',args = ['init.lua']) 
    {
        this.childprocess = spawn(executablePath, args, { stdio: ['pipe', 'pipe', 'pipe'] });

        this.childprocess.stdout.on('data', (data) => 
        {
            //console.log(`Lua Output: ${data.toString()}`);
        });

        this.childprocess.stderr.on('data', (data) => 
        {
            console.error(`Error: ${data.toString()}`);
        });

        this.childprocess.on('exit', (code) => 
        {
            console.log(`process exited with code ${code}`);
        });
    }

    setDefaultTimeout(timeout)
    {
        this.default_timeout = timeout;
    }

    registerCallback(name, callback)
    {
        this._callback[name] = callback;
    }

    async eval(command, timeout) 
    {
        timeout = timeout ?? this.default_timeout ?? null;
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
                //console.log(data.toString())
                //console.log('primeira letra=' + data.toString()[0])
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
                else if(str[0] == '$')
                {
                    this.childprocess.stdout.off('data', onDataHandler); // Remove o manipulador de eventos
                    try
                    {
                        str = str.substring(1, str.length - 1);
                        let splited = str.split('$#');
                        let name = splited[0];
                        let _data = splited[1][0] == '{' || splited[1][0] == '[' ? JSON.parse(splited[1]) : splited[1];
                        this.busy = false;
                        this.task = null;
                        if (this.timeout) 
                        {
                            clearTimeout(this.timeout);
                            this.timeout = null;
                        }
                        if(this._callback[name])
                            resolve(this._callback[name](_data));
                        else
                            resolve('function not found.');
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
                else
                {
                    this.childprocess.stdout.off('data', onDataHandler); // Remove o manipulador de eventos
                    try
                    {
                        //str = str.substring(1, str.length - 1);
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

                if(timeout)
                {
                    this.timeout = setTimeout(() =>
                    {
                        this.childprocess.stdout.off('data', onDataHandler); // Remove o manipulador de eventos
                        resolve('Timed out');
                    }, timeout);
                }
            };
            this.childprocess.stdout.on('data', onDataHandler);
        });
        return this.task;
    }


    json = async (data,timeout) => 
    {
        for(let i = 0; i < data.length; i++)
        {
            if(data[i] == '\n')
            {
                data = data.substring(0, i) + '\\n' + data.substring(i+1);
            }
        }
        return this.eval(`json(${data})`,timeout);
    }
    text = async (data,timeout) =>
    {
        for(let i = 0; i < data.length; i++)
        {
            if(data[i] == '\n')
            {
                data = data.substring(0, i) + '\\n' + data.substring(i+1);
            }
        }
        return this.eval(`text('${data}')`,timeout);
    }
    log = async (data,timeout) =>
    {
        for(let i = 0; i < data.length; i++)
        {
            if(data[i] == '\n')
            {
                data = data.substring(0, i) + '\\n' + data.substring(i+1);
            }
        }
        return this.eval(`log('${data}')`,timeout);
    }
    call = async (data,timeout) =>
    {
        let splitted = data.split('\n');
        for(const i in splitted)
        {
            if (splitted[i] == '') 
            {
                splitted.splice(i, 1);
            }
        }
        if(splitted[0] == '')
            splitted.splice(0,1);
        if(splitted[splitted.length-1] == '')
            splitted.splice(splitted.length-1,1);
        for(let i = 0; i < splitted.length-1; i++)
        {
            this.eval(splitted[i],timeout);
        }
        return this.eval(splitted[splitted.length-1],timeout);
    }
    close = () => 
    {
        this.childprocess.stdin.end();
    }
}