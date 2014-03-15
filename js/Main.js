'use strict';

var init = function() {
    Main.init();
};


var Main = {

    config: {
        sessionInterval: 0,
        sessionSeconds: 0,
        userSession: 120 //seconds
    },
    password: '',


    init: function() {
        this._startSessionInterval();
        this._checkIfStorageContainsPassword();

        $('.content').css( 'height', (window.innerHeight - 50) );

        PageHandler.init();
        Overview.init();
        NewLoginData.init();

        $('body').on('click', this._updateSessionInterval.bind(this));

        $('#savePassword').on('click', this._savePassword.bind(this));
        $('#submitPassword').on('click', this._checkIfPasswordIsCorrect.bind(this));
    },

    updateNavi: function( page, naviTitle ) {
        if(typeof naviTitle === 'undefined'){
            naviTitle = ''; }
        var data = {
            page: page,
            pageTitle: naviTitle
        };
        var text = $('#navi-template').text();
        var tpl = new jSmart( text );
        var res = tpl.fetch( data );
        $('#navi').html( res );
    },

    /**
     * Checks if the user has already a password and show the respective dialog
     * @private
     */
    _checkIfStorageContainsPassword: function() {
        var passwordIsSet = Storage.checkIfPasswordIsSet();
        if( passwordIsSet ){
            $('#passwordIsset').show();
        } else {
            $('#passwordIsNull').show();
        }
    },

    /**
     * Update the session interval, because the user is already active
     * @private
     */
    _updateSessionInterval: function() {
        clearInterval( this.config.sessionInterval );
        this.config.sessionSeconds = 0;
        this._startSessionInterval();
    },

    /**
     * check if the user is already online, if not kill the session
     * @private
     */
    _startSessionInterval: function() {
        this.config.sessionInterval = setInterval( function(){
            this.config.sessionSeconds++;
            if( this.config.sessionSeconds === this.config.userSession ){
                this.password = '';
                PageHandler.changePageTo('welcome');
            }
        }.bind(this), 1000 );
    },

    /**
     * Saves the password into the localStorage and redirects to the overview page
     * @private
     */
    _savePassword: function() {
        this.password = $('#newPasswordInput').val();
        var hash      = Cryptic.getHash(this.password);
        Storage.setPropToStorage('passwordHash', hash);
        PageHandler.changePageTo('overview');
    },

    /**
     * Checks if the password is correct
     * @private
     */
    _checkIfPasswordIsCorrect: function() {
        var password    = $('#passwordInput').val(),
            hash        = Cryptic.getHash(password),
            storageHash = Storage.getPropFromStorage('passwordHash');

        if( hash === storageHash ) {
            this.password = password;
            PageHandler.changePageTo('overview');
            $('#wrong-password-p').hide();
            $('.passwordContent').removeClass('has-error');
        } else {
            $('#wrong-password-p').show();
            $('.passwordContent').addClass('has-error');
        }
    }

};