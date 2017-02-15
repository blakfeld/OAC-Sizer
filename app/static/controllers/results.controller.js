/**
 *  results.controller.js:
 *    Controller logic for the Results Cluster page.
 *
 *  Author: Corwin Brown <corwin@corwinbrown.com>
 **/

'use strict';

angular.module('app.core')
  .controller('ResultsController', function($stateParams, ComputeClusterService) {
    var vm = this;
    vm.cluster = ComputeClusterService;

    vm.cluster.requiredCpu = $stateParams.requiredCpu;
    vm.cluster.requiredMemory = $stateParams.requiredMemory;
    vm.cluster.requiredStorage = $stateParams.requiredStorage;

  });
