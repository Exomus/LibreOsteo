/** Describes an action on one form
 *
 * includes triggers, element (form) and callbacks.
 *
 * @param form: the DOM element (with edit-form-control attr)
 * @param name: the action name (among: edit, save, delete, cancel)
 * @param callbackFunction: the function to be called when the coresponding
 * button is clicked.
 *
 */
function FormAction(form, name, callbackFunction, trigger) {
    this.form = form;
    this.name = name;
    this.callbackFunction = callbackFunction;
    this.trigger = trigger;
}
FormAction.prototype.isAvailable = function() {
    return this.form.is(':visible') && this.trigger[this.name];
};

FormAction.prototype.run = function() {
    this.callbackFunction();
}

/** A generic modal form controller
 *
 * Modal because two modes : read/write, togglable with a button.
 * Toggling to read mode make the save action to be called.
 *
 * Appart the mode toggle, buttons are also offered for acting on visible
 * controlled forms models: reset and delete.
 */
angular
    .module('loEditFormManager')
    .factory('loEditFormManager', function() {
    // This var is global to all loEditFormManager instances
    let formActions =  [];

    return {
        /**
         @param form the DOM element (with edit-form-control attr)
         @param action_list Callback[]
         @param trigger trigger object (ex: {save: true, edit: false, delete: false, cancel: false})
         */
        add: function(form, action_list, trigger) {
            if (formActions.find(x => x.form == form)) {
                console.error('Trying to register already registered form, that is not normal');
                return;
            }
            action_list.forEach(
                x => formActions.push(new FormAction(form, x.name, x.callback, trigger))
            );
        },
        action_available: function(name_action) {
            let matchingAction = formActions.find(
                x => x.name === name_action && x.isAvailable()
            );
            return matchingAction != undefined;
        },
        call_action: function(name) {
            let actionsToRun = formActions.filter(
                x => x.name == name && x.isAvailable()
            );
            actionsToRun.forEach(x => x.run());
        },
        remove : function(form) {
            formActions = formActions.filter(
                form_action => form_action.form != form
            );
        }

    }
});
