"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunicationService = void 0;
const axios_1 = __importDefault(require("axios"));
class CommunicationService {
    constructor(config) {
        this.config = config;
        this.client = axios_1.default.create({
            baseURL: this.config.baseUrl,
            headers: {
                'x-client-id': this.config.clientId,
                'x-client-password': this.config.clientPassword,
                'Content-Type': 'application/json',
            },
        });
    }
    /**
     * Send SMS using Infinito API
     * @param from Sender ID
     * @param to Recipient phone number (with country code, e.g., 919212356070)
     * @param message Message text
     * @param tag Optional client information
     */
    sendSMS(from, to, message, tag) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = {
                    apiver: '1.0',
                    sms: {
                        ver: '2.0',
                        dlr: {
                            url: '',
                        },
                        messages: [
                            {
                                udh: '0',
                                coding: 1,
                                text: message,
                                property: 0,
                                id: Date.now().toString(), // Using timestamp as message ID
                                addresses: [
                                    {
                                        from: from,
                                        to: to,
                                        seq: '1',
                                        tag: tag,
                                    },
                                ],
                            },
                        ],
                    },
                };
                const response = yield this.client.post('/unified/v2/send', payload);
                return response.data;
            }
            catch (error) {
                console.error('Error sending SMS:', error);
                throw error;
            }
        });
    }
    /**
     * Send bulk SMS using Infinito API
     * @param from Sender ID
     * @param recipients Array of recipient phone numbers
     * @param message Message text
     * @param tag Optional client information
     */
    sendBulkSMS(from, recipients, message, tag) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addresses = recipients.map((to, index) => ({
                    from: from,
                    to: to,
                    seq: (index + 1).toString(),
                    tag: tag,
                }));
                const payload = {
                    apiver: '1.0',
                    sms: {
                        ver: '2.0',
                        dlr: {
                            url: '',
                        },
                        messages: [
                            {
                                udh: '0',
                                coding: 1,
                                text: message,
                                property: 0,
                                id: Date.now().toString(),
                                addresses: addresses,
                            },
                        ],
                    },
                };
                const response = yield this.client.post('/unified/v2/send', payload);
                return response.data;
            }
            catch (error) {
                console.error('Error sending bulk SMS:', error);
                throw error;
            }
        });
    }
    /**
     * Send Email using Infinito API
     * @param subject Email subject
     * @param to Array of recipients
     * @param options Additional email options
     */
    sendEmail(_a) {
        return __awaiter(this, arguments, void 0, function* ({ subject, to, cc, bcc, personalizationData, attachments, category, webhookUrl, }) {
            try {
                const payload = {
                    apiver: '1.0',
                    email: Object.assign(Object.assign({ ver: '1.0' }, (webhookUrl && {
                        dlr: {
                            url: webhookUrl,
                        },
                    })), { messages: [
                            Object.assign({ id: Date.now().toString(), addresses: [
                                    Object.assign(Object.assign(Object.assign(Object.assign({ subject: subject, address_seq_id: `seq_${Date.now()}`, to: to.map((recipient, index) => ({
                                            emailid: recipient.email,
                                            name: recipient.name,
                                            seq: `to_${index + 1}`,
                                        })) }, (cc && {
                                        cc: cc.map((recipient, index) => ({
                                            emailid: recipient.email,
                                            name: recipient.name,
                                            seq: `cc_${index + 1}`,
                                        })),
                                    })), (bcc && {
                                        bcc: bcc.map((recipient, index) => ({
                                            emailid: recipient.email,
                                            name: recipient.name,
                                            seq: `bcc_${index + 1}`,
                                        })),
                                    })), (personalizationData && {
                                        personalization_data: personalizationData,
                                    })), (attachments && {
                                        attachments: attachments.map(att => (Object.assign({ content: att.content, filename: att.filename, type: att.type, disposition: att.disposition }, (att.contentId && {
                                            content_id: att.contentId,
                                        })))),
                                    })),
                                ] }, (category && { category })),
                        ] }),
                };
                const response = yield this.client.post('/unified/v2/send', payload);
                return response.data;
            }
            catch (error) {
                console.error('Error sending email:', error);
                throw error;
            }
        });
    }
    /**
     * Send WhatsApp message using Infinito API
     */
    sendWhatsApp(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.client.post('/whatsapp/send', {
                    phone_number: payload.to,
                    message: payload.message,
                });
                return response.data;
            }
            catch (error) {
                console.error('Error sending WhatsApp message:', error);
                throw error;
            }
        });
    }
}
exports.CommunicationService = CommunicationService;
