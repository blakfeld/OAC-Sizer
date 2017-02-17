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
