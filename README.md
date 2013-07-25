angular-firebase-patch
======================

Firebase inside Angular world. Firebase.onAngular, Firebase.onceAngular, etc... All promises, wrapped inside Angular kingdom so you don't have to worry about $scope.$apply & shit.

Obv checkout angularFire that is sick but I also needed some more freedom around Firebase in my Angular app.

Supported :

**READ**
- onceAngular : returns a promise resolving a snapshot
- onAngular : returns a promise resolving a snapshot for the FIRST trigger + calls the callback you give it everytime

**WRITE**

- setAngular : returns a firebase reference so you can do .name() and shit
- pushAngular : same

firebase references returned by WRITE operations also contains a custom "data" attribute that contains the original data you wanted to set/push

**Firebase.onceAngular**
```javascript
var ref = new Firebase('https://myFirebase.firebaseIO.com/my/data');
ref.onceAngular('value').then(function(snapshot){
 $scope.data = snapshot.val();
});
````

**Firebase.onAngular**
```javascript
var ref = new Firebase('https://myFirebase.firebaseIO.com/my/data');
ref.onAngular('value', function(snapshot) {
  $scope.data = snapshot.val();
});
````

**Firebase.setAngular**
```javascript
var ref = new Firebase('https://myFirebase.firebaseIO.com/my/data/attribute');
ref.setAngular({my: "object"}).then(function(ref){
 $scope.dataHasBeenSet = true
});
```

**Firebase.pushAngular**
var ref = new Firebase('https://myFirebase.firebaseIO.com/my/data/array');
ref.pushAngular({my: "object", is:"a cool object"}).then(function(pushRef){
 // pushRef.data == {my: "object", is:"a cool object"}
 // If we need to get it back for any reason
 var data = pushRef.data;
 // Get the name of the entry (generated by Firebase on a push) and set it on the data
 data.firebaseId = pushRef.name();
 $scope.dataSet.push(data);
});
