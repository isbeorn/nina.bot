module.exports = {
    id: 'troubleshooting',
    label: 'Troubleshooting',
    replies: [
        {
            name: 'platesolve',
            description: 'Set up plate solving and troubleshoot failed solves',
            card: {
                title: 'N.I.N.A. plate solving',
                introduction:
                    'A plate solve identifies where an image points in the sky. Start with the solver installation and your optical settings.',
                sections: [
                    {
                        heading: 'Check the setup',
                        text: '1. Install your solver and its required star catalogs. ASTAP needs both the application and a star database. Select its executable in **Options > Plate Solving**.\n2. In **Options > Equipment**, check the camera pixel size in micrometers and telescope focal length in millimeters. Use the **effective focal length**, including reducers or Barlows.\n3. Configure the primary solver and blind solver. The blind solver is a fallback when the initial solve fails; its own setup must also be complete.'
                    },
                    {
                        heading: 'If solving fails',
                        text: '**Stars:** Check focus, exposure and filter choice so enough stars are visible.\n**Settings:** Recheck the solver executable, catalogs, pixel size and focal length.\n**Evidence:** Share the failed image and solver output from this folder, plus the session log from `/logs`:\n```text\n%LOCALAPPDATA%\\NINA\\PlateSolver\\Failed\n```'
                    },
                    {
                        heading: 'Solve, sync and center',
                        text: '**Solve** measures the pointing position. **Sync** tells the mount that position. **Reslew To Target** moves back to the requested target; **Repeat until error <** repeats centering to the chosen tolerance. A successful solve alone does not move the mount.'
                    }
                ],
                links: [
                    {
                        label: 'Plate solving guide',
                        url: 'https://nighttime-imaging.eu/docs/master/site/advanced/platesolving/'
                    }
                ]
            }
        },
        {
            name: 'support',
            description:
                'Information is lacking for a support request. Generate a guideline here',
            card: {
                title: 'Get help with N.I.N.A.',
                introduction:
                    'Share these details so the community can understand and reproduce your issue.',
                sections: [
                    {
                        heading: 'Describe the problem',
                        text: '1. Describe the issue in detail.\n2. List your hardware, drivers and their versions.\n3. Give the steps to reproduce it.\n4. Explain the expected behavior and what actually happened.\n5. Add a screenshot if it helps illustrate the problem.'
                    },
                    {
                        heading: 'Attach the log file',
                        text: '```text\n%LOCALAPPDATA%\\NINA\\Logs\n```\nShare the log from the session where the issue occurred.'
                    }
                ],
                links: [
                    {
                        label: 'N.I.N.A. issue tracker',
                        url: 'https://github.com/isbeorn/nina/issues'
                    }
                ]
            }
        },
        {
            name: 'logs',
            description: 'Where to find N.I.N.A. logs',
            card: {
                title: 'N.I.N.A. logs',
                introduction: 'Find the log file for your support request.',
                sections: [
                    {
                        heading: 'Open the folder',
                        text: '```text\n%LOCALAPPDATA%\\NINA\\Logs\n```'
                    },
                    {
                        heading: 'Inside N.I.N.A.',
                        text: 'Go to Options > General > Advanced settings > Log Level and select the adjacent folder button.\n\nDrag the relevant log file into your support conversation.'
                    }
                ]
            }
        },
        {
            name: 'troubleshoot',
            description: 'Troubleshoot guide for common problems',
            card: {
                title: 'Troubleshoot N.I.N.A.',
                introduction:
                    'Find guidance for common problems in the troubleshooting documentation.',
                links: [
                    {
                        label: 'Open the troubleshooting guide',
                        url: 'https://nighttime-imaging.eu/docs/develop/site/troubleshooting/'
                    }
                ]
            }
        },
        {
            name: 'crash',
            description: 'In case of application crashes',
            card: {
                title: 'After a N.I.N.A. crash',
                introduction:
                    'The log may not contain crash details because the application can stop before writing them.',
                sections: [
                    {
                        heading: 'Look for a crash dump',
                        text: '```text\n%LOCALAPPDATA%\\NINA\\CrashDump\n```\nCheck whether a crash dump is available to share for troubleshooting.'
                    },
                    {
                        heading: 'If there is no dump',
                        text: 'Check Windows Event Viewer for details about the crash.'
                    }
                ],
                links: [
                    {
                        label: 'Event Viewer instructions',
                        url: 'https://nighttime-imaging.eu/docs/master/site/troubleshooting/general/#event-viewer'
                    }
                ]
            }
        },
        {
            name: 'memorydump',
            description: 'How to create a memory dump',
            card: {
                title: 'Create a N.I.N.A. memory dump',
                introduction:
                    'Use Microsoft ProcDump to capture a dump of a running N.I.N.A. instance for analysis.',
                sections: [
                    {
                        heading: 'After downloading ProcDump',
                        text: 'Run this command while N.I.N.A. is running:\n```text\nprocdump.exe -ma NINA.exe\n```'
                    }
                ],
                links: [
                    {
                        label: 'Download ProcDump',
                        url: 'https://learn.microsoft.com/en-us/sysinternals/downloads/procdump'
                    }
                ]
            }
        },
        {
            name: 'repair',
            description: 'How to repair a N.I.N.A. installation',
            card: {
                title: 'Repair a N.I.N.A. installation',
                introduction:
                    'Use the installed application entry in Windows to start a repair.',
                sections: [
                    {
                        heading: 'Repair steps',
                        text: '1. Close N.I.N.A.\n2. Open Windows **Add or remove programs**.\n3. Search for **N.I.N.A.**.\n4. Select N.I.N.A. and choose **Modify**.\n5. Select **Repair** and follow the installer prompts.'
                    }
                ]
            }
        },
        {
            name: 'renderissues',
            description: 'In case of render issues like icons disappearing',
            card: {
                title: 'Missing icons or rendering problems',
                introduction:
                    'The **Nahimic Service** can cause rendering issues in WPF applications such as N.I.N.A. Check whether it is running.',
                sections: [
                    {
                        heading: 'Disable the affected service',
                        text: '1. Press **Win + R**.\n2. Open the Services window with:\n```text\nservices.msc\n```\n3. Locate **Nahimic Service** and follow the screenshot to disable it.'
                    }
                ],
                links: [
                    {
                        label: 'Rendering troubleshooting',
                        url: 'https://nighttime-imaging.eu/docs/develop/site/troubleshooting/render_issues/'
                    }
                ],
                media: [
                    {
                        url: 'https://nighttime-imaging.eu/docs/develop/site/images/troubleshooting/disablenahimic.png',
                        description:
                            'Windows Services settings for disabling the Nahimic Service.'
                    }
                ]
            }
        },
        {
            name: 'installertroubleshoot',
            description:
                'Troubleshoot issues with installer being unable to install or uninstall the application',
            card: {
                title: 'N.I.N.A. installer troubleshooting',
                introduction:
                    'If installation or removal fails because a file is missing from Package Cache, try the Microsoft Program Install and Uninstall troubleshooter.',
                links: [
                    {
                        label: 'Open Microsoft troubleshooting',
                        url: 'https://support.microsoft.com/en-gb/topic/fix-problems-that-block-programs-from-being-installed-or-removed-cca7d1b6-65a9-3d98-426b-e9f927e1eb4d'
                    }
                ]
            }
        },
        {
            name: 'net7',
            description: 'How to install .NET 7',
            card: {
                title: '.NET 7 for N.I.N.A. 3.x',
                introduction:
                    'For a N.I.N.A. 3.x installation that requires .NET 7, install **.NET Desktop Runtime 7.x** from the download page.',
                links: [
                    {
                        label: 'Download .NET 7',
                        url: 'https://dotnet.microsoft.com/en-us/download/dotnet/7.0'
                    }
                ],
                media: [
                    {
                        url: 'https://cdn.discordapp.com/attachments/1075489594184847410/1133956497932558397/image.png',
                        description:
                            'The .NET 7 download page with the required desktop runtime highlighted.'
                    }
                ]
            }
        }
    ]
};
