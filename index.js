#! /bin/node

const app = require('express')();
const osu = require('node-os-utils');
const fs = require('fs');
const cors = require('cors')({ orgin: '*' });
const port = 8500;

app.use(cors);
app.get('/', (req, res) => res.send(`
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta charset="utf-8">
    <title>PC Web Dash | Made By SX-9 On GitHub</title>
	  <style>
		body {
          font-family: monospace;
          color: green;
          background: black;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        h1 {
          margin: 0.3em;
        }
        legend {
          font-size: 1.5em;
        }
        div {
          width: 100vw;
          display: grid;
          grid-template-columns: 1fr 1fr ;
          grid-template-rows: 1fr 1fr;
          gap: 1em;
        }
        progress {
          width: 20rem;
        }
        @media screen and (max-width: 580px) {
          div {
            grid-template-rows: 1fr 1fr 1fr 1fr;
            grid-template-columns: 1fr;
          }
        }
    </style>
  </head>
  <body>
    <h1>PC Web Dash</h1>
    <p>Here Are PC Information For <span id="name">Unknown</span></p>
    <div>
      <fieldset>
        <legend>Platform</legend>
        <h1 id="os">Unknown</h1>
      </fieldset>
        <fieldset>
          <legend>Uptime</legend>
          <h1 id="uptime">0 Seconds</h1>
        </fieldset>
      <fieldset>
        <legend>CPU</legend>
        <progress id="cpu" value="0" max="100"></progress>
        <h1 id="cpu-read">0%</h1>
      </fieldset>
      <fieldset>
        <legend>RAM</legend>
        <progress id="ram" value="0" max="0"></progress>
        <h1><span id="ram-used">0</span>Mb / <span id="ram-max"></span>Mb</h1>
      </fieldset>
    </div>
    <p>Made By <a href="https://sx9.is-a.dev">sx9.is-a.dev</a></p>
	<script>
      fetch('/api/infos', {
        headers: {
          "Bypass-Tunnel-Reminder": "true"
        }
      }).then(res => res.json()).then(data => {
        document.querySelector('#name').innerText = data.name;
        document.querySelector('#os').innerText = data.os;
        document.querySelector('#ram').setAttribute('max', data.ram);
        document.querySelector('#ram-max').innerText = data.ram;
      });
      let stop = false;
	  setInterval(() => {
	    if (stop) return;
        fetch('/api/stats', {
          headers: {
            "Bypass-Tunnel-Reminder": "true"
          }
        }).then(res => res.json()).then(data => {
          document.querySelector('#cpu').value = data.cpu;
          document.querySelector('#ram').value = data.ram;
          document.querySelector('#ram-used').innerText = data.ram;
          document.querySelector('#cpu-read').innerText = data.cpu + '%';
          document.querySelector('#uptime').innerText = data.uptime;
        }).catch((e) => {
          document.querySelector('#cpu').value = 0;
          document.querySelector('#ram').value = 0;
          document.querySelector('#ram-used').innerText = 0;
          document.querySelector('#cpu-read').innerText = 0 + '%';
          document.querySelector('#uptime').innerText = 0;
          alert('ERROR: SERVER OFFLINE!')
          stop = true;
        });
      }, 500);
	</script>
  </body>
</html>
`));

app.get('/api', (req, res) => res.json({
    endpoints: [ '/infos', '/stats', ],
}));

app.get('/api/infos', async (req, res) => {
  let ram = await osu.mem.used();
  res.json({
    ram: ram.totalMemMb,
    name: osu.os.hostname(),
    os: osu.os.platform(),
  });
});

app.get('/api/stats', async (req, res) => {
  let ram = await osu.mem.used();
  res.json({
    ram: ram.usedMemMb,
    cpu: await osu.cpu.usage(),
    uptime: osu.os.uptime(),
  });
});

app.listen(port, () => console.log(`Server Online On Port ${port}`));
