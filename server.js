const http = require('http');
const fs = require('fs');

const FILE = './movies.json';

const server = http.createServer((req, res) => {

    if (req.method === 'GET' && req.url === '/movies') {
        const data = fs.readFileSync(FILE);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
    }

    else if (req.method === 'POST' && req.url === '/movies') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            const newMovie = JSON.parse(body);

            const movies = JSON.parse(fs.readFileSync(FILE));
            newMovie.id = Date.now();

            movies.push(newMovie);

            fs.writeFileSync(FILE, JSON.stringify(movies, null, 2));

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newMovie));
        });
    }

    else {
        res.statusCode = 404;
        res.end("Not Found");
    }
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});