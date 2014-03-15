'use strict';

var Cryptic = {

    /**
     * the format object for CryptoJS
     */
    JsonFormatter: {
        stringify: function (cipherParams) {
            // create json object with ciphertext
            var jsonObj = {
                ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)
            };

            // optionally add iv and salt
            if (cipherParams.iv) {
                jsonObj.iv = cipherParams.iv.toString();
            }
            if (cipherParams.salt) {
                jsonObj.s = cipherParams.salt.toString();
            }

            // stringify json object
            return JSON.stringify(jsonObj);
        },

        parse: function (jsonStr) {
            // parse json string
            var jsonObj = JSON.parse(jsonStr);

            // extract ciphertext from json object, and create cipher params object
            var cipherParams = CryptoJS.lib.CipherParams.create({
                ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct)
            });

            // optionally extract iv and salt
            if (jsonObj.iv) {
                cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv)
            }
            if (jsonObj.s) {
                cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s)
            }

            return cipherParams;
        }
    },

    /** ( entschlüsseln )
     * function to decrypt a message with a key
     * @param {String} message - the message which is going to be decrypted
     * @param {String} key - the decryption-key
     * @returns {String} - the decrypted string
     */
    decrypt: function( message, key ) {
        if( typeof key === 'undefined' ){
            key = Main.password;
        }
        var format      = this.JsonFormatter,
            decrypted   = CryptoJS.AES.decrypt( message, key, { format: format } );
        return decrypted.toString( CryptoJS.enc.Utf8 );
    },

    /** ( verschlüsseln )
     * function to encrypt a message with a key
     * @param {String} message - the message which is going to be encrypted
     * @param {String} key - the encryption-key
     * @returns {String} - the encrypted string
     */
    encrypt: function( message, key ) {
        if( typeof key === 'undefined' ){
            key = Main.password;
        }
        var format = this.JsonFormatter,
            encrypted = CryptoJS.AES.encrypt( message, key, { format: format }  );
        return encrypted + "";
    },

    /**
     * function to get the sha512 hash value from the param
     * @param {String} value - the value
     * @returns {String} - the value as hash
     */
    getHash: function(value) {
        return CryptoJS.SHA512(value).toString(CryptoJS.enc.Hex);
    }

};