module.exports = {
    id: 'equipment',
    label: 'Equipment',
    replies: [
        {
            name: 'dither',
            description: 'Configure PHD2 dithering and understand settling',
            card: {
                title: 'Dithering with N.I.N.A. and PHD2',
                introduction:
                    'Dithering shifts the pointing position between exposures. N.I.N.A. requests the move from PHD2 and waits for settling before continuing imaging.',
                sections: [
                    {
                        heading: 'Connect and enable',
                        text: '1. Start PHD2 and select **Tools > Enable Server**. Connect the guide equipment and establish guiding.\n2. Connect PHD2 in **Equipment > Guider** in N.I.N.A. and review its settings using the gear button.\n3. Add **Dither After Exposures** to the appropriate Advanced Sequencer instruction set, or enable dithering in the legacy sequence.'
                    },
                    {
                        heading: 'Choose the dither amount',
                        text: '**PHD2 Dither Pixels** is measured in guide-camera pixels. The movement in imaging-camera pixels depends on the ratio of the two image scales; use `/imagescale` for each optical train.\nPHD2 multiplies the requested amount by its own **Scale** setting. Keep that at 1 if you want to control the amount entirely in N.I.N.A.'
                    },
                    {
                        heading: 'Understand settling',
                        text: '**Pixel tolerance:** The allowed guiding error, in guide-camera pixels.\n**Minimum settle time:** How long guiding must remain within that tolerance; leaving it restarts the timer.\n**Settle timeout:** The maximum wait before settling is declared failed. These are separate settings, not interchangeable delays.\nIf settling fails, use `/settlefailed` and inspect the N.I.N.A. and PHD2 logs before changing the limits.'
                    }
                ],
                links: [
                    {
                        label: 'Dithering and PHD2 settings',
                        url: 'https://nighttime-imaging.eu/docs/master/site/advanced/dithering/'
                    }
                ]
            }
        },
        {
            name: 'flats',
            description:
                'Configure Flat Wizard and troubleshoot flat exposures',
            card: {
                title: 'N.I.N.A. Flat Wizard',
                introduction:
                    'Flat Wizard takes test exposures to find settings that reach your chosen histogram mean, then captures the requested flats.',
                sections: [
                    {
                        heading: 'Choose the mode',
                        text: "**Dynamic Exposure:** Adjust exposure time with a fixed light-source brightness.\n**Dynamic Brightness:** Keep exposure time fixed and adjust a compatible flat panel's brightness.\n**Sky Flats:** Recalculate exposure as the sky brightness changes. Automatic dark-flat capture is unavailable in this mode because flat exposure times vary."
                    },
                    {
                        heading: 'Set the target and limits',
                        text: "1. Select the filter, gain, offset and binning appropriate for the images you will calibrate.\n2. Set **Histogram Mean Target** and **Mean Tolerance**. The mean target is a percentage of the camera's full-scale value, not a fixed ADU value shared by every camera.\n3. Set minimum and maximum exposure times or panel brightness, according to the mode. Start the wizard and check the test result."
                    },
                    {
                        heading: 'If the target cannot be reached',
                        text: '**Too bright at the minimum:** Dim the panel or light source, or lower the allowed exposure if suitable for your camera.\n**Too dark at the maximum:** Increase illumination or the allowed exposure.\n**Changing brightness:** Check panel stability, obstructions and the selected filter. For sky flats, use Sky Flats mode.\nWhen capturing dark flats in a supported mode, fully block the light as prompted.'
                    }
                ],
                links: [
                    {
                        label: 'Flat Wizard guide',
                        url: 'https://nighttime-imaging.eu/docs/master/site/tabs/flatwizard/'
                    }
                ]
            }
        },
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
