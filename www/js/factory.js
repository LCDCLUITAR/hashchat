angular.module('starter.factory', ['firebase'])
.factory("general", function(){
    return{
        redirect: function(path){
            window.location.replace(path);
        },
        getCurrDate: function(){
            var currentdate = new Date(); 
            return datetime = currentdate.getDate() + "/"
                            + (currentdate.getMonth()+1)  + "/" 
                            + currentdate.getFullYear() + " @ "  
                            + currentdate.getHours() + ":"  
                            + currentdate.getMinutes() + ":" 
                            + currentdate.getSeconds();
        }
    }
})
.factory("userSession", function() {
    var logged = false;
    var currUser = {};
    
    return{
        setLoggedStatus: function(status){
            logged = status;
        },
        getLoggedStatus: function(){
            return logged;
        },
        setCurrUser: function(userInfo){
            //console.log(userInfo);
            
            currUser.displayName    = userInfo.displayName;
            currUser.email          = userInfo.email;
            currUser.photoURL       = userInfo.photoURL;
            currUser.providerId     = userInfo.providerId;
            currUser.uid            = userInfo.uid;
        },
        getCurrUser: function(){
            return currUser;
        }
    };
});
