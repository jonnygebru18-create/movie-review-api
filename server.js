const http = require('http');
const fs = require('fs');

const FILE = './movies.json';

const server = http.createServer((req, res) => {

    if (req.method === 'GET' && req.url === '/movies') {
        const data = fs.readFileSync(FILE);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
    }

    else if (req.method === 'GET' && req.url.startsWith('/movies/')) {
        const id = parseInt(req.url.split('/')[2]);

        const movies = JSON.parse(fs.readFileSync(FILE));
        const movie = movies.find(m => m.id === id);

        if (!movie) {
            res.statusCode = 404;
            return res.end("Movie not found");
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(movie));
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

    else if (req.method === 'DELETE' && req.url.startsWith('/movies/')) {
        const id = parseInt(req.url.split('/')[2]);

        let movies = JSON.parse(fs.readFileSync(FILE));
        const newMovies = movies.filter(m => m.id !== id);

        if (movies.length === newMovies.length) {
            res.statusCode = 404;
            return res.end("Movie not found");
        }

        fs.writeFileSync(FILE, JSON.stringify(newMovies, null, 2));

        res.end("Movie deleted");
    }

    else {
        res.statusCode = 404;
        res.end("Not Found");
    }
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});