'use strict';
//String.prototype.capitalize = function() {
//    return this.charAt(0).toUpperCase() + this.slice(1);
//};

var PageHandler = {

    config: {},

    _pages: {
        'welcome'       : {  },
        'overview'      : { config: true,      add : true  },
        'detail'        : { back: 'overview',  edit: true  },
        'newLoginData'  : { back: 'overview',  edit: false }
    },
    _currentPage: '',

    init: function() {
        this._currentPage = 'welcome';
    },

    changePageTo: function( pageTitle, pageParams ) {
        if(typeof pageParams === 'undefined'){
            pageParams = {}; }
        if( this._pages[pageTitle] ){
            var prevPage    = this._currentPage,
                $prevPage   = $('#'+ prevPage),
                $nextPage   = $('#'+ pageTitle);
            if( prevPage === 'welcome' ) {
                $('#navi').show();
            }
            if( pageTitle === 'welcome' ){
                $('#navi').hide();
            }
            if( pageTitle === 'overview' ){
                Overview.updateOverviewPage();
            }
            Main.updateNavi( pageTitle, pageParams );

            $prevPage.hide();
            $nextPage.show();
            this._currentPage = pageTitle;
        } else {
            console.warn('App.Services.PageHandler._pages[] does not contain "'+ pageTitle +'". ');
        }
    }

};