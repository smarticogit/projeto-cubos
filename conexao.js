const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'ec2-3-222-24-200.compute-1.amazonaws.com',
        user: 'kvzlxspdmfvsbn',
        port: 5432,
        password: '48226745a486d791801115e0d3618155ac5d852f700c77fe72d45f9a9a34cd16',
        database: 'damhk06pjjflqi',
        ssl: {
            rejectUnauthorized: false
        }
    }
});

module.exports = knex;
