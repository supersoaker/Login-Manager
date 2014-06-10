'use strict';

var init = function() {

    Main.init();
};
var clone = function( obj ) {
    return $.extend({}, obj);
};

var Main = {

    config: {
        sessionInterval: 0,
        sessionSeconds: 0,
        userSession: 30
    },
    password: '',
    naviStructure: '',


    init: function() {
        this._checkIfStorageContainsPassword();
        this.naviStructure = $('#navi-template').text();

        this.onResize();
        $(window).on('resize', this.onResize);

        PageHandler.init();
        Overview.init();
        NewLoginData.init();
        Config.init();

		Config.updateMainConfig();
        this._startSessionInterval();

        $('body').on('click', function () {
            this.config.sessionSeconds = 0;
        }.bind(this));

        $('#savePassword').on('click', this._savePassword.bind(this));
        $('#submitPassword').on('click', this._checkIfPasswordIsCorrect.bind(this));
    },

    onResize: function() {
        $('.content').css( 'height', (window.innerHeight - 50) );
//        $('body').css( 'width', (window.innerWidth - 40) );
        $('#overlay').css( 'width', (window.innerWidth - 40) );
        if(window.innerHeight > 430){
            $('#overlay').css( 'height', (window.innerHeight - 40) );
        }
    },

    updateNavi: function( page, naviTitle ) {
        if(typeof naviTitle === 'undefined'){
            naviTitle = ''; }
        var data = {
            page: page,
            pageTitle: naviTitle
        };
        var text = this.naviStructure;
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
        console.log( "passwordIsSet", passwordIsSet )
        console.log( $('#passwordIsset') )
        console.log( $('#passwordIsNull') )
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
    updateSessionInterval: function() {
        clearInterval( this.config.sessionInterval );
        this.config.sessionSeconds = 0;
        this._startSessionInterval();
    },

    /**
     * check if the user is already online, if not kill the session
     * @private
     */
    _startSessionInterval: function() {
        console.log("start new interval")
        this.config.sessionInterval = setInterval( function(){
            this.config.sessionSeconds++;
            console.log( this.config.userSession )
            if( this.config.sessionSeconds === this.config.userSession ){
                this.resetApplication();
            }
        }.bind(this), 1000 );
    },

    resetApplication: function() {
        this.password = '';
        $('#passwordInput').val("");
        $('#newPasswordInput').val("");
        $('#config-div').hide();
        $('#overlay').hide();
        Overview.hideConfig();
        PageHandler.changePageTo('welcome');
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
        $('#passwordIsset').show();
        $('#passwordIsNull').hide();
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