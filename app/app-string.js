var CryptoJS = require('crypto-js');
var sha256 = require('js-sha256').sha256;

module.exports = {
  encrypt: function(message) {
    var b64 = CryptoJS.AES.encrypt(message, Config.secret).toString();
    var e64 = CryptoJS.enc.Base64.parse(b64);
    var eHex = e64.toString(CryptoJS.enc.Hex);
    return eHex;
  },

  decrypt: function(cipherText) {
    var reb64 = CryptoJS.enc.Hex.parse(cipherText);
    var bytes = reb64.toString(CryptoJS.enc.Base64);
    var decrypt = CryptoJS.AES.decrypt(bytes, Config.secret);
    var plain = decrypt.toString(CryptoJS.enc.Utf8);
    return plain;
  },
  
  encryptObject: function(obj) {
    var b64 = CryptoJS.AES.encrypt(JSON.stringify(obj), Config.secret).toString();
    var e64 = CryptoJS.enc.Base64.parse(b64);
    var eHex = e64.toString(CryptoJS.enc.Hex);
    return eHex;
  },

  decryptObject: function(cipherText) {
    var reb64 = CryptoJS.enc.Hex.parse(cipherText);
    var bytes = reb64.toString(CryptoJS.enc.Base64);
    var decrypt = CryptoJS.AES.decrypt(bytes, Config.secret);
    var plain = decrypt.toString(CryptoJS.enc.Utf8);
    return JSON.parse(plain);
  },

  format: function(format, params) {
    return (arguments.length < 2
	    ? values
	    : format.replace(/\{([0-9]+)\}/g, (match, p) => arguments[parseInt(p) + 1])
	   );
  },

  hmacSha256: function(key, message) {
    return sha256.hmac(key, message);
  },
  
};
