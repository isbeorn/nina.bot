module.exports = {
    id: 'autofocus',
    label: 'Autofocus and sequencing',
    replies: [
        {
            name: 'autofocus',
            description: 'Understand autofocus curves, setup and failed runs',
            card: {
                title: 'N.I.N.A. autofocus guidance',
                introduction:
                    'For the built-in **Star HFR** routine, aim for a well-sampled curve with measurements on both sides of best focus. Autofocus plugins can use different algorithms and settings.',
                sections: [
                    {
                        heading: 'Read the curve',
                        text: '**Horizontal axis:** Focuser position. **Vertical axis:** Star HFR, a measure of star size; lower is better.\nThe fitted minimum estimates best focus. Error bars show measurement uncertainty. A high R-squared describes the fit to the points, but does not by itself prove the final image is sharp.'
                    },
                    {
                        heading: 'Check the setup',
                        text: '1. Start near focus and choose a **Step Size** that samples a clear change in HFR without moving so far that stars disappear.\n2. **Initial Offset Steps** counts autofocus step sizes, not individual motor steps. The initial outward movement is this value multiplied by Step Size.\n3. Check star detection both near focus and at the outer points. Adjust exposure for the filter and conditions if stars are missed.\n4. Check backlash compensation with `/overshoot`.'
                    },
                    {
                        heading: 'If validation fails',
                        text: '**Curve:** Check for clouds, missing stars, scattered points or a flat side caused by backlash.\n**Validation:** Review the R-squared threshold and final HFR comparison; investigate poor measurements before relaxing thresholds.\n**Share a run:** Use `/afreport` to find the JSON report and `/afgraph` to analyze it. For plugin autofocus, include the plugin name and version and consult its documentation.'
                    }
                ],
                links: [
                    {
                        label: 'Autofocus guide',
                        url: 'https://nighttime-imaging.eu/docs/master/site/advanced/autofocus/'
                    },
                    {
                        label: 'Autofocus settings',
                        url: 'https://nighttime-imaging.eu/docs/master/site/tabs/options/autofocus/'
                    }
                ]
            }
        },
        {
            name: 'meridianflip',
            description: 'Configure and troubleshoot automated meridian flips',
            card: {
                title: 'N.I.N.A. meridian flips',
                introduction:
                    'An automated meridian flip needs coordinated N.I.N.A. and mount settings. Suitable timing depends on your mount and the physical clearance of the telescope, camera and cables.',
                sections: [
                    {
                        heading: 'Enable and check',
                        text: "1. In the **Advanced Sequencer**, add the **Meridian Flip** trigger to the instruction set containing your imaging run. In the legacy sequencer, enable the target's automated meridian flip option.\n2. Review **Options > Imaging > Auto Meridian Flip** alongside the mount driver's meridian limits and flip behavior. Confirm location, time and reported pier side are correct.\n3. Test the configuration while observing the equipment and confirm there is clearance throughout the movement."
                    },
                    {
                        heading: 'Understand the timing',
                        text: '**Minutes after meridian** and **Max. minutes after meridian** define the flip window. Equal values can introduce a wait; a range lets N.I.N.A. flip after an exposure ends inside that window.\n**Pause before meridian** stops imaging and tracking before crossing, then waits for the flip time. Use a pause if your equipment needs that clearance. There is no universal safe timing preset.'
                    },
                    {
                        heading: 'After the flip',
                        text: 'Enable recentering if needed and verify plate solving works first with `/platesolve`. If the flip or recovery fails, share the session log, mount/driver details, flip settings and sequence. Identify whether the failure happened during the slew, recentering or guiding restart.'
                    }
                ],
                links: [
                    {
                        label: 'Meridian flip guide',
                        url: 'https://nighttime-imaging.eu/docs/master/site/advanced/meridianflip/'
                    }
                ]
            }
        },
        {
            name: 'sequencer',
            description:
                'Understand advanced sequencer instructions, loops and triggers',
            card: {
                title: 'N.I.N.A. advanced sequencer',
                introduction:
                    'Build an imaging run from instruction sets, then attach loop conditions and triggers to the set they should control. Use `/expressions` for a private, step-by-step guide to expressions, symbols and functions in N.I.N.A. 3.3.',
                sections: [
                    {
                        heading: 'Three building blocks',
                        text: '**Instructions** do the work, such as taking an exposure.\n**Loop conditions** decide whether a set continues repeating. Without one, a sequential set runs once. All attached conditions must remain satisfied.\n**Triggers** run an action when an event is due, such as dithering after a number of exposures, then return to the sequence.'
                    },
                    {
                        heading: 'Example: expose and dither',
                        text: '```text\nDeep Sky Object instruction set\n  Loop condition: Loop For Iterations = 20\n  Trigger: Dither After Exposures = 5\n  Instruction: Take Exposure\n```\nThe exposure is the work inside the set. The loop repeats it; the trigger requests dithering at the configured interval. Connect and configure the required equipment first.'
                    },
                    {
                        heading: 'Why did it stop or skip?',
                        text: '**Parent conditions:** Conditions on enclosing sets also apply. When a condition is no longer met, the current instruction finishes and remaining instructions in that set are skipped.\n**Validation:** Resolve reported validation issues before running; invalid instructions are skipped.\n**Placement:** Check which set owns each trigger and condition. Parent triggers also apply to nested instructions. Share the sequence and `/logs` if the behavior remains unclear.'
                    }
                ],
                links: [
                    {
                        label: 'Advanced sequencer guide',
                        url: 'https://nighttime-imaging.eu/docs/master/site/sequencer/advanced/advanced/'
                    },
                    {
                        label: 'Trigger reference',
                        url: 'https://nighttime-imaging.eu/docs/master/site/sequencer/advanced/triggers/'
                    }
                ]
            }
        },
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
