import CryptoJS from "crypto-js";

export const encrypt = ({ plainText, signature }) => {
  return CryptoJS.AES.encrypt(plainText, signature).toString();
};

export const decrypt = ({ encryptedText, signature }) => {
  return CryptoJS.AES.decrypt(encryptedText, signature).toString(
    CryptoJS.enc.Utf8
  );
};
