module.exports = {
    $id: 'https://nighttime-imaging.eu/afgraph.schema.json',
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'AF Graph',
    type: 'object',

    definitions: {
        point: {
            type: 'object',
            properties: {
                Position: {
                    type: 'number'
                },
                Value: {
                    type: 'number'
                },
                Error: {
                    type: 'number'
                }
            },
            required: ['Position', 'Value', 'Error']
        }
    },
    properties: {
        Filter: {
            type: 'string'
        },
        Temperature: {
            anyOf: [
                {
                    type: 'string',
                    enum: ['NaN']
                },
                {
                    type: 'number'
                }
            ]
        },

        Method: {
            type: 'string'
        },
        Fitting: {
            type: 'string'
        },
        CalculatedFocusPoint: {
            $ref: '#/definitions/point'
        },
        MeasurePoints: {
            type: 'array',
            items: {
                $ref: '#/definitions/point'
            }
        },
        Intersections: {
            type: 'object',
            properties: {
                TrendLineIntersection: {
                    $ref: '#/definitions/point'
                },
                HyperbolicMinimum: {
                    $ref: '#/definitions/point'
                },
                QuadraticMinimum: {
                    $ref: '#/definitions/point'
                },
                GaussianMaximum: {
                    $ref: '#/definitions/point'
                }
            },
            required: [
                'TrendLineIntersection',
                'HyperbolicMinimum',
                'QuadraticMinimum',
                'GaussianMaximum'
            ]
        }
    },
    required: [
        'Temperature',
        'Method',
        'Fitting',
        'CalculatedFocusPoint',
        'MeasurePoints',
        'Intersections'
    ]
};
