function Callback(name, callback) {
    this.name = name;
    this.callback = callback;
}

angular
    .module('loEditFormManager')
    .directive('editFormControl', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        scope: {
            save: "=save",
            trigger: "=trigger",
            edit: "=edit",
            cancel: "=cancel",
            delete: "=delete",
            saveOnLostFocus: "=saveOnLostFocus"
        },
        compile: function(element, attr) {
            if (!attr.save) {
                attr.save = null;
            }
            if (!attr.edit) {
                attr.edit = null;
            }
            if (!attr.cancel) {
                attr.cancel = null;
            }
            if (!attr.delete) {
                attr.delete = null;
            }
            if(!attr.saveOnLostFocus){
                attr.saveOnLostFocus = false;
            }
        },
        controller: ['$scope', '$routeParams', 'loEditFormManager', '$element', function($scope, $routeParams, loEditFormManager, $element) {
            var actions = [];
            if ($scope.save != null) {
                actions.push(new Callback('save', $scope.save));
            }
            if ($scope.edit != null) {
                actions.push(new Callback('edit', $scope.edit));
            }
            if ($scope.cancel != null) {
                actions.push(new Callback('cancel', $scope.cancel));
            }
            if ($scope.delete != null) {
                actions.push(new Callback('delete', $scope.delete));
            }
            $timeout(function() {
                loEditFormManager.add($element, actions, $scope.trigger);
            });
            $element.on('$destroy', function() {
                loEditFormManager.remove($element);
            });

            /**
             * Handle a user attempt to leave a view containing unsaved data
             *
             * May autosave, or prompt user, or let leave.
             *
             * @param {event} event - The event of leaving the view (cancel-able)
             * @param{boolean} askUser - Wether we ask if he really wants to leave
             */
            var quitConfirmationMsg = gettext(
                'There are unsaved changes. Do you really want to leave this page ?'
            );

            function handleUnsavedForm(event, askUser) {
                if ($element.find('.ng-dirty').length > 0) {
                    if ($scope.saveOnLostFocus) {
                        $scope.save();
                        $scope.trigger.save = false;

                    } else if (askUser) {
                        var quitAnyway = confirm(quitConfirmationMsg);
                        if (!quitAnyway) {
                            event.preventDefault(); // prevent view change
                        }
                    }
                }
            }

            // tab change
            $scope.$on('uiTabChange', function(event) {
                // :visible is a hack to figure out if we are current tab.
                if ($element.is(':visible')) {
                    handleUnsavedForm(event, false);
                }
            });
            // router view change
            $scope.$on('$locationChangeStart', function(event, newUrl, oldUrl, newState, oldState) {
                if ($element.is(':visible') &&
                    // Avoid handling both $locationChangestart and uiTabChange on same click.
                    ! (oldUrl.includes('#/patient/') && newUrl.includes('#/patient/'))) {
                    handleUnsavedForm(event, true);
                }
            });

            // Window/tab quit or real link click
            //
            // beforeunload is an uncommon event:
            // - on most browsers, confirm() calls within its body will be ignored
            // - on some browsers, you can issue a custom message, but on others
            //   won't accept it (in favor of built-in message)
            // - it is hard to get sure an AJAX call is made (for autosave)
            // - API depend on browser
            //
            // https://developer.mozilla.org/en-US/docs/Web/Events/beforeunload
            //
            // So, best-effort: we ask for confirmation, optionaly with custom
            // message.
            function onQuit(event) {
                if ($element.find('.ng-dirty').length > 0) {
                    event.returnValue = quitConfirmationMsg;
                    return quitConfirmationMsg;
                }
            };
            window.addEventListener('beforeunload', onQuit);
            $scope.$on('$destroy', function() {
                window.removeEventListener('beforeunload', onQuit);
            });
        }],
    }
}]);
