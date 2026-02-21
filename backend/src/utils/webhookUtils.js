import crypto from 'crypto';


export const verifyWebhookSignature = (payload, signature, secret) => {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(JSON.stringify(payload)).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
};
