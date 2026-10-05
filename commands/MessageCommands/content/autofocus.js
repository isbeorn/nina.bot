module.exports = {
    id: 'autofocus',
    label: 'Autofocus and sequencing',
    replies: [
        {
            name: 'afreport',
            description: 'How to generate autofocus reports',
            card: {
                title: 'N.I.N.A. autofocus reports',
                introduction:
                    'N.I.N.A. writes a JSON report after each completed autofocus run.',
                sections: [
                    {
                        heading: 'Open the report folder',
                        text: '```text\n%LOCALAPPDATA%\\NINA\\AutoFocus\n```'
                    },
                    {
                        heading: 'Create a graph',
                        text: 'Use `/afgraph` and attach the JSON file in the **report** field.\n\nAlready posted the report? Right-click its message and choose **Apps > Analyze Autofocus Report**.'
                    }
                ]
            }
        },
        {
            name: 'overshoot',
            description:
                'A short clip to show how focuser overshoot is working',
            card: {
                title: 'Overshoot backlash compensation',
                introduction:
                    'The focuser moves past the target by a large amount, then returns to the requested position. This compensates for backlash by keeping the final movement in the same direction, either always inward or always outward.',
                links: [
                    {
                        label: 'Backlash compensation guide',
                        url: 'https://nighttime-imaging.eu/docs/master/site/tabs/options/autofocus/#backlash-compensation-method'
                    }
                ],
                media: [
                    {
                        url: 'https://media.discordapp.net/attachments/437173823675170816/717152179151962172/nina-af.gif',
                        description:
                            'Animation showing the focuser overshooting its target and returning from a consistent direction.'
                    }
                ]
            }
        },
        {
            name: 'shutdown',
            description:
                'A short clip showing how to shut down the PC with the external script instruction',
            card: {
                title: 'Shut down the PC from the advanced sequencer',
                introduction:
                    'Use the **External Script** instruction to call the Windows built-in shutdown command with your desired parameters.',
                links: [
                    {
                        label: 'Watch the shutdown example',
                        url: 'https://cdn.discordapp.com/attachments/436650965446426625/934707062166917190/devenv_2022-01-23_02-09-42.mp4'
                    },
                    {
                        label: 'Open the Discord discussion',
                        url: 'https://discord.com/channels/436650817295089664/436650965446426625/934707064297631764'
                    }
                ]
            }
        }
    ]
};
