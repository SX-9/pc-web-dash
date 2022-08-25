const app = require('express')();
const osu = require('node-os-utils');
const cors = require('cors')({ orgin: '*' });
const port = process.argv[3] || 80;

app.use(cors);
app.get('/cpu', (req, res) => osu.cpu.usage().then(v => res.json(v)));
app.get('/ram', (req, res) => osu.mem.used().then(v => res.json(v)));
app.get('/osi', (req, res) => res.json({ 
    platform: osu.os.platform(),
    uptime: osu.os.uptime(),
    hostname: osu.os.hostname(),
}));
app.listen(port, () => console.log(`Server Online On Port ${port}`));