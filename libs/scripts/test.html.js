var http = require('http');
const fs = require('fs');
var os = require('os');

bootstrap();

async function bootstrap() {
  const host = os.hostname();
  let port = await getNextOpenPort(8080);
  http
    .createServer(async function (req, res) {
      const fileName = 'test.html';
      const rta = {
        statusCode: 404,
        html: `<html><body>File "html/${fileName}" not found</body></html>`,
      };
      const html = readHtml(`html/${fileName}`);
      if (!!html) {
        rta.statusCode = 200;
        rta.html = html;
      }
      res.writeHead(rta.statusCode, { 'Content-Type': 'text/html' });
      res.end(rta.html);
    })
    .listen(port);
  console.log(`Already http://${host}:${port}`);
}

function readHtml(fileName) {
  try {
    const path = `${__dirname}/${fileName}`;
    const data = fs.readFileSync(path, 'utf8');
    return data;
  } catch (err) {
    console.error('\nERROR\n', err);
    return null;
  }
}

async function isPortOpen(port) {
  return new Promise((resolve, reject) => {
    let s = http.createServer();
    s.once('error', (err) => {
      s.close();
      if (err['code'] == 'EADDRINUSE') {
        resolve(false);
      } else {
        resolve(false);
        // reject(err);
      }
    });
    s.once('listening', () => {
      resolve(true);
      s.close();
    });
    s.listen(port);
  });
}

async function getNextOpenPort(startFrom = 8080) {
  let openPort = null;
  while (startFrom < 65535 || !!openPort) {
    if (await isPortOpen(startFrom)) {
      openPort = startFrom;
      break;
    }
    startFrom++;
  }
  return openPort;
}
