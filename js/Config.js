"use strict";

var Config = {

    _templates: {},

    // default user-configs
    userConfig: {
        import: {
            replaceLogins: false
        },
	    export: {
		    //
			exportConfigs: false
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
        },
        userSession: {
            minutes: 0,
            seconds: 30
        }
    },


    init: function() {
        this._templates.generator = $('#generator-config-template').text();
        this._templates.timeout   = $('#timeout-config-template').text();
        this._templates.export    = $('#export-config-template').text();
        this._templates.import    = $('#import-config-template').text();

        this.useStorageConfigs();
    },

    useStorageConfigs: function() {
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

	updateMainConfig: function(){
		var secs = parseInt(this.userConfig.userSession.seconds),
			mins = parseInt(this.userConfig.userSession.minutes),
			interv = (secs + mins * 60);
		Main.config.userSession = interv;
		Main.updateSessionInterval();
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
            this.updateMainConfig();
            Storage.setPropToStorage('userSession', this.userConfig.userSession);
        }


        $('#overlay').hide();
    },

    triggerConfig: function( specificConfig ) {
        var bool = this.userConfig[ this._currentConfig ][ specificConfig ];
        this.userConfig[ this._currentConfig ][ specificConfig ] = !bool;
    },


    //import
    showImportConfigs: function() {
        var divId   = '#import-config',
            data    = this._templates.import,
            tpl     = new jSmart( data ),
            newHtml = tpl.fetch( clone( this.userConfig.pwGeneratorConfig ) );
        console.log( Storage.getStorage() )
        $( divId ).html( newHtml );
        this._currentOverlay = divId;
        this._currentConfig = "import";
        this.showDialog( divId, "Passwörter importieren");
    },
    importLogins: function() {
        var importString = $('#import-string-field').val();
        var importPassword = $('#import-password').val();
        try {
            var obj = JSON.parse( importString );
        } catch (e) {
            return false;
        }
        for (var key in obj) {
            if( key == "logins" ){
                var logins = Storage.getPropFromStorage( key, []);
                logins.forEach(function( login, i ) {
                    login = {
                        id          : login.id,
                        title       : login.title,
                        username    : Cryptic.decrypt( login.username, importPassword ),
                        email       : Cryptic.decrypt( login.email, importPassword ),
                        password    : Cryptic.decrypt( login.password, importPassword ),
                        description : Cryptic.decrypt( login.description, importPassword )
                    };

                    logins[i] = {
                        id          : Storage.getPropFromStorage('logins', []).length +1 ,
                        title       : login.title,
                        username    : Cryptic.encrypt( login.username ),
                        email       : Cryptic.encrypt( login.email ),
                        password    : Cryptic.encrypt( login.password ),
                        description : Cryptic.encrypt( login.description )
                    };
                });
                if( this.userConfig.import.replaceLogins ) {
                    Storage.setPropToStorage( key, obj["logins"] );
                } else {
                    Storage.setPropToStorage( key, logins.concat( obj["logins"] ) );
                }
                PageHandler.changePageTo('overview');
            } else {
                Storage.setPropToStorage( key, obj[key] );
            }
        }
        this.useStorageConfigs();
        this.hideOverlay();
    },

	//export
	showExportConfigs: function(){
		var divId   = '#export-config',
			data    = this._templates.export,
			tpl     = new jSmart( data ),
			newHtml = tpl.fetch( clone( this.userConfig.pwGeneratorConfig ) );
		$( divId ).html( newHtml );
		this._currentOverlay = divId;
		this._currentConfig = "export";
		this.showDialog( divId, "Passwörter exportieren");
	},

    updateExport: function() {
        var exportString = '';
        var storage = clone( Storage.getStorage() );
        delete storage.passwordHash;
        if( !this.userConfig.export.exportConfigs ){
            storage = {  logins: storage.logins  };
        }
        var storageString = JSON.stringify( storage );
        $('#mail-link').attr('href', 'mailto:?subject=Passw%C3%B6rter%20exportieren&body='+ storageString);
        $('#export-string-field').text( storageString );
    },


	//PW
    showPwGeneratorConfigs: function() {
        var divId   = '#pw-generator-config',
            data    = this._templates.generator,
            tpl     = new jSmart( data ),
            newHtml = tpl.fetch( clone( this.userConfig.pwGeneratorConfig ) );
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



	//Timeout
    showTimeoutConfigs: function() {
        var divId   = '#timeout-config',
            data    = this._templates.timeout,
            tpl     = new jSmart( data ),
            newHtml = tpl.fetch( clone( this.userConfig.userSession ) );

        $( divId ).html( newHtml );
        this._currentOverlay = divId;
        this._currentConfig = "userSession";
        this.showDialog( divId, "Ablauf der Sitzung");
    },

    updateTimeout: function( action, num ) {
        if( action === "seconds" ){
            this.userConfig.userSession.seconds = parseInt( num );
        } else
        if ( action === "minutes" ) {
            this.userConfig.userSession.minutes = parseInt( num );
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