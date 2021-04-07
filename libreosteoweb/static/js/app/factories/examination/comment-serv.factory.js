angular
    .module('loExamination')
    .factory('CommentServ', ['$resource',
    function($resource) {
        return $resource('api/comments', null)
    }
]);
