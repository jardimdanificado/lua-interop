import { spawn } from 'child_process';

function advanceQueue(session)
{
    if (session.queue.length > 0) 
    {
        let currenttask = session.queue.shift();
        if (currenttask.timeout) 
        {
            session.task = session.send(currenttask.command, currenttask.timeout);
            currenttask.resolve(session.task);
        }
        else
        {
            session.task = session.send(currenttask.command);
            currenttask.resolve(session.task);
        }
    }
}

export class PipeSession
{
    default_timeout = null;
    task = null;
    busy = false;
    timeout = null;
    queue = [];
    constructor(executablePath,args = []) 
    {
        this.childprocess = spawn(executablePath, args, { stdio: ['pipe', 'pipe', 'pipe'] });
        if (this.childprocess.pid) 
        {
            console.log('session ' + this.childprocess.pid + ' started');
        }
        else
        {
            console.log('could not start session');
            return 'ERROR';
        }
        
        this.childprocess.stderr.on('data', (data) => 
        {
            console.error(`ERROR: ${data.toString()}`);
        });

        this.childprocess.on('exit', (code) => 
        {
            console.log('session ' + this.childprocess.pid + ` exited with code ${code}`);
        });
    }

    setDefaultTimeout(timeout)
    {
        this.default_timeout = timeout;
    }

    async send(command, timeout) 
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
                let str = data.toString();
                this.childprocess.stdout.off('data', onDataHandler);
                try
                {
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
            };


            if(timeout)
            {
                this.timeout = setTimeout(() =>
                {
                    resolve(this.childprocess.pid + '_timed_out');
                    this.childprocess.stdout.off('data', onDataHandler); // Remove o manipulador de eventos
                    this.busy = false;
                    console.log('WARNING: session ' + this.childprocess.pid + ' has timed out');
                }, timeout);
            }
            
            this.childprocess.stdout.on('data', onDataHandler);
        });
        return this.task;
    }

    pass = async (data,timeout) =>
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
        splitted = splitted.filter(line => line.trim() !== '');
        
        for(let i = 0; i < splitted.length-1; i++)
        {
            this.send(splitted[i],timeout);
        }
        return this.send(splitted[splitted.length-1],timeout);
    }

    close = () => 
    {
        this.childprocess.stdin.end();
        this.childprocess.kill();
    }
}