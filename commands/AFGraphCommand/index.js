const fetch = require('node-fetch');
const Ajv = require('ajv');
const fs = require('fs');
const Discord = require('discord.js');
const mathjs = require('mathjs');
const _ = require('lodash');

const BaseCommand = require('../BaseCommand');

const baseSchema = require('./Schemas/AFGraphSchema');
const v1Schema = require('./Schemas/AFGraphSchemaV1');
const v2Schema = require('./Schemas/AFGraphSchemaV2');

const { AutoFocusReport } = require('./AutoFocusReport');

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
            ctx.fillRect(
                0,
                0,
                chartInstance.chart.width,
                chartInstance.chart.height
            );
        }
    });
    // New chart type example: https://www.chartjs.org/docs/latest/developers/charts.html
    ChartJS.controllers.MyType = ChartJS.DatasetController.extend({
        // chart implementation
    });
};

const validateV1Schema = (json) => {
    return validateSchema(v1Schema, json);
};

const validateV2Schema = (json) => {
    return validateSchema(v2Schema, json);
};

const validateSchema = (schema, json) => {
    const ajv = new Ajv();
    const validate = ajv.addSchema(baseSchema).compile(schema);
    return validate(json);
};

const getChartConfig = (yAxisLabel) => {
    //see https://www.chartjs.org/docs/latest/charts/line.html
    const configuration = {
        type: 'line',
        data: {
            datasets: []
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
                yAxes: [
                    {
                        type: 'linear',
                        position: 'left',
                        ticks: {
                            fontColor: 'white',
                            min: 0
                        },
                        scaleLabel: {
                            display: true,
                            labelString: yAxisLabel
                        }
                    }
                ],
                xAxes: [
                    {
                        type: 'linear',
                        position: 'bottom',
                        ticks: {
                            fontColor: 'white'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Position'
                        }
                    }
                ]
            }
        }
    };
    return configuration;
};

class AFGraphCommand extends BaseCommand {
    async process(message) {
        if (message.attachments.size > 0) {
            const attachment = message.attachments.first();
            if (attachment.attachment.endsWith('.json')) {
                const response = await fetch(attachment.url, { method: 'Get' });
                const autoFocusData = await response.json();

                const valid =
                    validateV1Schema(autoFocusData) ||
                    validateV2Schema(autoFocusData);

                if (valid) {
                    try {
                        const report = new AutoFocusReport(autoFocusData);

                        const config = this.generateGraphConfiguration(report);

                        await this.render(config);

                        const analysis = this.analyze(report);

                        await this.sendMessage(message, report, analysis);
                    } finally {
                        this.destroy();
                    }
                } else {
                    console.log('Invalid JSON for auto focus report');
                }
            }
        }
    }

    analyze(report) {
        const analysis = [];
        const measurePoints = report.MeasurePoints.map((p) => {
            return { x: p.Position, y: p.Value };
        });

        const hfrStdDev = mathjs.std(_.filter(measurePoints, x=> x.y > 0).map(x => x.y));
        if(hfrStdDev < 1) {
            analysis.push(`- Overall HFR change is low. This indicates that the step size might be too small`);
        } 

        const hasZeroStars = _.filter(measurePoints, x => x.y === 0).length > 0;        
        if(hasZeroStars) {
            analysis.push(`- Datapoints contain HFR values of 0. Stepsize might be too large and image getting too much out of focus or clouds prevented finding stars`);
        }

        return analysis;
    }

    async render(configuration) {
        const canvasRenderService = new CanvasRenderService(
            width,
            height,
            chartCallback
        );
        const stream = canvasRenderService.renderToStream(configuration);
        stream.pipe(fs.createWriteStream('output.png'));

        await new Promise((res) => {
            stream.on('end', () => {
                res();
            });
        });
    }

    async sendMessage(message, report, analysis) {
        const embed = new Discord.MessageEmbed();
        embed
            .attachFiles(['./output.png'])
            .addField('Method', report.Method, true)
            .addField('Fitting', report.Fitting, true)
            .addField('Temperature', report.Temperature, true)
            .addField('Step Size', report.StepSize, true)
            .addField(
                'Calculated Focus Position',
                report.FocusPoint.Position,
                true
            )
            .addField('Filter', report.Filter, true);
        
        if(analysis.length > 0) {
            embed.addField('Potential Issues', analysis.join('\n'));
        }

        await message.channel.send(embed);
    }

