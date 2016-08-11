angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, userSession, general) {
    // Redirect function
    $scope.redirect = function(path){
        general.redirect(path);
    }
    /*=========================================================
    *** Controller to check for login status and redirect
    *** if necessary. Status will be stored in factory
    ==========================================================*/
    function authDataCallback(authData) {
        if(authData)
            console.log("User " + authData.uid + " is logged in with " + authData.provider);
        else
            console.log("User is logged out");
    }    
    
    // Callback that fires every time auth state changes
    var ref = new Firebase("https://hashchat-1bb5c.firebaseio.com");
    ref.onAuth(authDataCallback); 
    
    // Check if there is a user logged in
    $scope.$watch(function(){ return userSession.getLoggedStatus() }, function (newVal, oldVal){
        if (typeof newVal !== 'undefined')
            $scope.logged = userSession.getLoggedStatus();      
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
    $scope.fbApp.database().ref('room').on('value', function(snapshot){
        $scope.rooms = snapshot.val();
        console.log($scope.rooms);
    });

    $scope.user = userSession.getCurrUser();
    console.log($scope.user);


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
.controller('Login', function($scope, $ionicModal, $timeout, userSession, general) {
    // Redirect function
    $scope.redirect = function(path){
        general.redirect(path);
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
                window.location.replace('#/app/home');
            }
            else{
                console.log("Error Signing in");
                $scope.logErr = logErr;
            }
        });
    }
});