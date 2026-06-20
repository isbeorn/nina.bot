const { MessageCommand } = require('./MessageCommand');

class RepairCommand extends MessageCommand {
    constructor() {
        super(['!repair'], 'repair', 'How to repair a N.I.N.A. installation');
    }

    async process(message) {
        const response = `
        **Repairing a N.I.N.A. installation**

1. Close N.I.N.A.
2. Open Windows **Add or remove programs**.
3. Search for **N.I.N.A.**.
4. Select N.I.N.A. and click **Modify**.
5. Click **Repair** and follow the installer prompts.
        `;

        await message.reply(response);
    }
}

module.exports.RepairCommand = RepairCommand;
