'use strict';

var Detail = {

    config: {},

    currentViewed: {},

    init: function() {},

    removeLoginData: function(){
        var loginId = this.currentViewed.id;
        Storage.removeLoginFromStorage( loginId );
    },

    editLogin: function() {
        PageHandler.changePageTo( 'newLoginData' );
        NewLoginData.editLogin( this.currentViewed );
    },

    showLogin: function( loginId ) {
        $('#editButton').on('click', this.removeLoginData.bind(this));
        var login       = Storage.getLoginById( loginId ),
            tplText     = $('#detail-template').html(),
            tpl         = new jSmart( tplText ),
            data        = {
                id          : login.id,
                title       : login.title,
                username    : Cryptic.decrypt( login.username ),
                email       : Cryptic.decrypt( login.email ),
                password    : Cryptic.decrypt( login.password ),
                description : Cryptic.decrypt( login.description )
            };
        this.currentViewed = data;
        $('#details-wrapper').html( tpl.fetch( data ) );

    }


};