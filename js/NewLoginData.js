'use strict';

var NewLoginData = {

    config: {},

    _container: {},
    _editedLogin: {},

    /**
     * the initialize function
     */
    init: function() {
        this._container = $('#newLoginData');
        $('#submitNewLoginData').on('click', this._addNewLoginData.bind(this));
        $('#submitEditedLogin').on('click', this._saveEditedLogin.bind(this));
    },

    editLogin: function( login ) {
        this._container.find('#loginTitle').val( login.title );
        this._container.find('#username').val( login.username );
        this._container.find('#email').val( login.email );
        this._container.find('#login-password').val( login.password );
        this._container.find('#description').val( login.description );
        $('#submitNewLoginData').hide();
        $('#submitEditedLogin').show();
        this._editedLogin = login;
    },

    _getLoginFromInputs: function() {
        var login           = {},
            valid           = true;
        login.title         = this._container.find('#loginTitle').val();
        login.username      = this._container.find('#username').val();
        login.email         = this._container.find('#email').val();
        login.password      = this._container.find('#login-password').val();
        login.description   = this._container.find('#description').val();

        /** Check if valid */
        if(login.title === ''){
            this._container.find('#loginTitle').addClass('error');
            valid = false;
        } else {
            this._container.find('#loginTitle').removeClass('error');
        }
        if(login.password === ''){
            this._container.find('#login-password').addClass('error');
            valid = false;
        } else {
            this._container.find('#login-password').removeClass('error');
        }
        if(valid === false){
            return false;
        } else {
            // reset all inputs, text-areas
            this._container.find( 'input, textarea').each(function() { $(this).val(''); });
        }
        /** Check if valid End */

        return login;
    },

    _saveEditedLogin: function() {
        var loginArr    = Storage.getPropFromStorage('logins', []),
            login       = this._getLoginFromInputs();

        if( login === false ){
            return false;
        }

        login.id = this._editedLogin.id;
        login = {
            id          : login.id,
            title       : login.title,
            username    : Cryptic.encrypt( login.username ),
            email       : Cryptic.encrypt( login.email ),
            password    : Cryptic.encrypt( login.password ),
            description : Cryptic.encrypt( login.description )
        };

        // update the edited login in the login array
        loginArr[ login.id-1 ] = login;

        // update the new login array in the storage
        Storage.setPropToStorage( 'logins', loginArr );

        // change page to overview
        PageHandler.changePageTo('overview');

        // reset the local variable editedLogin
        this._editedLogin = {};
        return true;
    },

    /**
     * function to validate the new login-form
     * @returns {boolean}
     * @private
     */
    _addNewLoginData: function() {
        var loginArr    = Storage.getPropFromStorage('logins', []),
            login       = this._getLoginFromInputs();

        if( login === false ){
            return false;
        }

        // set the id of the login
        login.id        = loginArr.length + 1;
        login = {
            id          : login.id,
            title       : login.title,
            username    : Cryptic.encrypt( login.username ),
            email       : Cryptic.encrypt( login.email ),
            password    : Cryptic.encrypt( login.password ),
            description : Cryptic.encrypt( login.description )
        };

        // add this login to the login-array
        loginArr.push(login);

        // update the new login array in the storage
        Storage.setPropToStorage( 'logins', loginArr );

        // change page to overview
        PageHandler.changePageTo('overview');
        return true;
    }

};