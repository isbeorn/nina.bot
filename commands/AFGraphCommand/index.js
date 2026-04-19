const Ajv = require('ajv');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const http = require('node:http');
const https = require('node:https');
const mathjs = require('mathjs');
const _ = require('lodash');

global.window = {
    addEventListener() {}
};

const BaseCommand = require('../BaseCommand');

const baseSchema = require('./Schemas/AFGraphSchema');
const v1Schema = require('./Schemas/AFGraphSchemaV1');
const v2Schema = require('./Schemas/AFGraphSchemaV2');

const { AutoFocusReport } = require('./AutoFocusReport');

const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const width = 400;
const height = 300;
const chartCallback = (ChartJS) => {
    ChartJS.defaults.color = 'rgba(54, 162, 235, 1)';
    ChartJS.register(
        {
            id: 'customCanvasBackgroundColor',
            beforeDraw(chart) {
                const { ctx, width: chartWidth, height: chartHeight } = chart;
                ctx.save();
                ctx.fillStyle = '#37393f';
                ctx.fillRect(0, 0, chartWidth, chartHeight);
                ctx.restore();
            }
        },
        {
            id: 'measurePointOrderLabels',
            afterDatasetsDraw(chart, args, pluginOptions) {
                if (!pluginOptions || !pluginOptions.display) {
                    return;
                }

                const datasetIndex = chart.data.datasets.findIndex(
                    (dataset) => dataset.label === 'Focus Points'
                );
                if (datasetIndex === -1) {
                    return;
                }

                const dataset = chart.data.datasets[datasetIndex];
                const meta = chart.getDatasetMeta(datasetIndex);
                const { chartArea, ctx } = chart;

                ctx.save();
                ctx.font = 'bold 10px sans-serif';
                ctx.textBaseline = 'middle';
                ctx.lineWidth = 3;
                ctx.strokeStyle = '#37393f';
                ctx.fillStyle = 'white';

                meta.data.forEach((element, index) => {
                    const point = dataset.data[index];
                    const label = (point.order || index + 1).toString();
                    const position = element.tooltipPosition();
                    const x = Math.min(
                        Math.max(position.x + 5, chartArea.left + 4),
                        chartArea.right - ctx.measureText(label).width - 4
                    );
                    const y = Math.min(
                        Math.max(position.y - 9, chartArea.top + 6),
                        chartArea.bottom - 6
                    );

                    ctx.strokeText(label, x, y);
                    ctx.fillText(label, x, y);
                });

                ctx.restore();
            }
        }
    );
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

const downloadJson = (url) => {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https:') ? https : http;
        const request = client.get(url, (response) => {
            if (
                response.statusCode &&
                response.statusCode >= 300 &&
                response.statusCode < 400 &&
                response.headers.location
            ) {
                response.resume();
                resolve(downloadJson(response.headers.location));
                return;
            }

            if (
                !response.statusCode ||
                response.statusCode < 200 ||
                response.statusCode >= 300
            ) {
                response.resume();
                reject(
                    new Error(
                        `Failed to download autofocus report: ${response.statusCode || 'unknown'}`
                    )
                );
                return;
            }

            const chunks = [];
            response.on('data', (chunk) => chunks.push(chunk));
            response.on('end', () => {
                try {
                    const body = Buffer.concat(chunks).toString('utf8');
                    resolve(JSON.parse(body));
                } catch (error) {
                    reject(error);
                }
            });
            response.on('error', reject);
        });

        request.on('error', reject);
    });
};

const getChartConfig = (yAxisLabel) => {
    return {
        type: 'line',
        data: {
            datasets: []
        },
        options: {
            plugins: {
                measurePointOrderLabels: {
                    display: true
                },
                legend: {
                    labels: {
                        color: 'white'
                    },
                    position: 'bottom',
                    align: 'start'
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    position: 'left',
                    beginAtZero: true,
                    min: 0,
                    ticks: {
                        color: 'white'
                    },
                    title: {
                        display: true,
                        text: yAxisLabel
                    }
                },
                x: {
                    type: 'linear',
                    position: 'bottom',
                    ticks: {
                        color: 'white'
                    },
                    title: {
                        display: true,
                        text: 'Position'
                    }
                }
            }
        }
    };
};

