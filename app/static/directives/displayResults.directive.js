/**
 *  displayResults.directive.js:
 *    Directive for displaying AWS instance information.
 *
 *  Author: Corwin Brown <corwin@corwinbrown.com>
 */

'use strict';

angular.module('app')
  .directive('displayInstance', displayInstance);

function displayInstance() {
  return {
    restrict: 'AE',
    templateUrl: 'static/templates/display-instance.tpl.html',
    scope: {
      instance: '=',
      cluster: '=',
    }
  };
}
