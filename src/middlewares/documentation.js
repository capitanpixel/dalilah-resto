const yaml = require('js-yaml');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');

function loadSwaggerInfo(server) {
    try {
        const doc = yaml.load(fs.readFileSync('./src/spec.yaml', 'utf8'));
        server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(doc));
    } catch(e) {
        console.log(e);
    }
}

module.exports = {
    loadSwaggerInfo
}