ac-mobile
=========

Avalanche Canada Mobile Application

###Dependencies
* Cordova
* AngularJS
* Ionic Framework

###Setup
```
$ npm install -g cordova ionic
$ npm install
$ bower install
```
*If running a local build - the below command should be run from within the project folder. This pulls in platform hooks that enable http requests for IOS9*
```
git clone https://github.com/driftyco/ionic-package-hooks.git ./package-hooks
```

###Running in a browser
*device api calls will not function*

```
$ ionic serve
```

###Running on a device
Valid platforms are `ios` and `android`

```
$ ionic platform add <platform>
$ ionic build <platform>
$ ionic emulate <platform>
```

