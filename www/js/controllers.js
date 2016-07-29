angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
    $scope.tempTrending = 
    [
        {name: 'Chat Room 1', photo: 'http://www.volusia.com/wp-content/uploads/2013/07/news.jpg'},
        {name: 'Chat Room 2', photo: 'http://cravecookclick.com/wp-content/uploads/2013/02/bf.png'},
        {name: 'Chat Room 3', photo: 'http://global.fncstatic.com/static/v/all/img/og/og-fn-foxnews.jpg'},
        {name: 'Chat Room 4', photo: 'http://cdn.abclocal.go.com/assets/news/wls/images/logos/default_800x450.jpg'},
        {name: 'Chat Room 5', photo: 'https://lh3.googleusercontent.com/n6FeJLH6b30dsA3kbCGNsufd7fNFxmCHUUqZGCyd4y_7likSVim_J5F7ErgBF2CSNTs=w300'},
        {name: 'Chat Room 6', photo: 'http://www.gannett-cdn.com/uxstatic/usatoday/usat-web-static-2406.0/images/logos/news.png'},
        {name: 'Chat Room 7', photo: 'https://pbs.twimg.com/profile_images/629351437676511232/PnAYQDx8.png'},
        {name: 'Chat Room 8', photo: 'http://www.turn-page.com/wp-content/uploads/2015/10/usa-news.jpg'},
        {name: 'Chat Room 9', photo: 'http://txmgv24xack1i8jje2nayxpr.wpengine.netdna-cdn.com/us/files/2011/04/RS1129_ESPN_Deportes_CLR_Pos-scr.jpg'},
        {name: 'Chat Room 10', photo: 'https://cdn.asiancorrespondent.com/wp-content/uploads/2016/06/Vice-Daily-News-Show-Go90.jpg'}
    ];
});
