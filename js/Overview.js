'use strict';

var Overview = {

    config: {},

    overviewLayout: '',

    init: function() {
        this.overviewLayout = $('#overview-template').text();
    },

    searchLoginTitles: function() {
        // todo: suchfunktion
    },

    hideConfig: function() {
        $('#content-wrapper').css('margin-left', '0px');
        setTimeout(function(){
            $('#config-div').hide();
            $('#content-wrapper').off('click', this.hideConfig);
        }.bind(this), 1000);
    },

    showConfig: function() {
        $('#content-wrapper').css('margin-left', '200px');
        $('#config-div').show();
        setTimeout(function(){
            $('#content-wrapper').on('click', this.hideConfig);
        }.bind(this), 1000);
    },

    updateOverviewPage: function(){
        var logins  = Storage.getPropFromStorage('logins', []),
            data    = { logins: logins },
            text    = this.overviewLayout,
            tpl     = new jSmart( text ),
            res     = tpl.fetch( data),
            wrapper = $('#login-wrapper');
        wrapper.html( res );
        wrapper.find('li').on('click', function(){
            PageHandler.changePageTo('detail', $(this).data('title') );
            Detail.showLogin( $(this).data('id') );
        });
    }
};