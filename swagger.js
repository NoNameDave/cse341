const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: "Users API",
        description: "Users API Documentation",
    },
    host: "localhost:3000",
    schemes: ['http', 'https']
}

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./server.js');
});