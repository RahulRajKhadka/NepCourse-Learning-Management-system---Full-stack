import crypto from 'crypto';

class EsewaService {
  constructor() {
    this.secretKey = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';
    this.productCode = process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST';
    this.paymentUrl = process.env.NODE_ENV === 'production' 
      ? 'https://epay.esewa.com.np/api/epay/main/v2/form'
      : 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
    this.statusCheckUrl = process.env.NODE_ENV === 'production'
      ? 'https://epay.esewa.com.np/api/epay/transaction/status/'
      : 'https://rc.esewa.com.np/api/epay/transaction/status/';
  }

  /**
   * Generate HMAC SHA256 signature
   * @param {string} message - Message to sign (format: "total_amount,transaction_uuid,product_code")
   * @returns {string} Base64 encoded signature
   */
  generateSignature(message) {
    const hmac = crypto.createHmac('sha256', this.secretKey);
    hmac.update(message);
    return hmac.digest('base64');
  }

  /**
   * Verify signature from eSewa response
   * @param {Object} data - Response data from eSewa
   * @returns {boolean} True if signature is valid
   */
  verifySignature(data) {
    const { signature, signed_field_names, ...rest } = data;
    const fields = signed_field_names.split(',');
    const message = fields.map(field => rest[field]).join(',');
    const expectedSignature = this.generateSignature(message);
    return signature === expectedSignature;
  }

  /**
   * Create payment data for eSewa
   * @param {Object} params - Payment parameters
   * @returns {Object} Payment form data
   */
  createPaymentData(params) {
    const {
      amount,
      taxAmount = 0,
      serviceCharge = 0,
      deliveryCharge = 0,
      transactionUuid,
      successUrl,
      failureUrl
    } = params;

    const totalAmount = parseFloat(amount) + parseFloat(taxAmount) + 
                       parseFloat(serviceCharge) + parseFloat(deliveryCharge);

    // Generate signature
    const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${this.productCode}`;
    const signature = this.generateSignature(message);

    return {
      amount: amount.toString(),
      tax_amount: taxAmount.toString(),
      total_amount: totalAmount.toString(),
      transaction_uuid: transactionUuid,
      product_code: this.productCode,
      product_service_charge: serviceCharge.toString(),
      product_delivery_charge: deliveryCharge.toString(),
      success_url: successUrl,
      failure_url: failureUrl,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      signature: signature
    };
  }

  /**
   * Check payment status
   * @param {Object} params - Status check parameters
   * @returns {Promise<Object>} Payment status
   */
  async checkPaymentStatus(params) {
    const { transactionUuid, totalAmount } = params;
    
    const url = `${this.statusCheckUrl}?product_code=${this.productCode}&total_amount=${totalAmount}&transaction_uuid=${transactionUuid}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(`Failed to check payment status: ${error.message}`);
    }
  }

  /**
   * Decode base64 response from eSewa
   * @param {string} encodedData - Base64 encoded response
   * @returns {Object} Decoded response data
   */
  decodeResponse(encodedData) {
    const decoded = Buffer.from(encodedData, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  }

  /**
   * Generate unique transaction UUID
   * @param {string} prefix - Prefix for transaction (e.g., userId or orderId)
   * @returns {string} Unique transaction UUID
   */
  generateTransactionUuid(prefix = '') {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
  }
}

const instance = new EsewaService();
export default instance;