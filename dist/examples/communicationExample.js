"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommunicationService_1 = require("../services/CommunicationService");
const fs = __importStar(require("fs"));
// Initialize the communication service
const communicationService = new CommunicationService_1.CommunicationService({
    clientId: 'YOUR_CLIENT_ID', // e.g., ABClientc6a31cf8dae
    clientPassword: 'YOUR_CLIENT_PASSWORD', // e.g., vwr46h499lloeyj9873kduwq
    baseUrl: 'https://api.goinfinito.com',
});
function sendMessages() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Example of sending SMS (previous code)
            yield communicationService.sendSMS('SENDER', // Your sender ID
            '919212356070', // Recipient number with country code
            'This is a test message', 'TestMessage');
            console.log('Single SMS sent successfully!');
            // Example of sending an email with attachments
            const pdfAttachment = fs.readFileSync('path/to/your/file.pdf', {
                encoding: 'base64',
            });
            yield communicationService.sendEmail({
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
            yield communicationService.sendBulkSMS('SENDER', // Your sender ID
            recipients, 'This is a bulk test message', 'BulkTestMessage');
            console.log('Bulk SMS sent successfully!');
        }
        catch (error) {
            console.error('Error sending messages:', error);
        }
    });
}
// Execute the example
sendMessages();