    destroy() {
        fs.unlinkSync('output.png');
    }

    generateGraphConfiguration(report) {
        const yAxisLabel = report.Method === 'STARHFR' ? 'HFR' : 'Contrast';
        const config = getChartConfig(yAxisLabel);

        const measurePoints = report.MeasurePoints.map((p) => {
            return { x: p.Position, y: p.Value };
        });

        config.data.datasets.push({
            label: 'Focus Points',
            pointBackgroundColor: 'rgba(255, 99, 132, 1)',
            borderColor: 'rgba(54, 162, 235, 1)',
            data: measurePoints,
            fill: false,
            pointRadius: 2,
            pointBorderColor: 'transparent'
        });

        if (report.Method === 'STARHFR') {
            let data = report.QuadraticFitting.getPoints(
                report.MinimumStep,
                report.MaximumStep
            );
            config.data.datasets.push({
                label: 'Quadratic',
                pointBackgroundColor:
                    data.length > 1 ? 'transparent' : 'rgba(75, 192, 192, 1)',
                borderColor: 'rgba(75, 192, 192, 1)',
                data: data,
                borderDash: [5, 5],
                borderWidth: 1,
                fill: false,
                pointRadius: 3,
                pointBorderColor: 'transparent'
            });

            data = report.HyperbolicFitting.getPoints(
                report.MinimumStep,
                report.MaximumStep
            );
            config.data.datasets.push({
                label: 'Hyperbolic',
                pointBackgroundColor:
                    data.length > 1 ? 'transparent' : 'rgba(153, 102, 255, 1)',
                borderColor: 'rgba(153, 102, 255, 1)',
                data: data,
                borderDash: [5, 5],
                borderWidth: 1,
                fill: false,
                pointRadius: 3,
                pointBorderColor: 'transparent'
            });

            data = [
                ...report.LeftTrendFitting.getPoints(
                    report.MinimumStep,
                    report.LeftTrendFitting.PointOfInterest.Position +
                        report.StepSize
                ),
                {
                    x: report.LeftTrendFitting.PointOfInterest.Position,
                    y: report.LeftTrendFitting.PointOfInterest.Value
                },
                ...report.RightTrendFitting.getPoints(
                    report.LeftTrendFitting.PointOfInterest.Position -
                        report.StepSize,
                    report.MaximumStep
                )
            ];
            config.data.datasets.push({
                label: 'Trendlines',
                pointBackgroundColor:
                    data.length > 1 ? 'transparent' : 'rgba(255, 159, 64, 1)',
                borderColor: 'rgba(255, 159, 64, 1)',
                data: data,
                borderDash: [2, 2],
                borderWidth: 1,
                lineTension: 0,
                fill: false,
                pointRadius: 3,
                pointBorderColor: 'transparent'
            });
        } else {
            const data = report.GaussianFitting.getPoints(
                report.MinimumStep,
                report.MaximumStep
            );
            config.data.datasets.push({
                label: 'Gaussian',
                pointBackgroundColor:
                    data.length > 1 ? 'transparent' : 'rgba(255, 159, 64, 1)',
                borderColor: 'rgba(255, 159, 64, 1)',
                data: report.GaussianFitting.getPoints(
                    report.MinimumStep,
                    report.MaximumStep
                ),
                borderDash: [5, 5],
                borderWidth: 1,
                fill: false,
                pointRadius: 2,
                pointBorderColor: 'transparent'
            });
        }

        config.data.datasets.push({
            label: 'Focus Position',
            pointBackgroundColor: 'rgba(255, 99, 132, 1)',
            borderColor: 'rgba(255, 99, 132, 1)',
            data: [
                {
                    x: report.FocusPoint.Position,
                    y: report.FocusPoint.Value
                }
            ],
            fill: false,
            pointRadius: 4,
            pointBorderColor: 'transparent'
        });

        return config;
    }
}

module.exports = AFGraphCommand;
