module.exports = {
    $id: 'https://nighttime-imaging.eu/afgraphv1.schema.json',
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'AF Graph',
    type: 'object',
    
    allOf: [{
        '$ref': 'https://nighttime-imaging.eu/afgraph.schema.json'
    }]
}