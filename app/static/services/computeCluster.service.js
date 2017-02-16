/**
 *  computerCluster.service.js:
 *    Service for construcing Compute Cluster objects.
 *
 *  Author: Corwin Brown <corwin@corwinbrown.com>
 */

'use strict';

angular.module('app')
  .factory('ComputeClusterService', ComputeClusterService);

ComputeClusterService.$inject = [
  'AWSInstanceTypeService',
  'AWSSpotPriceService',
  '$q',
];

function ComputeClusterService(AWSInstanceTypeService, AWSSpotPriceService, $q) {
  var service = {
    'instanceTypes': [],
    'spotPrices': [],
    'selectedInstanceType': null,
    'getInstanceTypes': getInstanceTypes,
    'getInstanceType': getInstanceType,
    'getSpotPrices': getSpotPrices,
  };

  return service;

  /**
   *  Fetch an array of Instance Types (filtered by the provided
   *    parameters) from the backend.
   *
   *  @param {int} requiredCpu      - The number of CPU cores to
   *                                    filter on.
   *  @param {int} requiredMemory   - The amount of RAM (in GBs)
   *                                     to filter on.
   *  @param {int} requiredStorage  - The amount of Storage (in GBs)
   *                                      to filter on.
   *
   *  @return {promise}
   */
  function getInstanceTypes(requiredCpu, requiredMemory, requiredStorage) {
    var defered = $q.defer();
    var params = {
      requiredCpu: requiredCpu,
      requiredMemory: requiredMemory,
      requiredStorage: requiredStorage,
    };

    AWSInstanceTypeService.query(params, function (data) {
      service.instanceTypes = data.result;
      defered.resolve();
    });

    return defered.promise;
  }

  /**
   *  Fetch the complete details of a specific instance type from the
   *      backend.
   *
   *  @param {stirng} instanceType  - The name of the instance type
   *                                    to return.
   *
   *  @return {promise}
   */
  function getInstanceType (instanceType) {
    var defered = $q.defer();
    var params = {
      instanceType: instanceType,
    };

    AWSInstanceTypeService.get(params, function(data) {
      service.selectedInstanceType = data.result;
      defered.resolve();
    });

    return defered.promise;
  }

  /**
   *  Fetch spot prices from the backend, filtered by the provided
   *    instance types.
   *
   *  @param {array} instanceType   - An arary of instance names to
   *                                    filter on.
   *
   *  @return {promise}
   */
  function getSpotPrices(instanceTypes) {
    var defered = $q.defer();
    var params = {
      instanceTypes: instanceTypes.join(','),
    };

    AWSSpotPriceService.query(params, function(data) {
      service.spotPrices = data.result;
      defered.resolve();
    });

    return defered.promise;
  }
}
