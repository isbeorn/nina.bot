module.exports = {
    id: 'equipment',
    label: 'Equipment',
    replies: [
        {
            name: '32bitascom',
            description:
                'How to get 32bit ASCOM drivers to work with 64bit software',
            card: {
                title: 'Use a 32-bit ASCOM driver with 64-bit N.I.N.A.',
                introduction:
                    'Some ASCOM drivers are only available as 32-bit software. ASCOM Device Hub offers a way to connect without editing the registry.',
                sections: [
                    {
                        heading: 'Use ASCOM Device Hub',
                        text: 'Link your equipment in the hub setup, then connect N.I.N.A. to the hub.'
                    },
                    {
                        heading: 'Alternative COM configuration',
                        text: 'The linked guide describes a registry-based method for making a 32-bit COM object available to a 64-bit application.'
                    }
                ],
                links: [
                    {
                        label: 'Read the COM configuration guide',
                        url: 'https://techtalk.gfi.com/32bit-object-64bit-environment/'
                    }
                ]
            }
        },
        {
            name: 'conform',
            description: 'How to check ASCOM conformance',
            card: {
                title: 'Check ASCOM driver conformance',
                introduction:
                    'ConformU checks a driver against the ASCOM interface standard and tests aspects of its behavior against the reference implementation.',
                sections: [
                    {
                        heading: 'Run the checks',
                        text: '1. Download ConformU.\n2. Choose the correct driver under **Options > Select Driver**.\n3. Run the conformance checks and report any issues to the driver manufacturer.'
                    }
                ],
                links: [
                    {
                        label: 'Download ConformU',
                        url: 'https://github.com/ASCOMInitiative/ConformU/releases'
                    }
                ]
            }
        },
        {
            name: 'domeshutter',
            description: 'Dome Shutter conformance issue',
            card: {
                title: 'Dome shutter driver conformance',
                introduction:
                    'An ASCOM dome driver must wait for the shutter to start moving, or report failure, when asked to open or close it.',
                sections: [
                    {
                        heading: 'Why an early response matters',
                        text: 'If the driver returns before movement starts, N.I.N.A. cannot tell whether the shutter has failed or will move later. This can put equipment at risk when closing for unsafe conditions such as rain.'
                    },
                    {
                        heading: 'Next step',
                        text: 'Report this behavior to your dome vendor so they can fix the driver.'
                    }
                ],
                links: [
                    {
                        label: 'ASCOM principles',
                        url: 'https://ascom-standards.org/Developer/Principles.htm'
                    },
                    {
                        label: 'Developer discussion',
                        url: 'https://ascomtalk.groups.io/g/Developer/message/3579'
                    },
                    {
                        label: 'Discord explanation',
                        url: 'https://discord.com/channels/436650817295089664/769608646215598101/812466133608300544'
                    }
                ]
            }
        },
        {
            name: 'd3xxx',
            description: 'Nikon D3xxx series support',
            card: {
                title: 'Nikon D3xxx series support',
                introduction:
                    'The Nikon D3xxx series is not supported by the Nikon SDK and cannot be used with the native Nikon driver in N.I.N.A.'
            }
        },
        {
            name: 'qhydriver',
            description:
                'Got a message to update your QHY driver? Find help here',
            card: {
                title: 'QHY driver updates',
                introduction:
                    'If N.I.N.A. asks you to update your QHY driver, follow the guide for USB driver update problems.',
                links: [
                    {
                        label: 'QHY driver update guide',
                        url: 'https://nighttime-imaging.eu/docs/develop/site/troubleshooting/qhy_driver_update/#in-case-of-usb-driver-update-problems'
                    }
                ]
            }
        },
        {
            name: 'cameratimeout',
            description: 'Running into camera image timeout issues?',
            card: {
                title: 'Camera image download timeouts',
                introduction:
                    'Work through these checks if the camera times out while downloading an image.',
                sections: [
                    {
                        heading: 'Connections and power',
                        text: '1. **USB cables:** Use good-quality cables. Avoid faulty or excessively long cables and multiple cables bundled together.\n2. **Power:** Ensure the camera receives adequate power, including its external supply when required.\n3. **USB bandwidth:** Connect directly to a high-speed USB 3.0 port. Reduce other devices sharing the hub or port.'
                    },
                    {
                        heading: 'Settings and software',
                        text: '4. **Camera settings:** High frame rates or large images can exceed bandwidth or memory. Reduce the **USB Limit** setting if available.\n5. **Drivers:** Check the vendor website for camera driver and firmware updates.\n6. **System resources:** Close unnecessary processes to free CPU and RAM. Check the recommended system specifications for the camera.'
                    },
                    {
                        heading: 'Still timing out?',
                        text: 'Share your setup, when the error occurs, steps to reproduce it and a log file from the affected session. Use `/logs` to find the file.'
                    }
                ]
            }
        },
        {
            name: 'settlefailed',
            description:
                'Troubleshoot settle failures during guiding and dithering',
            card: {
                title: 'Guiding or dithering failed to settle',
                introduction:
                    'Your settle parameters may need adjustment. Review the PHD2 settings in the dithering documentation to identify which parameter to change.',
                links: [
                    {
                        label: 'PHD2 settle settings',
                        url: 'https://nighttime-imaging.eu/docs/master/site/advanced/dithering/#settings-for-phd2'
                    }
                ]
            }
        }
    ]
};
