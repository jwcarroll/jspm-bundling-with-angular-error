#JSPM + Angular 1.2.8 Bundling Error

After a recent upgrade I noticed that our production build was no longer working.

I managed to trace it back to an issue with bundling using JSPM and Angular.
Something between the two isn't playing nicely.

**This is the simplest recreation of the error**

##Recreating The Error

```
npm install
npm start
```

1. Now open a browser and navigate to http://localhost:8081/
2. Open up the dev tools and inspect the console to see the following error:

```
TypeError: Cannot read property '0' of undefined
    at link (http://localhost:8081/scripts/app/app-bundle.js:7533:34)
    at nodeLinkFn (http://localhost:8081/scripts/app/app-bundle.js:3055:19)
    at compositeLinkFn (http://localhost:8081/scripts/app/app-bundle.js:2620:19)
    at compositeLinkFn (http://localhost:8081/scripts/app/app-bundle.js:2622:19)
    at compositeLinkFn (http://localhost:8081/scripts/app/app-bundle.js:2622:19)
    at compositeLinkFn (http://localhost:8081/scripts/app/app-bundle.js:2622:19)
    at compositeLinkFn (http://localhost:8081/scripts/app/app-bundle.js:2622:19)
    at compositeLinkFn (http://localhost:8081/scripts/app/app-bundle.js:2622:19)
    at publicLinkFn (http://localhost:8081/scripts/app/app-bundle.js:2556:17)
    at http://localhost:8081/scripts/app/app-bundle.js:760:31 <input type="text" class="form-control ng-pristine ng-valid" ng-model="message">
```

**Note: ** The actual code that is blowing up is the `ngModel` directive built into Angular:

```javascript
var ngModelDirective = function() {
	return {
		require: ['ngModel', '^?form'],
		controller: NgModelController,
		link: function(scope, element, attr, ctrls) {
			/*
			* Normally 'ctrls' would be an array of required
			*  directive controllers, but for some reason is
			*  undefined when bundled with JSPM.
			*/
			var modelCtrl = ctrls[0], // <-- BOOM! (Cannot read property '0' of undefined)
				formCtrl = ctrls[1] || nullFormCtrl;
			formCtrl.$addControl(modelCtrl);
			scope.$on('$destroy', function() {
				formCtrl.$removeControl(modelCtrl);
			});
		}
	};
};
```