const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const test = require('node:test');

const AFGraphCommand = require('../commands/AFGraphCommand');
const { AutoFocusReport } = require('../commands/AFGraphCommand/AutoFocusReport');
const { Fitting } = require('../commands/AFGraphCommand/Fitting');
const { MeasurePoint } = require('../commands/AFGraphCommand/MeasurePoint');

const fixturePath = (...parts) => path.join(__dirname, 'data', ...parts);
const readFixture = (name) =>
    JSON.parse(fs.readFileSync(fixturePath(name), 'utf8'));

const withServer = async (handler, run) => {
    const server = http.createServer(handler);

    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const { port } = server.address();

    try {
        await run(`http://127.0.0.1:${port}`);
    } finally {
        await new Promise((resolve) => server.close(resolve));
    }
};

const createSlashInteraction = (attachment) => ({
    commandName: 'afgraph',
    deferred: false,
    replied: false,
    isChatInputCommand: () => true,
    isMessageContextMenuCommand: () => false,
    options: {
        getAttachment: () => attachment
    },
    async deferReply() {
        this.deferred = true;
    },
    async editReply(payload) {
        this.edited = payload;
    }
});

const createContextInteraction = (attachments) => ({
    commandName: 'Analyze Autofocus Report',
    deferred: false,
    replied: false,
    isChatInputCommand: () => false,
    isMessageContextMenuCommand: () => true,
    targetMessage: {
        attachments
    },
    async deferReply() {
        this.deferred = true;
    },
    async editReply(payload) {
        this.edited = payload;
    }
});

test('autofocus report loads fixture data and exposes calculated values', () => {
    const data = readFixture(
        '2026-05-13--22-52-02--145feffc-01b9-45ed-9718-38a4245c5363.json'
    );
    const report = new AutoFocusReport(data);

    assert.equal(report.Method, data.Method);
    assert.equal(report.Fitting, data.Fitting);
    assert.equal(report.FocusPoint.Position, data.CalculatedFocusPoint.Position);
    assert.equal(report.MinimumStep, data.MeasurePoints[0].Position);
    assert.equal(
        report.MaximumStep,
        data.MeasurePoints[data.MeasurePoints.length - 1].Position
    );
    assert.ok(report.MeasurePoints.length >= 2);
});

test('autofocus report rejects reports with fewer than two unique points', () => {
    const data = readFixture(
        '2026-05-14--00-56-18--76fc6e25-45b6-41fd-883c-64e23ecd12e8.json'
    );
    data.MeasurePoints = [data.MeasurePoints[0], data.MeasurePoints[0]];

    assert.throws(
        () => new AutoFocusReport(data),
        /at least two unique measure points/
    );
});

test('fitting evaluates formulas, fallback points, and r-squared clamping', () => {
    const points = [
        new MeasurePoint({ Position: 0, Value: 0 }),
        new MeasurePoint({ Position: 1, Value: 1 }),
        new MeasurePoint({ Position: 2, Value: 4 })
    ];
    const formula = new Fitting('x²', { Position: 1, Value: 1 }, points);
    const pointOnly = new Fitting(undefined, { Position: 7, Value: 9 }, points);

    assert.equal(formula.f(3), 9);
    assert.ok(formula.getPoints(0, 2).length > 50);
    assert.deepEqual(pointOnly.getPoints(0, 2), [{ x: 7, y: 9 }]);
    assert.ok(new Fitting('x + 100', { Position: 1, Value: 1 }, points).RSquared < 0);
});

test('afgraph declares slash and message context menu commands', () => {
    const command = new AFGraphCommand();
    const commands = command
        .getApplicationCommands()
        .map((applicationCommand) => applicationCommand.toJSON());

    assert.equal(commands[0].name, 'afgraph');
    assert.equal(commands[0].options[0].name, 'report');
    assert.equal(commands[1].name, 'Analyze Autofocus Report');
    assert.equal(command.handlesInteraction({ commandName: 'afgraph' }), true);
    assert.equal(
        command.handlesInteraction({
            commandName: 'Analyze Autofocus Report'
        }),
        true
    );
    assert.equal(command.handlesInteraction({ commandName: 'other' }), false);
});

test('afgraph renders all autofocus fixtures into Discord responses', async () => {
    const command = new AFGraphCommand();

    for (const fileName of fs.readdirSync(fixturePath())) {
        const report = new AutoFocusReport(readFixture(fileName));
        const config = command.generateGraphConfiguration(report);
        const imageBuffer = await command.render(config);
        const response = command.createResponse(report, command.analyze(report), imageBuffer);

        assert.ok(imageBuffer.length > 0, fileName);
        assert.equal(response.files[0].name, 'af-report.png', fileName);
        assert.ok(response.embeds[0].toJSON().fields.length >= 6, fileName);
    }
});

test('afgraph slash command downloads and analyzes an uploaded report', async () => {
    const reportJson = fs.readFileSync(
        fixturePath('autofocus_report_Region0.json'),
        'utf8'
    );
    const command = new AFGraphCommand();

    await withServer(
        (request, response) => {
            response.setHeader('content-type', 'application/json');
            response.end(reportJson);
        },
        async (baseUrl) => {
            const interaction = createSlashInteraction({
                name: 'autofocus_report_Region0.json',
                url: `${baseUrl}/report.json`
            });

            await command.process(interaction);

            assert.equal(interaction.deferred, true);
            assert.equal(interaction.edited.files[0].name, 'af-report.png');
            assert.ok(interaction.edited.embeds[0].toJSON().fields.length >= 6);
        }
    );
});

test('afgraph message context menu chooses the json attachment', async () => {
    const reportJson = fs.readFileSync(
        fixturePath('autofocus_report_Region0.json'),
        'utf8'
    );
    const command = new AFGraphCommand();

    await withServer(
        (request, response) => {
            response.setHeader('content-type', 'application/json');
            response.end(reportJson);
        },
        async (baseUrl) => {
            const attachments = [
                { name: 'notes.txt', url: `${baseUrl}/notes.txt` },
                {
                    name: 'autofocus_report_Region0.json',
                    url: `${baseUrl}/report.json`
                }
            ];
            const interaction = createContextInteraction(attachments);

            await command.process(interaction);

            assert.equal(interaction.edited.files[0].name, 'af-report.png');
        }
    );
});

test('afgraph returns clear failures for missing, non-json, and invalid reports', async () => {
    const command = new AFGraphCommand();
    const missing = createSlashInteraction(undefined);
    const nonJson = createSlashInteraction({
        name: 'report.txt',
        url: 'http://127.0.0.1/report.txt'
    });

    await command.process(missing);
    await command.process(nonJson);

    assert.equal(
        missing.edited,
        'Please provide a N.I.N.A. autofocus JSON report attachment.'
    );
    assert.equal(nonJson.edited, 'The autofocus report must be a .json attachment.');

    await withServer(
        (request, response) => {
            response.setHeader('content-type', 'application/json');
            response.end(JSON.stringify({ unsupported: true }));
        },
        async (baseUrl) => {
            const invalid = createSlashInteraction({
                name: 'report.json',
                url: `${baseUrl}/report.json`
            });

            await command.process(invalid);

            assert.equal(
                invalid.edited,
                'The uploaded JSON is not a supported N.I.N.A. autofocus report.'
            );
        }
    );
});
