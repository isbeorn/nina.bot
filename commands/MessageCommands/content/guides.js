module.exports = {
    id: 'guides',
    label: 'Guides and tools',
    replies: [
        {
            name: 'docs',
            description: 'Link to the documentation page',
            card: {
                title: 'N.I.N.A. documentation',
                introduction:
                    'The manual for the current release, with application guides, tips and ways to contribute.',
                links: [
                    {
                        label: 'Read the release manual',
                        url: 'https://nighttime-imaging.eu/docs/master/site/'
                    }
                ]
            }
        },
        {
            name: 'devdocs',
            description: 'Documentation for nightlies',
            card: {
                title: 'N.I.N.A. nightly documentation',
                introduction:
                    'The manual for the current nightly build, with application guides, tips and ways to contribute.',
                links: [
                    {
                        label: 'Read the nightly manual',
                        url: 'https://nighttime-imaging.eu/docs/develop/site/'
                    }
                ]
            }
        },
        {
            name: 'dock',
            description: 'Need help with the imaging dock panels?',
            card: {
                title: 'Arrange the imaging panels',
                introduction:
                    'Watch the tutorial for help with the dock panels in N.I.N.A.',
                links: [
                    {
                        label: 'Watch the panel tutorial',
                        url: 'https://www.youtube.com/watch?v=OEJUya9_LWA'
                    }
                ]
            }
        },
        {
            name: 'stars',
            description:
                'Cannot find stars in the app? Check this command to find out where to find them!',
            card: {
                title: 'Find stars in N.I.N.A.',
                introduction:
                    'The Sky Atlas searches deep sky objects. For stars, open **Manual Focus Targets** in the Imaging tab.',
                sections: [
                    {
                        heading: 'Choose a focus target',
                        text: 'This tool lists the brightest stars in the night sky, ordered by altitude. Stars are typically used for focusing.'
                    }
                ],
                links: [
                    {
                        label: 'Imaging documentation',
                        url: 'https://nighttime-imaging.eu/docs/develop/site/tabs/imaging/'
                    }
                ],
                media: [
                    {
                        url: 'https://nighttime-imaging.eu/wp-content/uploads/2020/06/stars.png',
                        description:
                            'The Manual Focus Targets tool in the N.I.N.A. Imaging tab.'
                    }
                ]
            }
        },
        {
            name: 'stellarium',
            description: 'How to setup stellarium with N.I.N.A.',
            card: {
                title: 'Connect Stellarium to N.I.N.A.',
                introduction:
                    'Follow this video tutorial to set up Stellarium with N.I.N.A.',
                links: [
                    {
                        label: 'Watch the Stellarium tutorial',
                        url: 'https://youtu.be/v2gROUlPRhw'
                    }
                ]
            }
        },
        {
            name: 'profiles',
            description: 'Where to find the profile files written by N.I.N.A.',
            card: {
                title: 'N.I.N.A. profiles',
                introduction:
                    'Profiles store your application settings as XML files. Updating N.I.N.A. preserves these profiles.',
                sections: [
                    {
                        heading: 'Open the folder',
                        text: '```text\n%LOCALAPPDATA%\\NINA\\Profiles\n```'
                    }
                ]
            }
        },
        {
            name: 'cmd',
            description: 'N.I.N.A. Command Line Arguments',
            card: {
                title: 'N.I.N.A. command line arguments',
                introduction: 'Use these options when launching N.I.N.A.',
                sections: [
                    {
                        heading: 'Load a profile or sequence',
                        text: '```text\n-p, --profileid\n-s, --sequencefile\n```\nLoad a profile by ID with `-p` or load a sequence file with `-s`.'
                    },
                    {
                        heading: 'Run and exit',
                        text: '```text\n-r, --runsequence\n-x, --exitaftersequence\n```\n`-r` starts the sequence loaded with `-s` and switches to the Imaging tab. `-x` exits N.I.N.A. when the sequence finishes. Both default to false.'
                    },
                    {
                        heading: 'Diagnostics',
                        text: '```text\n-d, --debug\n-g, --disable-hardware-acceleration\n```\n`-d` reveals additional UI elements for development and testing (default: false). `-g` disables UI hardware acceleration.'
                    },
                    {
                        heading: 'Help and version',
                        text: '```text\n--help\n--version\n```\nDisplay command line help or version information.'
                    }
                ]
            }
        }
    ]
};
