angular
    .module('loEditFormManager')
    .directive('disableEnter', ['$compile', function($compile) {
    return {
        restrict: 'A',
        replace : false,
        terminal : true,
        priority: 1001,
        compile: function compile(element, attrs) {
            element.removeAttr('disable-enter');
            element.attr('ng-keypress', 'disableEnter($event)');
            return {
                pre : function preLink(scope, iElement, iAttrs, controller) { },
                post : function postLink(scope, iElement, iAttrs, controller) {
                    $compile(iElement)(scope);
                }
            };
        },
        controller: ["$scope", function($scope, $element) {
            $scope.disableEnter = function(event) {
                if (event.target.contentEditable != "true" && (event.charCode || event.keyCode) == 13) {
                    event.preventDefault();
                };
            };
        }],
    }
}]);


var getStackTrace = function() {
    var obj = {};
    Error.captureStackTrace(obj, getStackTrace);
    return obj.stack;
};
