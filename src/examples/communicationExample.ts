import { CommunicationService } from '@/services/CommunicationService';
import * as fs from 'fs';

// Initialize the communication service
const communicationService = new CommunicationService({
    clientId: 'YOUR_CLIENT_ID', // e.g., ABClientc6a31cf8dae
    clientPassword: 'YOUR_CLIENT_PASSWORD', // e.g., vwr46h499lloeyj9873kduwq
    baseUrl: 'https://api.goinfinito.com',
});

async function sendMessages() {
    try {
        // Example of sending SMS (previous code)
        await communicationService.sendSMS(
            'SENDER', // Your sender ID
            '919212356070', // Recipient number with country code
            'This is a test message',
            'TestMessage', // Optional tag
        );
        console.log('Single SMS sent successfully!');

        // Example of sending an email with attachments
        const pdfAttachment = fs.readFileSync('path/to/your/file.pdf', {
            encoding: 'base64',
        });

        await communicationService.sendEmail({
            subject: 'Welcome to Our Service',
            to: [
                { email: 'username@example.com', name: 'Username' },
                { email: 'jack@example.com', name: 'Jack' },
            ],
            cc: [{ email: 'ryan@example.com', name: 'Ryan' }],
            bcc: [{ email: 'rahul_sharma@example.com', name: 'Rahul Sharma' }],
            personalizationData: {
                name: 'Example Name',
                // Add any other personalization fields
            },
            attachments: [
                {
                    content: pdfAttachment,
                    filename: 'examplefile.pdf',
                    type: 'application/pdf',
                    disposition: 'attachment',
                },
            ],
            category: 'Welcome Email',
            webhookUrl: 'https://youroptionalwebhookurl.com',
        });
        console.log('Email sent successfully!');

        // Example of sending bulk SMS (previous code)
        const recipients = ['919212356070', '919212356071', '919212356072'];

        await communicationService.sendBulkSMS(
            'SENDER', // Your sender ID
            recipients,
            'This is a bulk test message',
            'BulkTestMessage', // Optional tag
        );
        console.log('Bulk SMS sent successfully!');
    } catch (error) {
        console.error('Error sending messages:', error);
    }
}

// Execute the example
sendMessages();
