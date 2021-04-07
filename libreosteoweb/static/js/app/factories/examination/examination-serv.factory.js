angular
    .module('loExamination')
    .factory('ExaminationServ', ['$resource',
        function($resource) {
            "use strict";
            var serv = $resource('api/examinations/:examinationId', null, {
                query: {
                    method: 'GET',
                    isArray: true
                },
                get: {
                    method: 'GET',
                    params: {
                        examinationId: 'examination'
                    }
                },
                save: {
                    method: 'PUT'
                },
                add: {
                    method: 'POST'
                },
                close: {
                    method: 'POST',
                    params: {
                        examinationId: 'examinationId'
                    },
                    url: 'api/examinations/:examinationId/close'
                },
                invoice: {
                    method: 'POST',
                    params: {
                        examinationId: 'examinationId'
                    },
                    url: 'api/examinations/:examinationId/invoice'
                },
                delete: {
                    method: 'DELETE',
                    params: {
                        examinationId: 'examinationId'
                    }
                },
                update_paiement: {
                    method: 'POST',
                    url: 'api/examinations/:examinationId/update_paiement',

                }
            });
            serv.SPHERES_LIST = [
                'orl', 'visceral', 'pulmo', 'uro_gyneco', 'periphery', 'generalState'
            ];
            return serv;
        }
    ]);
