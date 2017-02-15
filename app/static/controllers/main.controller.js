/**
 *  main.controller.js:
 *    Controller logic for the Cluster Sizer Main page.
 *
 *  Author: Corwin Brown <corwin@corwinbrowm.com>
 **/

'use strict';

angular.module('app.core')
  .controller('MainController', function ($scope, $stateParams, ComputeClusterService) {
    var vm = this;
    vm.cluster = ComputeClusterService;

    // Initialize parameters provided via Query String.
    vm.cluster.requiredCpu = $stateParams.requiredCpu;
    vm.cluster.requiredMemory = $stateParams.requiredMemory;
    vm.cluster.requiredStorage = $stateParams.requiredStorage;
  });
