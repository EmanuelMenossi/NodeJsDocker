const express = require('express')
const os = require('os')
const app = express()

app.get('/', (req, res) => {
    return res
        .status(200)
        .json({
            message: "ON",
        });
});

app.get('/liveness', (req, res) => {
    return res
        .status(200)
        .json({
            message: "Meu servidor está vivo!",
            path: process.cwd(),
            gid: process.getgid ? process.getgid() : null,
            uid: process.getuid ? process.getuid() : null,
            date: new Date().getTime()
        });
});

app.get('/readiness', (req, res) => {
    return res
        .status(200)
        .json({
            message: "Meu servidor está pronto para receber requisições!",
            platform: os.platform(),
            freemem: os.freemem(),
            homedir: os.homedir(),
            date: new Date().getTime()
         })
    })

    app.get('/consulta-dados', (req, res) => {
        return res
            .status(200)
            .json({
                message: "Meu servidor está pronto para receber requisições!",
                platform: os.platform(),
                freemem: os.freemem(),
                homedir: os.homedir(),
                date: new Date().getTime()
             })
        })
    
    
    


module.exports = app