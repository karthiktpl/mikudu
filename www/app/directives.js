app.directive('focus', function() {
    return function(scope, element) {
        element[0].focus();
    }      
});
app.directive('ngModel', function() {
    return {
        require: 'ngModel',
        link: function(scope, elem, attr, ngModel) {
            elem.on('blur', function() {
                ngModel.$dirty = true;
                scope.$apply();
            });

            ngModel.$viewChangeListeners.push(function() {
                ngModel.$dirty = false;
            });

            scope.$on('$destroy', function() {
                elem.off('blur');
            });
        }
    }
});
app.directive('passwordMatch', [function () {
    return {
        restrict: 'A',
        scope:true,
        require: 'ngModel',
        link: function (scope, elem , attrs,control) {
            var checker = function () {
 
                //get the value of the first password
                var e1 = scope.$eval(attrs.ngModel); 
 
                //get the value of the other password  
                var e2 = scope.$eval(attrs.passwordMatch);
                if(e2!=null)
                return e1 == e2;
            };
            scope.$watch(checker, function (n) {
 
                //set the form control to valid if both 
                //passwords are the same, else invalid
                control.$setValidity("passwordNoMatch", n);
            });
        }
    };
}]);
app.directive('ngConfirmClick', [
  function(){
    return {
      priority: -1,
      restrict: 'A',
      link: function(scope, element, attrs){
        element.bind('click', function(e){
          var message = attrs.ngConfirmClick;
          // confirm() requires jQuery
          if(message && !confirm(message)){
            e.stopImmediatePropagation();
            e.preventDefault();
          }
        });
      }
    }
  }
]);
app.directive("remove", function(){
	return function(scope, element, attrs){
		element.bind("click", function(){
			console.log(attrs);
			alert("This is alert #"+attrs.alert);
		});
	};
});
