"use strict";

var Config = {

    _templates: {},

    // default user-configs
    userConfig: {
        userSession: 30, //seconds
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

        for ( var config in this.userConfig ){
            if( this.userConfig.hasOwnProperty(config) ){
                this.userConfig[ config ]
                    = Storage.getPropFromStorage( config, this.userConfig[ config ] );
            }
        }
        // todo: config in storage speichern
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


        $('#overlay').hide();
    },

    triggerConfig: function( specificConfig ) {
        var bool = this.userConfig[ this._currentConfig ][ specificConfig ];
        this.userConfig[ this._currentConfig ][ specificConfig ] = !bool;
    },

    showPwGeneratorConfigs: function() {
        var divId   = '#pw-generator-config',
            tpl     = new jSmart( this._templates.generator),
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

    showDialog: function( divId, headline ) {
        if(typeof headline === "undefined"){ headline = "";  }
        $('#overlay-headline').text( headline );
        $('#overlay-wrapper>div').hide();
        $( divId ).show();
        this._showOverlay();
    }
};