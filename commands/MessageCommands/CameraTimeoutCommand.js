
const Discord = require('discord.js');
const { MessageCommand } = require('./MessageCommand');


class CameraTimeoutCommand extends MessageCommand {
    constructor() {
        super(['!cameratimeout'], 'cameratimeout', 'Running into camera image timeout issues?');
    }

    async process(message) {
        const embed = new Discord.EmbedBuilder()
            .setTitle('Camera image timeout troubleshooting')
            .setDescription(
                `
If you encounter image download timeout failures, follow these steps to diagnose and resolve the issue:

### 1. Cable Quality  
- **Cause**: Poor quality or faulty USB cables can cause data transmission errors.  
- **Solution**:  
    - Use high-quality USB cables.  
    - Avoid using excessively long cables.  
    - Avoid multiple USB cables packed together.  

### 2. Power Supply  
- **Cause**: Inadequate power supply to the camera.  
- **Solution**:  
    - Ensure the camera is receiving adequate power, especially if it has an external power source.  

### 3. USB Bandwidth Issues  
- **Cause**: USB bandwidth is insufficient, especially if using multiple USB devices or a USB hub.  
- **Solution**:  
    - Ensure the camera is connected directly to a high-speed USB 3.0 port.  
    - Reduce the number of other USB devices connected to the same hub or port.  

### 4. Camera Settings  
- **Cause**: High frame rates or large image sizes may exceed available bandwidth or memory.  
- **Solution**:  
    - Reduce the USB Limit setting if available.  

### 5. Software Version  
- **Cause**: Using an outdated version of the camera drivers.  
- **Solution**:  
    - Ensure you have the latest version of the camera drivers and firmware.  
    - Check the vendor's website for updates.  

### 6. System Resources  
- **Cause**: Insufficient system resources (CPU, RAM) can lead to failures in image download.  
- **Solution**:  
    - Close unnecessary applications and processes to free up system resources.  
    - Ensure your system meets the recommended specifications for the camera.  

If the problem persists after following these steps, please reach out for further assistance. Provide detailed information about your setup, the circumstances under which the error occurs, steps to reproduce the issue, and a log file where the issue occurred.  
Thank you.  
                `
            );
        await message.reply({ embeds: [embed] });
    }
}

module.exports.CameraTimeoutCommand = CameraTimeoutCommand;
