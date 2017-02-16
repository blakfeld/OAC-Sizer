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

  // Initialize parameters provided via Query String, and
  //    save to view model so I can display to user.
  vm.requiredCpu      = parseInt($stateParams.requiredCpu);
  vm.requiredMemory   = parseInt($stateParams.requiredMemory);
  vm.requiredStorage  = parseInt($stateParams.requiredStorage);

  /**
   *  Steps:
   *    1. Get instance types (that meet our specs) from backend.
   *    2. Get spot prices for those instances.
   *    3. Sort on price.
   *    4. Store the min/max amount of machines.
   *    5. Get expanded details for the "min" machine.
   *    6. Display to the user the "min" machine (and provide
   *          a button to display the "max").
   *    7. If user selects "max", get details of that machine and
   *          display them.
   **/

  // Get Potential Instances as well as their spot prices.
  vm.cluster.getInstanceTypes(vm.requiredCpu, vm.requiredMemory, vm.requiredStorage)
    .then(function () {
      vm.cluster.getSpotPrices(vm.cluster.instanceTypes)
        .then(function () {
          console.log(vm.cluster.spotPrices);
        });
    });

  // vm.getSpotPrices = function(instanceTypes) {
  // };

   // console.log(instanceTypes);
}