class AFGraphCommand extends BaseCommand {
    async process(message) {
        if (message.attachments.size === 0) {
            return;
        }

        for (const [, attachment] of message.attachments) {
            const attachmentName = attachment.name || attachment.url;
            const normalizedName = attachmentName.split('?')[0].toLowerCase();
            if (!normalizedName.endsWith('.json')) {
                continue;
            }

            const autoFocusData = await downloadJson(attachment.url);

            const valid =
                validateV1Schema(autoFocusData) ||
                validateV2Schema(autoFocusData);

            if (!valid) {
                console.log('Invalid JSON for auto focus report');
                continue;
            }

            try {
                const report = new AutoFocusReport(autoFocusData);
                const config = this.generateGraphConfiguration(report);
                const imageBuffer = await this.render(config);
                const analysis = this.analyze(report);

                await this.sendMessage(message, report, analysis, imageBuffer);
            } catch (e) {
                console.log(e);
                if (e instanceof SyntaxError) {
                    await message.channel.send(
                        'Unable to process the autofocus report. The formulas to render the fitting lines could not be parsed.'
                    );
                } else {
                    await message.channel.send(
                        'Unable to process the autofocus report due to an unexpected error.'
                    );
                }
            }
        }
    }

    analyze(report) {
        const analysis = [];
        const measurePoints = report.MeasurePoints.map((p) => {
            return { x: p.Position, y: p.Value };
        });

        const hfrStdDev = mathjs.std(
            _.filter(measurePoints, (x) => x.y > 0).map((x) => x.y)
        );
        if (hfrStdDev < 1) {
            analysis.push(
                '- Overall HFR change is low. This indicates that the step size might be too small'
            );
        }

        const hasZeroStars =
            _.filter(measurePoints, (x) => x.y === 0).length > 0;
        if (hasZeroStars) {
            analysis.push(
                '- Data points contain HFR values of 0. The step size might be too large and the image may be too far out of focus, or clouds may have prevented the detection of stars'
            );
        }

        if (
            report.BacklashCompensationModel === 'OVERSHOOT' &&
            report.BacklashIN > 0 &&
            report.BacklashOUT > 0
        ) {
            analysis.push(
                '- Backlash compensation method is set to OVERSHOOT, but both IN and OUT values are non zero. For this backlash compensation method only one direction must be compensated!'
            );
        }

        if (
            report.Fitting === 'HYPERBOLIC' ||
            report.Fitting === 'TRENDHYPERBOLIC'
        ) {
            if (
                report.HyperbolicFitting.RSquared &&
                report.HyperbolicFitting.RSquared < 0.7
            ) {
                analysis.push(
                    `- R² is low for hyperbolic fitting (${report.HyperbolicFitting.RSquared})`
                );
            }
        }

        if (
            report.Fitting === 'PARABOLIC' ||
            report.Fitting === 'TRENDPARABOLIC'
        ) {
            if (
                report.QuadraticFitting.RSquared &&
                report.QuadraticFitting.RSquared < 0.7
            ) {
                analysis.push(
                    `- R² is low for parabolic fitting (${report.QuadraticFitting.RSquared})`
                );
            }
        }

        if (
            report.Fitting === 'TRENDLINES' ||
            report.Fitting === 'TRENDHYPERBOLIC' ||
            report.Fitting === 'TRENDPARABOLIC'
        ) {
            if (
                report.LeftTrendFitting.RSquared &&
                report.LeftTrendFitting.RSquared < 0.7
            ) {
                analysis.push(
                    `- R² is low for left trend fitting (${report.LeftTrendFitting.RSquared})`
                );
            }
            if (
                report.RightTrendFitting.RSquared &&
                report.RightTrendFitting.RSquared < 0.7
            ) {
                analysis.push(
                    `- R² is low for right trend fitting (${report.RightTrendFitting.RSquared})`
                );
            }
        }

        return analysis;
    }

    async render(configuration) {
        const chartJSNodeCanvas = new ChartJSNodeCanvas({
            width,
            height,
            chartCallback
        });

        return chartJSNodeCanvas.renderToBuffer(configuration);
    }

