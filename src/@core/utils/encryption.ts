import * as CryptoJS from 'crypto-js';

import { configService } from '../config/config.service';

export const CryptService = {
  cfg: configService.getSecretConfig(),
  encrypt: (payload: any) => {
        const key = CryptoJS.enc.Hex.parse(CryptService.cfg.key); // 256-bit key. This must be same on frontend
        const iv = CryptoJS.enc.Hex.parse(CryptService.cfg.iv); // 16-byte IV for AES. This must be same on frontend

        // Encrypt the payload
        const encryptedPayload = CryptoJS.AES.encrypt(
          JSON.stringify(payload),
          key,
          {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          },
        ).toString();

        return encryptedPayload;
  },

  /**
   * Decrypts text by given key
   * @param String base64 encoded input data
   * @param Buffer masterkey
   * @returns String decrypted (original) text
   */
  decrypt: (encryptedData: string) => {
    const key = CryptoJS.enc.Hex.parse(CryptService.cfg.key); // 256-bit key. This must be same on frontend
    const iv = CryptoJS.enc.Hex.parse(CryptService.cfg.iv); // 16-byte IV for AES. This must be same on frontend

    // Decryption
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  },
};
