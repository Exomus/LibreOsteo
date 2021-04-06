angular
    .module('loDoctor')
    .factory('DoctorServ', ['$resource',
        function ($resource) {
            "use strict";
            return $resource('api/doctors/:doctorId', null, {
                query: {method: 'GET', isArray : true},
                get : {method: 'GET', params: {doctorId: 'doctor'}},
                save : {method : 'PUT'},
                add : {method : 'POST'}
            });
        }
    ]);
