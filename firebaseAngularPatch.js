angular.module('AngularFirebase', [])
.factory('AngularFirebasePatch', function($timeout, $q){

  var angularWrap = $timeout;

  var FirebaseCaller = function(functionToCall, type, params, callback) {

    var defer = $q.defer(); 
    var defaultParams;
    // keep a handy reference to ref
    var ref;

    // Read mode : Firebase expect a callback with the snapshot
    if (type == "read") {
      defaultParams = [
        function(snapshot) {
          angularWrap(function(){
            // Callback is for "on" events
            if (callback) callback(snapshot);
            defer.resolve(snapshot);
          });
        }
      ];  
    } 
    // Write mode : callback is just passed an error object (null if no error)
    else {
      defaultParams = [
        function(error) {
          angularWrap(function(){
            if (callback) callback(error);
            if (error != null) defer.reject(error);
            else {
              if (functionToCall == "push") ref.data = params[0];
              defer.resolve(ref);
            }
          });
        }
      ];
    } 

    // params must be an array to be concatenated with our defaultParams and passed
    // to .apply
    if (params) {
      defaultParams = params.concat(defaultParams);
    }

    // This must be set by callers to the Firebase instance
    ref = this[functionToCall].apply(this, defaultParams);

    return defer.promise;
  };



  // Let's patch Firebase to wrap dat shit in Angular
  Firebase.prototype =  _.extend(Firebase.prototype, {
    onceAngular:function(eventName) {
      return FirebaseCaller.apply(this, ["once", "read", [eventName]]);
    },
    onAngular:function(eventName, callback) {
      return FirebaseCaller.apply(this, ["on", "read", [eventName], callback]);
    },
    pushAngular:function(data) {
      return FirebaseCaller.apply(this, ["push", "write", [data]]);
    },
    setAngular:function(data) {
      return FirebaseCaller.apply(this, ["set", "write", [data]]);
    }

  });


});
