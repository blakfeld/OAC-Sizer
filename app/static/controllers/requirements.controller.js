/**
 *  require.controller.js:
 *    Controller logic for the Cluster Sizer Requirements page.
 *
 *  Author: Corwin Brown <corwin@corwinbrown.com>
 **/

'use strict';

angular.module('app.core')
  .controller('RequirementsController', function($state, $stateParams, ComputeClusterService) {
    var vm = this;
    vm.cluster = ComputeClusterService;

    vm.cluster.requiredCpu = $stateParams.requiredCpu;
    vm.cluster.requiredMemory = $stateParams.requiredMemory;
    vm.cluster.requiredStorage = $stateParams.requiredStorage;

    vm.submitRequirements = function () {
      vm.cluster.getInstances().then(function () {
        state.go('cluster', {
          requiredCpu: vm.cluster.requiredCpu,
          requiredMemory: vm.cluster.requiredMemory,
          requiredStorage: vm.cluster.requiredStorage,
        });
      });
    };
  });
