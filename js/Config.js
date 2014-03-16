"use strict";

var Config = {

    _showOverlay: function() {
        $('#overlay').show();
    },

    hideOverlay: function() {
        console.log(12)
        $('#overlay').hide();
    },

    showPwGeneratorDialog: function() {
        this._showOverlay();
    }
};