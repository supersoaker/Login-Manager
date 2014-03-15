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


    showConfig: function() {
        alert(" TODO: edit config menu ");
        // TODO: edit config menu
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