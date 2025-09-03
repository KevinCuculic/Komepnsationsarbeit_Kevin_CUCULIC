// api/swagger.js
const swaggerSpec = {
    openapi: '3.0.0',
    info: {
        title: 'Cars API',
        version: '1.0.0',
        description: 'Simple CRUD API for the exercise.'
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
        schemas: {
            Car: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    brand: { type: 'string', example: 'Hyundai i30' },
                    horsepower: { type: 'integer', example: 110 },
                    hasClutch: { type: 'boolean', example: true }
                },
                required: ['brand', 'horsepower', 'hasClutch']
            },
            CarCreate: {
                type: 'object',
                properties: {
                    brand: { type: 'string' },
                    horsepower: { type: 'integer' },
                    hasClutch: { type: 'boolean' }
                },
                required: ['brand', 'horsepower', 'hasClutch']
            }
        }
    },
    paths: {
        '/api/cars': {
            get: {
                summary: 'List all cars',
                responses: {
                    200: {
                        description: 'Array of Car',
                        content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Car' } } } }
                    }
                }
            },
            post: {
                summary: 'Create a car',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/CarCreate' } } }
                },
                responses: {
                    201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Car' } } } },
                    200: { description: 'Created (OK also fine)', content: { 'application/json': { schema: { $ref: '#/components/schemas/Car' } } } }
                }
            }
        },
        '/api/cars/{id}': {
            put: {
                summary: 'Update a car',
                parameters: [
                    {
                        name: 'id', in: 'path', required: true,
                        schema: { type: 'integer' },
                        example: 2, // nur Vorbelegung – du kannst jede existierende ID eintippen
                        description: 'Use any existing id (see GET /api/resources).'
                    }
                ],
                requestBody: {
                    required: true,
                    // Du musst die id NICHT im Body mitsenden; der Pfad bestimmt sie bereits.
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/CarCreate' } } }
                },
                responses: {
                    200: { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Car' } } } },
                    404: { description: 'Not found' }
                }
            },
            delete: {
                summary: 'Delete a car',
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, example: 2 }
                ],
                responses: {
                    204: { description: 'Deleted (no content)' },
                    404: { description: 'Not found' }
                }
            }
        }
    }
};
module.exports = swaggerSpec;
