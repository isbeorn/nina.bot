module.exports = {
    id: 'community',
    label: 'Project and community',
    replies: [
        {
            name: 'repository',
            description: 'The main N.I.N.A. repository',
            card: {
                title: 'N.I.N.A. source code',
                introduction:
                    'Explore the source code for the N.I.N.A. project on GitHub.',
                links: [
                    {
                        label: 'Open the repository',
                        url: 'https://github.com/isbeorn/nina'
                    }
                ]
            }
        },
        {
            name: 'ninadocs',
            description: 'Repository for the N.I.N.A. documentation',
            card: {
                title: 'Contribute to the N.I.N.A. documentation',
                introduction:
                    'The documentation repository contains the source for the manual. Start here to improve or contribute to the documentation.',
                links: [
                    {
                        label: 'Open the documentation repository',
                        url: 'https://github.com/isbeorn/nina.docs'
                    }
                ]
            }
        },
        {
            name: 'issues',
            description: 'Where to find the issue tracker',
            card: {
                title: 'N.I.N.A. issue tracker',
                introduction:
                    'Report bugs or suggest improvements on GitHub. Include detailed information so others can understand and reproduce the problem.',
                links: [
                    {
                        label: 'Open the issue tracker',
                        url: 'https://github.com/isbeorn/nina/issues'
                    }
                ]
            }
        },
        {
            name: 'donate',
            description: 'How to support the project',
            card: {
                title: 'Support N.I.N.A.',
                introduction:
                    'Thank you for considering a donation! Find out how you can support the project on the donation page.',
                links: [
                    {
                        label: 'Support the project',
                        url: 'https://nighttime-imaging.eu/donate/'
                    }
                ]
            }
        },
        {
            name: 'discordpatreon',
            description: 'How to link discord with patreon',
            card: {
                title: 'Link Patreon to Discord',
                introduction:
                    'Follow the Patreon guide to connect your Discord account and receive your role.',
                links: [
                    {
                        label: 'Patreon role instructions',
                        url: 'https://support.patreon.com/hc/en-us/articles/212052266-Get-my-Discord-role'
                    }
                ]
            }
        },
        {
            name: 'privacy',
            description: 'Show NINA.Bot privacy and data usage information',
            card: () => ({
                title: 'NINA.Bot privacy and data usage',
                introduction:
                    'Read how NINA.Bot processes data when you use its commands and support tools.',
                links: [
                    {
                        label: 'Read the privacy policy',
                        url:
                            process.env.PRIVACY_POLICY_URL ||
                            'https://github.com/isbeorn/nina.bot/blob/master/PRIVACY.md'
                    }
                ]
            })
        }
    ]
};
