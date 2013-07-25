angular-firebase-patch
======================

Firebase inside Angular world. Firebase.onAngular, Firebase.onceAngular, etc... All promises, wrapped inside Angular kingdom so you don't have to worry about $scope.$apply & shit.

Obv checkout angularFire that is sick but I also needed some more freedom around Firebase in my Angular app.

Supported :
* READ:
- onceAngular : returns a promise resolving a snapshot
- onAngular : returns a promise resolving a snapshot for the FIRST trigger + calls the callback you give it everytime
* WRITE:
- setAngular : returns a firebase reference so you can do .name() and shit
- pushAngular : same

firebase references returned by WRITE operations also contains a custom "data" attribute that contains the original data you wanted to set/push

**Firebase.onceAngular**
```javascript
var ref = new Firebase('https://myFirebase.firebaseIO.com');
ref.onceAngular('value').then(function(snapshot){
 $scope.data = snapshot.val();
});
````

**Firebase.onAngular**
```javascript
var ref = new Firebase('https://myFirebase.firebaseIO.com');
ref.onAngular('value', function(snapshot) {
  $scope.data = snapshot.val();
});
````