    async sendMessage(message, report, analysis, imageBuffer) {
        const embed = new EmbedBuilder();
        const image = new AttachmentBuilder(imageBuffer, {
            name: 'af-report.png'
        });

        embed.addFields([
            { name: 'Method', value: report.Method, inline: true },
            { name: 'Fitting', value: report.Fitting, inline: true },
            {
                name: 'Temperature',
                value: report.Temperature.toString(),
                inline: true
            },
            { name: 'Step Size', value: report.StepSize.toString(), inline: true },
            {
                name: 'Calculated Focus Position',
                value: report.FocusPoint.Position.toString(),
                inline: true
            },
            { name: 'Filter', value: report.Filter, inline: true }
        ]);

        if (report.BacklashCompensationModel) {
            embed.addFields([
                {
                    name: 'Backlash Method',
                    value: report.BacklashCompensationModel,
                    inline: true
                },
                {
                    name: 'BacklashIN',
                    value: report.BacklashIN.toString(),
                    inline: true
                },
                {
                    name: 'BacklashOUT',
                    value: report.BacklashOUT.toString(),
                    inline: true
                }
            ]);
        }

        const rSquares = [];
        if (
            report.HyperbolicFitting &&
            report.HyperbolicFitting.RSquared &&
            !isNaN(report.HyperbolicFitting.RSquared)
        ) {
            rSquares.push(
                `Hyperbolic: ${report.HyperbolicFitting.RSquared.toString()}`
            );
        }

        if (
            report.QuadraticFitting &&
            report.QuadraticFitting.RSquared &&
            !isNaN(report.QuadraticFitting.RSquared)
        ) {
            rSquares.push(
                `Quadratic: ${report.QuadraticFitting.RSquared.toString()}`
            );
        }

        if (
            report.LeftTrendFitting &&
            report.LeftTrendFitting.RSquared &&
            !isNaN(report.LeftTrendFitting.RSquared) &&
            report.RightTrendFitting &&
            report.RightTrendFitting.RSquared &&
            !isNaN(report.RightTrendFitting.RSquared)
        ) {
            rSquares.push(
                `Left Trend: ${isNaN(report.LeftTrendFitting.RSquared)
                    ? 'Unknown'
                    : report.LeftTrendFitting.RSquared
                } | Right Trend: ${isNaN(report.RightTrendFitting.RSquared)
                    ? 'Unknown'
                    : report.RightTrendFitting.RSquared
                }`
            );
        }

        if (rSquares.length > 0) {
            embed.addFields([
                {
                    name: 'R² - Coefficient of determination',
                    value: rSquares.join('\n')
                }
            ]);
        }

        if (analysis.length > 0) {
            embed.addFields([
                { name: 'Potential Issues', value: analysis.join('\n') }
            ]);
        }

        await message.channel.send({
            embeds: [embed],
            files: [image]
        });
    }

    generateGraphConfiguration(report) {
        const yAxisLabel = report.Method === 'STARHFR' ? 'HFR' : 'Contrast';
        const config = getChartConfig(yAxisLabel);

        const measurePoints = report.MeasurePoints.map((p) => {
            return { x: p.Position, y: p.Value, order: p.Order };
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
            let data;
            if (report.QuadraticFitting) {
                data = report.QuadraticFitting.getPoints(
                    report.MinimumStep,
                    report.MaximumStep
                );
                config.data.datasets.push({
                    label: 'Quadratic',
                    pointBackgroundColor:
                        data.length > 1
                            ? 'transparent'
                            : 'rgba(75, 192, 192, 1)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    data,
                    borderDash: [5, 5],
                    borderWidth: 1,
                    fill: false,
                    pointRadius: 3,
                    pointBorderColor: 'transparent'
                });
            }
            if (report.HyperbolicFitting) {
                data = report.HyperbolicFitting.getPoints(
                    report.MinimumStep,
                    report.MaximumStep
                );
                config.data.datasets.push({
                    label: 'Hyperbolic',
                    pointBackgroundColor:
                        data.length > 1
                            ? 'transparent'
                            : 'rgba(153, 102, 255, 1)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    data,
                    borderDash: [5, 5],
                    borderWidth: 1,
                    fill: false,
                    pointRadius: 3,
                    pointBorderColor: 'transparent'
                });
            }
            if (report.LeftTrendFitting && report.RightTrendFitting) {
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
                        data.length > 1
                            ? 'transparent'
                            : 'rgba(255, 159, 64, 1)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    data,
                    borderDash: [2, 2],
                    borderWidth: 1,
                    tension: 0,
                    fill: false,
                    pointRadius: 3,
                    pointBorderColor: 'transparent'
                });
            }
        } else if (report.GaussianFitting) {
            const data = report.GaussianFitting.getPoints(
                report.MinimumStep,
                report.MaximumStep
            );
            config.data.datasets.push({
                label: 'Gaussian',
                pointBackgroundColor:
                    data.length > 1 ? 'transparent' : 'rgba(255, 159, 64, 1)',
                borderColor: 'rgba(255, 159, 64, 1)',
                data,
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
