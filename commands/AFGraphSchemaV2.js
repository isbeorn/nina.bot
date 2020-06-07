module.exports = {
    $id: 'https://nighttime-imaging.eu/afgraphv2.schema.json',
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'AF Graph',
    type: 'object',

    allOf: [{
        '$ref': 'https://nighttime-imaging.eu/afgraph.schema.json'
    }],

    properties: {
        Fittings: {
            type: 'object',
            properties: {
                Quadratic: {
                    type: 'string'
                },
                Hyperbolic: {
                    type: 'string'
                },
                Gaussian: {
                    type: 'string'
                },
                LeftTrend: {
                    type: 'string'
                },
                RightTrend: {
                    type: 'string'
                }
            },
            required: ['Quadratic', 'Hyperbolic', 'Gaussian', 'LeftTrend', 'RightTrend']
        }
    },
    required: ['Version', 'Filter', 'Fittings']
}