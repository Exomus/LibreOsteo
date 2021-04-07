angular
    .module('loExamination')
    .factory('ExaminationCommentServ', ['$resource',
        function($resource) {
            return $resource('api/examinations/:examinationId/comments', null, {
                query: {
                    method: 'GET',
                    isArray: true
                },
            });
        }
    ]);
