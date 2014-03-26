"use strict";

var Config = {

    _templates: {},

    // default user-configs
    userConfig: {
        userSession: {
            minutes: 0,
            seconds: 30
        },
        pwGeneratorConfig: {
            // länge des passworts
            length: 8,
            // sonderzeichen
            specifics: false,
            // zahlen
            numbers: true,
            // großbuchstaben
            capitals: true
        }

    },


    init: function() {
        this._templates.generator = $('#generator-config-template').text();
        this._templates.timeout   = $('#timeout-config-template').text();

        for ( var config in this.userConfig ){
            if( this.userConfig.hasOwnProperty(config) ){
                this.userConfig[ config ]
                    = Storage.getPropFromStorage( config, this.userConfig[ config ] );
                Storage.setPropToStorage( config, this.userConfig[ config ] );
            }
        }
    },

    _currentOverlay: "",
    _currentConfig: "",

    _showOverlay: function() {
        $('#overlay').show();
    },

    hideOverlay: function() {
        // pwConfigs
        if( this._currentOverlay === "#pw-generator-config" ){
            var pwConfigs = this.userConfig.pwGeneratorConfig.length;
            if( pwConfigs+"" === "" || pwConfigs+"" === "NaN" ){ this.userConfig.pwGeneratorConfig.length = 8; }
            if( pwConfigs < 3 ){ this.userConfig.pwGeneratorConfig.length = 3; }
            Storage.setPropToStorage('pwGeneratorConfig', this.userConfig.pwGeneratorConfig);
        }

        // timeoutConfigs
        if( this._currentOverlay === "#timeout-config" ){
            var secs = parseInt(this.userConfig.userSession.seconds),
                mins = parseInt(this.userConfig.userSession.minutes),
                interv = (secs + mins * 60);
            Main.config.userSession = interv;
            Main.updateSessionInterval();
            Storage.setPropToStorage('userSession', this.userConfig.userSession);
        }


        $('#overlay').hide();
    },

    triggerConfig: function( specificConfig ) {
        var bool = this.userConfig[ this._currentConfig ][ specificConfig ];
        this.userConfig[ this._currentConfig ][ specificConfig ] = !bool;
    },

    showPwGeneratorConfigs: function() {
        var divId   = '#pw-generator-config',
            data    = this._templates.generator,
            tpl     = new jSmart( data ),
            newHtml = tpl.fetch( this.userConfig.pwGeneratorConfig );
        $( divId ).html( newHtml );
        this._currentOverlay = divId;
        this._currentConfig = "pwGeneratorConfig";
        this.showDialog( divId, "Passwort Konfigurationen");
    },

    updatePwLength: function( elem ) {
        if( elem.value === "" ){ return; }
        var newLength = parseInt( elem.value );
        if( newLength+"" === "NaN" ){ return; }

        newLength = ( newLength > 20 ) ? 20 : newLength;
        this.userConfig.pwGeneratorConfig.length = newLength;

        $('#pw-length-input').val( newLength );
        $('#pw-length-range').val( newLength );
    },


    showTimeoutConfigs: function() {
        var divId   = '#timeout-config',
            data    = this._templates.timeout,
            tpl     = new jSmart( data ),
            newHtml = tpl.fetch( this.userConfig.userSession );

        $( divId ).html( newHtml );
        this._currentOverlay = divId;
        this._currentConfig = "userSession";
        this.showDialog( divId, "Ablauf der Sitzung");
    },

    updateTimeout: function( action, num ) {
        if( action === "seconds" ){
            this.userConfig.userSession.seconds = num;
        } else
        if ( action === "minutes" ) {
            this.userConfig.userSession.minutes = num;
        }
    },

    showDialog: function( divId, headline ) {
        if(typeof headline === "undefined"){ headline = "";  }
        $('#overlay-headline').text( headline );
        $('#overlay-wrapper>div').hide();
        $( divId ).show();
        this._showOverlay();
    }
};