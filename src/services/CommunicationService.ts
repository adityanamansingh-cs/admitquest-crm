import axios from 'axios';

interface CommunicationConfig {
    clientId: string;
    clientPassword: string;
    baseUrl: string;
}

interface SMSAddress {
    from: string;
    to: string;
    seq: string;
    tag?: string;
}

interface SMSMessage {
    udh: string;
    coding: number;
    text: string;
    property: number;
    id: string;
    addresses: SMSAddress[];
}

interface SMSPayload {
    apiver: string;
    sms: {
        ver: string;
        dlr?: {
            url: string;
        };
        messages: SMSMessage[];
    };
}

interface MessagePayload {
    to: string;
    message: string;
}

interface EmailRecipient {
    emailid: string;
    name?: string;
    seq?: string;
}

interface EmailAttachment {
    content: string; // base64 encoded content
    filename: string;
    type: string;
    disposition: 'attachment' | 'inline';
    content_id?: string;
}

interface EmailAddress {
    subject: string;
    address_seq_id: string;
    to: EmailRecipient[];
    cc?: EmailRecipient[];
    bcc?: EmailRecipient[];
    personalization_data?: Record<string, any>;
    attachments?: EmailAttachment[];
}

interface EmailMessage {
    id: string;
    addresses: EmailAddress[];
    category?: string;
}

interface EmailPayload {
    apiver: string;
    email: {
        ver: string;
        dlr?: {
            url: string;
        };
        messages: EmailMessage[];
    };
}

export class CommunicationService {
    private config: CommunicationConfig;
    private client: any;

    constructor(config: CommunicationConfig) {
        this.config = config;
        this.client = axios.create({
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
    async sendSMS(
        from: string,
        to: string,
        message: string,
        tag?: string,
    ): Promise<any> {
        try {
            const payload: SMSPayload = {
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

            const response = await this.client.post(
                '/unified/v2/send',
                payload,
            );
            return response.data;
        } catch (error) {
            console.error('Error sending SMS:', error);
            throw error;
        }
    }

    /**
     * Send bulk SMS using Infinito API
     * @param from Sender ID
     * @param recipients Array of recipient phone numbers
     * @param message Message text
     * @param tag Optional client information
     */
    async sendBulkSMS(
        from: string,
        recipients: string[],
        message: string,
        tag?: string,
    ): Promise<any> {
        try {
            const addresses: SMSAddress[] = recipients.map((to, index) => ({
                from: from,
                to: to,
                seq: (index + 1).toString(),
                tag: tag,
            }));

            const payload: SMSPayload = {
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

            const response = await this.client.post(
                '/unified/v2/send',
                payload,
            );
            return response.data;
        } catch (error) {
            console.error('Error sending bulk SMS:', error);
            throw error;
        }
    }

    /**
     * Send Email using Infinito API
     * @param subject Email subject
     * @param to Array of recipients
     * @param options Additional email options
     */
    async sendEmail({
        subject,
        to,
        cc,
        bcc,
        personalizationData,
        attachments,
        category,
        webhookUrl,
    }: {
        subject: string;
        to: { email: string; name?: string }[];
        cc?: { email: string; name?: string }[];
        bcc?: { email: string; name?: string }[];
        personalizationData?: Record<string, any>;
        attachments?: {
            content: string;
            filename: string;
            type: string;
            disposition: 'attachment' | 'inline';
            contentId?: string;
        }[];
        category?: string;
        webhookUrl?: string;
    }): Promise<any> {
        try {
            const payload: EmailPayload = {
                apiver: '1.0',
                email: {
                    ver: '1.0',
                    ...(webhookUrl && {
                        dlr: {
                            url: webhookUrl,
                        },
                    }),
                    messages: [
                        {
                            id: Date.now().toString(),
                            addresses: [
                                {
                                    subject: subject,
                                    address_seq_id: `seq_${Date.now()}`,
                                    to: to.map((recipient, index) => ({
                                        emailid: recipient.email,
                                        name: recipient.name,
                                        seq: `to_${index + 1}`,
                                    })),
                                    ...(cc && {
                                        cc: cc.map((recipient, index) => ({
                                            emailid: recipient.email,
                                            name: recipient.name,
                                            seq: `cc_${index + 1}`,
                                        })),
                                    }),
                                    ...(bcc && {
                                        bcc: bcc.map((recipient, index) => ({
                                            emailid: recipient.email,
                                            name: recipient.name,
                                            seq: `bcc_${index + 1}`,
                                        })),
                                    }),
                                    ...(personalizationData && {
                                        personalization_data:
                                            personalizationData,
                                    }),
                                    ...(attachments && {
                                        attachments: attachments.map(att => ({
                                            content: att.content,
                                            filename: att.filename,
                                            type: att.type,
                                            disposition: att.disposition,
                                            ...(att.contentId && {
                                                content_id: att.contentId,
                                            }),
                                        })),
                                    }),
                                },
                            ],
                            ...(category && { category }),
                        },
                    ],
                },
            };

            const response = await this.client.post(
                '/unified/v2/send',
                payload,
            );
            return response.data;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    /**
     * Send WhatsApp message using Infinito API
     */
    async sendWhatsApp(payload: MessagePayload): Promise<any> {
        try {
            const response = await this.client.post('/whatsapp/send', {
                phone_number: payload.to,
                message: payload.message,
            });
            return response.data;
        } catch (error) {
            console.error('Error sending WhatsApp message:', error);
            throw error;
        }
    }
}
