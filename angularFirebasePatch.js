angular.module('AngularFirebase', [])
.run(['$timeout', '$q', function($timeout, $q){

	var angularWrap = $timeout;

	var FirebaseCaller = function(functionToCall, type, params, callback) {


		// Create an array to hold our Firebase refs and clean them later on
		if (!this.refsArray) {
			this.refsArray = [];
		}

		var defer = $q.defer();
		var defaultParams;
		// keep a handy reference to ref
		var ref;

		// Read mode : Firebase expect a callback with the snapshot
		if (type == "read") {

			var makeReadFn = function(callback) {
				return function(snapshot) {
					var args = arguments;
					angularWrap(function(){
						// Callback is for "on" events
						if (callback) {
							callback.apply(null, args);
						}
						defer.resolve(snapshot);
					});
				};
			};

			/// Generate a new fn to clear it later
			var readFn = makeReadFn(callback);

			defaultParams = [
				readFn
			];

			// Add an error handler

			defaultParams.push(function(error){
				defer.reject(error);
			});


			// Keep that against the ref to clean it later
			this.refsArray.push({
				type: params[0], // is the type
				fn: readFn,
				context: this
			});

		}
		// Write mode : callback is just passed an error object (null if no error)
		else {
			defaultParams = [
				function(error) {
					angularWrap(function(){
						if (callback) {
							callback(error);
						}
						if (error != null) {
							defer.reject(error);
						}
						else {
							if (functionToCall == "push") {
								ref.data = params[0];
							}
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

		// We're gonna provide as context (this) to clear listeners later
		if (type === "read") {
			defaultParams.push(this);
		}

		// This must be set by callers to the Firebase instance
		ref = this[functionToCall].apply(this, defaultParams);

		return defer.promise;
	};



	// Let's patch Firebase to wrap dat shit in Angular
	Firebase.prototype =  angular.extend(Firebase.prototype, {
		onceAngular: function(eventName) {
			return FirebaseCaller.apply(this, ["once", "read", [eventName]]);
		},
		onAngular: function(eventName, callback) {
			return FirebaseCaller.apply(this, ["on", "read", [eventName], callback]);
		},
		pushAngular: function(data) {
			return FirebaseCaller.apply(this, ["push", "write", [data]]);
		},
		setAngular: function(data) {
			return FirebaseCaller.apply(this, ["set", "write", [data]]);
		},
		removeAngular: function() {
			return FirebaseCaller.apply(this, ["remove", "write", []]);
		},
		cleanListeners: function() {
			var _this = this;
			this.refsArray.forEach(function(refObject){
				_this.off(refObject.type, refObject.fn, refObject.context);
			});
			return this;
		}

	});


}]);
