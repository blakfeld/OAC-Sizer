/**
 *  require.controller.js:
 *    Controller logic for the Cluster Sizer Requirements page.
 *
 *  Author: Corwin Brown <corwin@corwinbrown.com>
 */

'use strict';

angular.module('app')
  .controller('RequirementsController', RequirementsController);

RequirementsController.$inject = [
  '$state',
];

function RequirementsController($state) {
  var vm = this;

  vm.formData = {};

  vm.submitRequirements = function () {
    $state.go('results', {
      requiredCpu: vm.formData.requiredCpu,
      requiredMemory: vm.formData.cluster.requiredMemory,
      requiredStorage: vm.formData.requiredStorage,
    });
  };
}
