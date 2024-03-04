import CryptoJS from 'crypto-js';
import JSEncrypt from "jsencrypt/bin/jsencrypt.min.js";
class Comm {
    constructor() {}
    aesEn(word:string, key:string) {
        let keys = CryptoJS.enc.Utf8.parse(key);
        var srcs = CryptoJS.enc.Utf8.parse(word);
        var encrypted = CryptoJS.AES.encrypt(srcs, keys, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
        });
        return encrypted.toString();
    }
    rsaEn(word:string, keyStr:string) {
        let crypt = new JSEncrypt();
        crypt.setPublicKey(keyStr);
        let str = crypt.encrypt(word);
        if (str) {
          return str;
        } else {
          return false;
        }
    }
    aesCbcEn(word:string) {
      if(!word) return word;
      let SYSTEMCONFIG:any = JSON.parse(<string>sessionStorage.getItem('Admin-System-config'));
      let key = CryptoJS.enc.Utf8.parse(SYSTEMCONFIG.ck);
      let iv = CryptoJS.enc.Utf8.parse(SYSTEMCONFIG.iv);
      let encrypted = CryptoJS.AES.encrypt(word, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      return encrypted.toString(); // 返回的是base64格式的密文
    }
}
const comm = new Comm()

export default comm;