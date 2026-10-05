# NINA.Bot

Discord support commands for N.I.N.A., plus autofocus report analysis, unit conversion and image-scale calculations. Registers 45 slash commands and the **Analyze Autofocus Report** message action.

## Imaging workflow commands

| Category | Commands |
| --- | --- |
| Guides and tools | `/plugins`, `/backup`, `/download`, `/imagescale` |
| Troubleshooting | `/platesolve` |
| Equipment | `/dither`, `/flats` |
| Autofocus and sequencing | `/autofocus`, `/meridianflip`, `/sequencer` |

These additions use public reply cards and appear in the existing private `/help` category browser. `/download` links to current official downloads and version-specific requirements without fetching release information at runtime.

### Image scale

Use `/imagescale pixelsize:3.76 focallength:800` for **0.9694 arcsec/pixel**. Pixel size is in micrometers and effective focal length is in millimeters, including reducers or Barlows. Inputs describe an unbinned sensor.

Provide both native sensor dimensions in pixels to include approximate horizontal and vertical field of view: `/imagescale pixelsize:3.76 focallength:800 width:6248 height:4176` produces **100.9515 x 67.4733 arcmin**. Results are rounded to four decimal places. Invalid inputs receive a private explanation.

The calculator matches N.I.N.A.'s `AstroUtil.ArcsecPerPixel`: `(180 / Math.PI) * 3600 / 1000 * (pixelSize / focalLength)`. Field of view uses the small-angle approximation, `scale * dimension / 60`, in arcminutes.

## Development

Use Node.js 26.5.0 or newer and npm 12.0.1 or newer.

```sh
npm ci
npm run lint
npm test
```

The tests run locally without a bot token or Discord connection. Autofocus tests render real graphs and serve report fixtures over a local HTTP server. The test script requires at least 80% line, function and branch coverage.

For a live bot, configure `DISCORD_TOKEN`, `CLIENT_ID` and `GUILD_ID` in the deployment environment or a local `.env` file, then run `node index.js`. Startup registers commands in the configured guild. `PRIVACY_POLICY_URL` optionally overrides the privacy policy link.

## Reply content

General replies live in `commands/MessageCommands/content`, grouped by help category. Each definition has a slash command name, description and card content. Content consists of a title, introduction and optional sections, links and media. Use a card function only when values must be resolved per request, as with the privacy URL.

`GeneralReplyCommand` provides registration and delivery. `commands/ReplyCard.js` renders Discord Components V2 cards with shared styling. Keep topic files free of Discord builders. Keep essential instructions in the card, use code blocks for paths and commands and give links descriptive labels. Screenshots and animations need media descriptions; tutorial videos use link buttons.

The current layout supports one row of up to five links and a gallery of up to ten media items. Keep the complete message within Discord's 40-component and 4,000-character text limits. Tests serialize every general reply with the actual discord.js builders and check these limits. Do not truncate instructions to fit: edit the content deliberately.

Custom commands such as conversion and autofocus keep their own implementations. Register them with a category in `Bot.js`. Help reads the registered command instances, including descriptions and context actions. Its private category menu updates the same message without running the listed commands or storing a session.

## Release checks

- Run lint and the full test suite on a supported Node/npm runtime after the final edit.
- Keep the command registration fixture in `test/fixtures/application-commands.json` unchanged unless a command contract intentionally changes.
- In a test Discord server, check `/docs`, `/logs`, `/support`, `/cameratimeout`, `/cmd`, `/stars`, `/overshoot` and `/shutdown` on desktop and mobile. Verify readable spacing, copyable paths, usable links and visible media.
- With a second account, confirm general replies are public while `/help` and its updates are visible only to the requester. Browse every category and return to Overview.
- Check the nine imaging workflow guidance cards listed above on desktop and mobile, including their documentation buttons and the `/sequencer` example. Confirm all ten new commands appear once in their assigned help categories.
- Check `/imagescale` with and without both sensor dimensions. Confirm a public result card, readable units and private validation errors when only one dimension is supplied or a required number is zero.
- Check `/privacy` with and without the override, `/convert` autocomplete and both autofocus entry points before deploying.

Local payload tests cannot verify Discord client rendering or the availability of remote media.

The Discord attachment URLs for the overshoot animation, .NET screenshot and shutdown clip returned HTTP 404 during this update. Their original references are intentionally retained pending replacement asset URLs. The Nahimic screenshot uses the verified working copy in the N.I.N.A. documentation.
