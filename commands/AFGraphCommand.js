const fetch = require('node-fetch');
const Ajv = require('ajv');
const fs = require('fs');
const _ = require('lodash');
const Discord = require('discord.js');
const BaseCommand = require('./BaseCommand');
const schema = require('./AFGraphSchema');

const { CanvasRenderService } = require('chartjs-node-canvas');

const width = 400;
const height = 300;
const chartCallback = (ChartJS) => {

    // Global config example: https://www.chartjs.org/docs/latest/configuration/
    ChartJS.defaults.global.elements.rectangle.borderWidth = 2;
    ChartJS.defaults.global.defaultColor = 'rgba(54, 162, 235, 1)';

    // Global plugin example: https://www.chartjs.org/docs/latest/developers/plugins.html
    ChartJS.plugins.register({
        // plugin implementation
        beforeDraw: function (chartInstance) {
            var ctx = chartInstance.chart.ctx;
            ctx.fillStyle = '#37393f';
            ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
        }
    });
    // New chart type example: https://www.chartjs.org/docs/latest/developers/charts.html
    ChartJS.controllers.MyType = ChartJS.DatasetController.extend({
        // chart implementation
    });
};

const validateSchema = json => {
    const ajv = new Ajv();
    return ajv.validate(schema, json);
}

const getChartConfig = () => {
    //see https://www.chartjs.org/docs/latest/charts/line.html
    const configuration = {
        type: 'line',
        data: {
            datasets: [
                {
                    labels: [],
                    label: 'Focus Points',
                    data: [],
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    fill: false,
                    pointRadius: 2,
                    pointBorderColor: 'transparent'
                },
                {
                    label: 'TrendLine Intersection',
                    data: [],
                    pointBackgroundColor: 'rgba(255, 159, 64, 1)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    fill: false,
                    pointRadius: 2,
                    pointBorderColor: 'transparent'
                },
                {
                    label: 'Quadratic Minimum',
                    data: [],
                    pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: false,
                    pointRadius: 2,
                    pointBorderColor: 'transparent'
                },
                {
                    label: 'Hyperbolic Minimum',
                    data: [],
                    pointBackgroundColor: 'rgba(153, 102, 255, 1)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    fill: false,
                    pointRadius: 2,
                    pointBorderColor: 'transparent'
                },
                {
                    label: 'Calculated Focus Point',
                    data: [],
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    fill: false,
                    pointRadius: 4,
                    pointBorderColor: 'transparent'
                }
            ]
        },
        options: {
            skipLabels: true,
            legend: {
                labels: {
                    fontColor: 'white'
                },
                position: 'bottom',
                align: 'start',
                fontSize: 8
            },
            scales: {
                yAxes: [{
                    type: 'linear',
                    position: 'left',
                    ticks: {
                        fontColor: 'white'
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'HFR'
                    }
                }],
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    ticks: {
                        fontColor: 'white'
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Position'
                    }
                }]
            }
        }
    };
    return configuration;
}


class AFGraphCommand extends BaseCommand {
    async process(message) {
        if (message.attachments.size > 0) {
            const attachment = message.attachments.first();
            if (attachment.filename.endsWith(".json")) {
                const response = await fetch(attachment.url, { method: 'Get' });
                const autoFocusData = await response.json();

                const valid = validateSchema(autoFocusData);

                if (valid) {
                    const canvasRenderService = new CanvasRenderService(width, height, chartCallback);

                    const sortedPoints = _.sortBy(autoFocusData.MeasurePoints, x => x.Position);

                    const configuration = getChartConfig();
                    sortedPoints.forEach(point => {
                        //configuration.data.labels.push(point.Position);
                        configuration.data.datasets[0].labels.push(point.Position);
                        configuration.data.datasets[0].data.push({
                            x: point.Position,
                            y: point.Value
                        });
                    });

                    const trend = autoFocusData.Intersections.TrendLineIntersection;
                    //configuration.data.labels.push(trend.Position);
                    configuration.data.datasets[1].data.push({
                        x: trend.Position,
                        y: trend.Value
                    });


                    const quadratic = autoFocusData.Intersections.QuadraticMinimum;
                    // configuration.data.labels.push(quadratic.Position);
                    configuration.data.datasets[2].data.push({
                        x: quadratic.Position,
                        y: quadratic.Value
                    });


                    const hyperbole = autoFocusData.Intersections.HyperbolicMinimum;
                    //configuration.data.labels.push(hyperbole.Position);
                    configuration.data.datasets[3].data.push({
                        x: hyperbole.Position,
                        y: hyperbole.Value
                    });


                    const focus = autoFocusData.CalculatedFocusPoint;
                    //configuration.data.labels.push(focus.Position);
                    configuration.data.datasets[4].data.push({
                        x: focus.Position,
                        y: focus.Value
                    });


                    const sortedArray = _(configuration.data.datasets[0].data.map(x => x.x))
                        .sort()
                        .sortedUniq()
                        .value();

                    let stepsize = 0;
                    if (sortedArray.length > 1) {
                        stepsize = sortedArray[1] - sortedArray[0];
                    }

                    const stream = canvasRenderService.renderToStream(configuration);
                    stream.pipe(fs.createWriteStream('output.png'));

                    await new Promise((res, rej) => {
                        stream.on('end', () => {
                            res();
                        });
                    });

                    const date = new Date(autoFocusData.Timestamp);
                    let temperature = "n.A.";
                    if (autoFocusData.Temperature !== "NaN") {
                        temperature = autoFocusData.Temperature.toFixed(2);
                    }
                    const embed = new Discord.RichEmbed();
                    embed.attachFile('./output.png')
                        .addField('Method', autoFocusData.Method, true)
                        .addField('Fitting', autoFocusData.Fitting, true)
                        .addField('Temperature', temperature, true)
                        .addField('Step Size', stepsize, true)
                        .addField('Calculated Focus Position', autoFocusData.CalculatedFocusPoint.Position, true);



                    await message.channel.send(embed);

                    fs.unlinkSync('output.png');
                } else {
                    console.log('Invalid schema for Auto Focus graph');
                }
            }

        }
    }
}

module.exports = AFGraphCommand;