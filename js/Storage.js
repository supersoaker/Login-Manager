'use strict';

var Storage = {

    /**
     * the localStorage name
     * @type {String}
     */
    storageName: 'loginManager',

    /**
     * the local js-cache (reflecting the localStorage)
     * @type {Array}
     */
    _cache: {
        passwordHash: '',
        logins: []
    },


    /**
     * update the localStorage with the local cache variable
     * @private
     */
    _updateStorage: function() {
        localStorage.removeItem(this.storageName);
        var jsonString = JSON.stringify(this._cache);
        localStorage.setItem(this.storageName, jsonString);
    },

    /**
     * checks if a password is set in the localStorage
     * @returns {boolean}
     */
    checkIfPasswordIsSet: function() {
        if( localStorage && localStorage.getItem(this.storageName) !== null ){
            var jsonString  = localStorage.getItem(this.storageName);
            this._cache     = JSON.parse(jsonString);
//            console.log( "getPropStoage", this.getPropFromStorage('passwordHash') )
            return !!this.getPropFromStorage('passwordHash');
        } else {
            return false;
        }
    },

    /**
     * function to get a login by id
     * @param {int} loginId - the id of the wanted login
     * @returns {Object}
     */
    getLoginById: function( loginId ) {
        var logins          = this.getPropFromStorage('logins'),
            loginPosInArr   = loginId- 1,
            login           = logins[ loginPosInArr ];
        return login;
    },

    /**
     * function to delete a login from the storage
     * @param loginId
     */
    removeLoginFromStorage: function( loginId ){
        var logins          = this.getPropFromStorage('logins'),
            loginPosInArr   = loginId- 1,
            login           = logins[ loginPosInArr ],
            deleteAnswer    = confirm('"'+ login.title +'" wirklich löschen ?');

        if( deleteAnswer ){
            logins.splice( loginPosInArr, 1 );
            this.setPropToStorage( 'logins', logins );
            PageHandler.changePageTo('overview');
        } else {
            PageHandler.changePageTo('overview');
        }
    },

    /**
     * function to set a prop to the storage
     * @param {String} prop - the property-key
     * @param {*} value - the value which is going to be saved
     */
    setPropToStorage: function(prop, value) {
        console.log( "setPropToStorage [ "+ prop +" ]" )
        this._cache[prop] = value;
        this._updateStorage();
    },

    /**
     * function to get a property from the localStorage( local JS-Cache )
     * @param {String} prop - the property which is wanted
     * @param {*} defaultParam - the variable that is return by default
     * @returns {*} - the variable from the storage
     */
    getPropFromStorage: function(prop, defaultParam) {
        defaultParam = ( typeof defaultParam === "undefined" ) ? false : defaultParam;
        if(this._cache[prop]){
            return this._cache[prop];
        } else {
            console.warn('Localstorage does not contains "'+ prop +'"');
            return defaultParam;
        }
    },

    /**
     * function to get the whole storage
     * @returns {Array} - the current cached storage
     */
    getStorage: function() {
        return this._cache;
    }, clearStorage: function() {
        localStorage.removeItem( this.storageName );
    }
};
