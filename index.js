const app = require('express')();
const osu = require('node-os-utils');
const fs = require('fs');
const cors = require('cors')({ orgin: '*' });
const port = process.argv[3] || 80;

app.use(cors);
app.get('/', (req, res) => res.send(fs.readFileSync('index.html', { encoding:'utf8' })));
app.get('/api', (req, res) => res.json({
    endpoints: [ '/cpu', '/ram', '/osi', ],
}));
app.get('/api/cpu', (req, res) => osu.cpu.usage().then(v => res.json(v)));
app.get('/api/ram', (req, res) => osu.mem.used().then(v => res.json(v)));
app.get('/api/osi', (req, res) => res.json({ 
    platform: osu.os.platform(),
    uptime: osu.os.uptime(),
    hostname: osu.os.hostname(),
}));
app.listen(port, () => console.log(`Server Online On Port ${port}`));
