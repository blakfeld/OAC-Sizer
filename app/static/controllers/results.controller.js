/**
 *  results.controller.js:
 *    Controller logic for the Results Cluster page.
 *
 *  Author: Corwin Brown <corwin@corwinbrown.com>
 */

'use strict';

angular.module('app')
  .controller('ResultsController', ResultsController);

ResultsController.$inject = [
  '$stateParams',
  'ComputeClusterService',
];

function ResultsController($stateParams, ComputeClusterService) {
  var vm = this;
  vm.cluster = ComputeClusterService;

  //  Start in the "loading" state, since we'll have to fetch and
  //    process some data.
  vm.isLoading = true;

  // Initialize parameters provided via Query String, and
  //    save to view model so I can display to user.
  vm.cluster.requiredCpu      = parseInt($stateParams.requiredCpu);
  vm.cluster.requiredMemory   = parseInt($stateParams.requiredMemory);
  vm.cluster.requiredStorage  = parseInt($stateParams.requiredStorage);

  vm.cluster.getOptimalCluster()
    .then(function () {
      vm.isLoading = false;
    });
}
