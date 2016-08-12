angular.module('starter.controllers', ['firebase'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, userSession, general, $state) {
    // Redirect function
    $scope.redirect = function(path){
        general.redirect(path);
    }
    
    // Check if there is a user logged in
    $scope.$watch(function(){ return userSession.getLoggedStatus() }, function (newVal, oldVal){
        if (typeof newVal !== 'undefined')
            $scope.logged = userSession.getLoggedStatus(); 
        console.log($scope.logged);
        if(!$scope.logged)
            $state.go('login');
    });
    
    // Function to log user out and clear it data
    $scope.logout = function(){
        firebase.auth().signOut().then(function() {
            // Set user session to false and refirect to default page
            userSession.setLoggedStatus(false);
            window.location.replace('#/default');
        }, function(error) {
            console.log(error);
        });
    }
    
    // Function to create a random and temporal user with limited access
    $scope.guest = function(){
        console.log('Guest User Created...');
        function randomEl(list) {
            var i = Math.floor(Math.random() * list.length);
            return list[i];
        }
        
        function selectElementContents(el) {
            var range = document.createRange();
            range.selectNodeContents(el);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
        
        var adjectives = ["adamant", "adroit", "amatory", "animistic", "antic", "arcadian", "baleful", "bellicose", "bilious", "boorish", "calamitous", "caustic", "cerulean", "comely", "concomitant", "contumacious", "corpulent", "crapulous", "defamatory", "didactic", "dilatory", "dowdy", "efficacious", "effulgent", "egregious", "endemic", "equanimous", "execrable", "fastidious", "feckless", "fecund", "friable", "fulsome", "garrulous", "guileless", "gustatory", "heuristic", "histrionic", "hubristic", "incendiary", "insidious", "insolent", "intransigent", "inveterate", "invidious", "irksome", "jejune", "jocular", "judicious", "lachrymose", "limpid", "loquacious", "luminous", "mannered", "mendacious", "meretricious", "minatory", "mordant", "munificent", "nefarious", "noxious", "obtuse", "parsimonious", "pendulous", "pernicious", "pervasive", "petulant", "platitudinous", "precipitate", "propitious", "puckish", "querulous", "quiescent", "rebarbative", "recalcitant", "redolent", "rhadamanthine", "risible", "ruminative", "sagacious", "salubrious", "sartorial", "sclerotic", "serpentine", "spasmodic", "strident", "taciturn", "tenacious", "tremulous", "trenchant", "turbulent", "turgid", "ubiquitous", "uxorious", "verdant", "voluble", "voracious", "wheedling", "withering", "zealous"];
        var nouns = ["ninja", "chair", "pancake", "statue", "unicorn", "rainbows", "laser", "senor", "bunny", "captain", "nibblets", "cupcake", "carrot", "gnomes", "glitter", "potato", "salad", "toejam", "curtains", "beets", "toilet", "exorcism", "stick figures", "mermaid eggs", "sea barnacles", "dragons", "jellybeans", "snakes", "dolls", "bushes", "cookies", "apples", "ice cream", "ukulele", "kazoo", "banjo", "opera singer", "circus", "trampoline", "carousel", "carnival", "locomotive", "hot air balloon", "praying mantis", "animator", "artisan", "artist", "colorist", "inker", "coppersmith", "director", "designer", "flatter", "stylist", "leadman", "limner", "make-up artist", "model", "musician", "penciller", "producer", "scenographer", "set decorator", "silversmith", "teacher", "auto mechanic", "beader", "bobbin boy", "clerk of the chapel", "filling station attendant", "foreman", "maintenance engineering", "mechanic", "miller", "moldmaker", "panel beater", "patternmaker", "plant operator",    "plumber", "sawfiler", "shop foreman", "soaper", "stationary engineer", "wheelwright", "woodworkers"];
        
        var tempObj = {displayName: true, email: 'none', photoURL: 'none'/*genRandomPhotoURL()*/, providerId: 'guest', uid: randomEl(adjectives)+' '+randomEl(nouns)};
        userSession.setCurrUser(tempObj);
    }
    
    $scope.fbApp = fbApp;
    $scope.fbApp.database().ref('chat-rooms').on('value', function(snapshot){
        $scope.rooms = snapshot.val();
        console.log($scope.rooms);
    });

    $scope.user = userSession.getCurrUser();
    console.log($scope.user);

    
    /*
    --- Add new chat room function
    */
    
    function updateChatRoom(username, roomName, hashtags, description, pass, photoURL) {
        // A post entry.
        var postData = {
            host: username,
            roomName: roomName,
            keywords: hashtags,
            description: description,
            createdOn: general.getCurrDate(),
            password: pass,
            photo: 'https://cdn.theatlantic.com/assets/media/img/photo/2015/11/images-from-the-2016-sony-world-pho/s01_130921474920553591/main_900.jpg?1448476701'    
        };
    
        // Get a key for a new Post.
        var newPostKey = fbDb.ref().child('chat-rooms').push().key;
    
        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates['/chat-rooms/' + newPostKey] = postData;
        /*updates['/user/' + uid + '/' + newPostKey] = postData;*/
    
        return firebase.database().ref().update(updates);
    }
        
    $scope.addRoom = function(roomInput){
        var host = userSession.getCurrUser().displayName;
        var result = updateChatRoom(host, roomInput.name, roomInput.keywords, roomInput.description, roomInput.pass);
        console.log(roomInput.photo);
        console.log(result);
    }
    
    /*
    --- END OF Add new chat room function
    */
})
.controller('Register', function($scope, $ionicModal, $timeout) {
    console.log('Register');
    $scope.fbApp = fbApp;
    

    $scope.createUser = function(email, pass, conPass){

        if (pass != conPass){
            alert("Passwords don't match!");
        }
        else{
            $scope.fbApp.auth().createUserWithEmailAndPassword(email, pass).catch(function(error){
                alert(error.code + " - " + error.message);
            });
            window.location.replace('#/login');
        }
    }

})
.controller('Login', function($scope, $ionicModal, $timeout, userSession, general, $state){
    // Redirect function
    $scope.redirect = function(path){
        general.redirect(path);
    }   
    
    /*
    --- Facebook Authentication
    */
    $scope.facebookLogin = function(){
        // Facebook Auth
        var FBProvider = new firebase.auth.FacebookAuthProvider();
        FBProvider.addScope('public_profile,user_friends,email,user_birthday,user_photos');
        
        //firebase.auth().signInWithPopup(FBProvider);
        
        firebase.auth().signInWithPopup(FBProvider).then(function(result) {
            if (result.credential) {
                // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                var token = result.credential.accessToken;
            }
            // The signed-in user info.
            var fbUser = result.user;
            console.log('FBUSER');
            console.log(fbUser);
            userSession.setCurrUser(fbUser.providerData[0]);
            userSession.setLoggedStatus(true);
            $state.go('app.home');
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            console.log(errorCode);
            console.log(errorMessage);
            console.log(email);
            console.log(credential);
        });
    }
    /*
    --- END OF Facebook authentication
    */
    
    $scope.twitterLogin = function(){
        var provider = new firebase.auth.TwitterAuthProvider();
        
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
            // You can use these server side with your app's credentials to access the Twitter API.
            var token = result.credential.accessToken;
            var secret = result.credential.secret;
            // The signed-in user info.
            var twitUser = result.user;
            console.log('TwitterUser');
            console.log(twitUser);
            userSession.setCurrUser(twitUser.providerData[0]);
            userSession.setLoggedStatus(true);
            $state.go('app.home');
            // ...
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
    }
    
    console.log('Login');
    $scope.fbApp = fbApp;
    
    $scope.$watch('logErr', function(newVal, oldVal){
        if(typeof newVal !== 'undefined')
            $scope.logErr = newVal;
    });
    
    $scope.Login = function(email, pass){
        var bruteForce = 0;
        var logErr = 0;
        $scope.fbApp.auth().signInWithEmailAndPassword(email, pass).catch(function(error){
            //alert(error.code + " - " + error.message);
            console.log('Error: ' + error.message + error.code);
            logErr = 'The password and email combination did not match. Please try again.'
        }).then(function(){
            // If no error
            if(logErr == 0){
                userSession.setLoggedStatus(true);
                userSession.setCurrUser($scope.fbApp.auth().currentUser.providerData[0]);
                $state.go('app.home');
            }
            else{
                console.log("Error Signing in");
                $scope.logErr = logErr;
            }
        });
    }
});