angular
    .module('loDoctor')
    .controller('DoctorCtrl', ['$scope', '$routeParams', 'DoctorServ', function ($scope, $routeParams, DoctorServ) {
        "use strict";
        $scope.doctorDetails = DoctorServ.get({doctorId : $routeParams.doctorId});
    }]);
