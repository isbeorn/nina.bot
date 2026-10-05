module.exports = {
    id: 'guides',
    label: 'Guides and tools',
    replies: [
        {
            name: 'plugins',
            description: 'Install, update and troubleshoot N.I.N.A. plugins',
            card: {
                title: 'N.I.N.A. plugins',
                introduction:
                    "Manage plugins from the Plugins tab. Availability and compatibility depend on your N.I.N.A. version and the plugin's requirements.",
                sections: [
                    {
                        heading: 'Install or update',
                        text: '1. Open **Plugins > Available** with an internet connection. Select a plugin and review its description, homepage and requirements.\n2. Choose **Install** or **Update**.\n3. Restart N.I.N.A. when requested to load the installed version. Configure any plugin options under **Plugins > Installed**.'
                    },
                    {
                        heading: 'If a plugin is missing or fails',
                        text: "**Compatibility:** Check your exact N.I.N.A. version and the versions supported by the plugin. A plugin offered for one release may not be available for another.\n**Isolation:** Save your work, uninstall the suspected plugin and restart N.I.N.A., then check whether the problem still occurs. Reinstall a compatible version afterward if needed.\n**Support:** Use the plugin's homepage or source link to contact its maintainer. Include the N.I.N.A. version, plugin version, reproduction steps and `/logs`."
                    }
                ],
                links: [
                    {
                        label: 'Install and update plugins',
                        url: 'https://nighttime-imaging.eu/docs/master/site/tabs/plugins/available/'
                    },
                    {
                        label: 'Manage installed plugins',
                        url: 'https://nighttime-imaging.eu/docs/master/site/tabs/plugins/installed/'
                    }
                ]
            }
        },
        {
            name: 'backup',
            description:
                'Back up and restore profiles, sequences, templates and targets',
            card: {
                title: 'Back up your N.I.N.A. setup',
                introduction:
                    'Profiles contain settings. Sequences, templates and saved targets are separate files, so copying only the profiles folder is not a complete backup of your imaging workflow.',
                sections: [
                    {
                        heading: 'Make a backup',
                        text: '1. Note your N.I.N.A. version and the sequence, template and target folder locations in **Options > Imaging**. These locations are configurable.\n2. Save your sequences and close N.I.N.A.\n3. Copy the entire profiles folder to your backup location:\n```text\n%LOCALAPPDATA%\\NINA\\Profiles\n```\n4. Copy the configured sequence, template and target folders separately. Preserve any external scripts and other files your sequences reference.'
                    },
                    {
                        heading: 'Restore or move to another PC',
                        text: '1. Install a compatible N.I.N.A. version and the required equipment drivers and plugins.\n2. Close N.I.N.A. and retain a copy of any existing destination files before restoring the profiles and saved workflow files.\n3. Open N.I.N.A., select the restored profile and verify folder paths, equipment selections and external file references.\n4. Open your sequences and resolve validation issues before running them. Check plugin-specific backup instructions for settings stored outside the profile.'
                    }
                ],
                links: [
                    {
                        label: 'Profile settings',
                        url: 'https://nighttime-imaging.eu/docs/master/site/tabs/options/general/'
                    },
                    {
                        label: 'Sequence folder settings',
                        url: 'https://nighttime-imaging.eu/docs/master/site/tabs/options/imaging/'
                    }
                ]
            }
        },
        {
            name: 'download',
            description: 'Choose a N.I.N.A. release and find its requirements',
            card: {
                title: 'Download N.I.N.A.',
                introduction:
                    'Use the official download page for current installers, release notes and available release channels.',
                sections: [
                    {
                        heading: 'Choose a channel',
                        text: '**Stable release:** The normal choice for imaging runs.\n**Beta / release candidate:** Test an upcoming release or fix and read its release notes first. Availability varies.\n**Nightly:** Development builds for trying upcoming changes and providing feedback. Expect changes and possible regressions; keep test installations current.'
                    },
                    {
                        heading: 'Check the selected build',
                        text: "Use the requirements and documentation for the version you are installing. Follow that installer's prerequisite prompts, including the requested .NET Desktop Runtime version and architecture. One .NET version does not apply to every N.I.N.A. release.\nCheck driver and plugin compatibility and use `/backup` before changing installations. `/docs` opens release documentation; `/devdocs` opens nightly documentation."
                    }
                ],
                links: [
                    {
                        label: 'Official downloads and release notes',
                        url: 'https://nighttime-imaging.eu/download/'
                    },
                    {
                        label: 'Release requirements',
                        url: 'https://nighttime-imaging.eu/docs/master/site/requirements/'
                    },
                    {
                        label: 'Nightly requirements',
                        url: 'https://nighttime-imaging.eu/docs/develop/site/requirements/'
                    }
                ]
            }
        },
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
