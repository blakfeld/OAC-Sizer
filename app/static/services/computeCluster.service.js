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
  '$q',
  'AWSInstancesService',
  'AWSInstanceTypeService',
  'AWSSpotPriceService',
];

function ComputeClusterService($q,
                               AWSInstancesService,
                               AWSInstanceTypeService,
                               AWSSpotPriceService) {
  var service = {
    'cheapestSpotPrices': null,
    'findCheapestAvailabilityZone': findCheapestAvailabilityZone,
    'getInstances': getInstances,
    'getInstanceType': getInstanceType,
    'getInstanceTypes': getInstanceTypes,
    'getMinMaxClusterConfiguration': getMinMaxClusterConfiguration,
    'getOptimalCluster': getOptimalCluster,
    'getSpotPrices': getSpotPrices,
    'instanceData': {},
    'instanceTypes': [],
    'requiredCpu': null,
    'requiredMemory': null,
    'requiredStorage': null,
    'resultCheapestInstance': null,
    'resultMinInstances': null,
    'selectedInstanceType': null,
    'spotPrices': [],
  };

  return service;

  /**
   *  Use the data we've derived about our cluster requirements, and generate
   *    a reasonable suggestion for what an optimal cluster looks like.
   *
   *  @return {promise}
   */
  function getOptimalCluster() {
    var defered = $q.defer();

    service.getInstanceTypes()
      .then(function () {
        return service.getSpotPrices();
      })
      .then(function() {
        service.findCheapestAvailabilityZone();
        return service.getInstances();
      })
      .then(function () {
        service.getMinMaxClusterConfiguration();
        defered.resolve();
      });

    return defered.promise;
  }

  /**
   *  From an output perspective, this is very similar to `getInstanceTypq` with
   *    the exception that you have the option to either return all instance
   *    records, or records based on a list of instance types.
   *
   *  @param {array} instancetypes  - Array of instance types to filter the
   *                                    query on.
   *
   *  @return {promise}
   */
  function getInstances() {
    var defered = $q.defer();
    var params = {
      instanceTypes: service.instanceTypes.join(',')
    };

    AWSInstancesService.query(params, function (data) {
      service.instanceData = data.result;
      defered.resolve();
    });

    return defered.promise;
  }

  /**
   *  Fetch an array of Instance Types (filtered by the provided parameters)
   *    from the backend.
   *
   *  @return {promise}
   */
  function getInstanceTypes() {
    var defered = $q.defer();
    var params = {
      requiredCpu: service.requiredCpu,
      requiredMemory: service.requiredMemory,
      requiredStorage: service.requiredStorage,
    };

    AWSInstanceTypeService.query(params, function (data) {
      service.instanceTypes = data.result;
      defered.resolve();
    });

    return defered.promise;
  }

  /**
   *  Fetch the complete details of a specific instance type from the backend.
   *
   *  @param {stirng} instanceType  - The name of the instance type to return.
   *
   *  @return {promise}
   */
  function getInstanceType(instanceType) {
    var defered = $q.defer();
    var params = {
      instanceType: instanceType,
    };

    AWSInstanceTypeService.get(params, function (data) {
      service.selectedInstanceType = data.result;
      defered.resolve();
    });

    return defered.promise;
  }

  /**
   *  Fetch spot prices from the backend, filtered by the provided instance
   *    types.
   *
   *  @param {array} instanceType   - An arary of instance names to filter on.
   *
   *  @return {promise}
   */
  function getSpotPrices(instanceTypes) {
    var defered = $q.defer();
    var params = {
      instanceTypes: service.instanceTypes.join(','),
    };

    AWSSpotPriceService.query(params, function (data) {
      service.spotPrices = data.result;
      defered.resolve();
    });

    return defered.promise;
  }

  /**
   *  Given an object containing an instance's spot prices in various
   *    Availbility Zones, determine which AZ has the cheapest spot price, and
   *    construct a list of objects that we can perform a sort on later.
   *
   *  @param {object} instanceSpotPrices  - Object containing all of our spot
   *                                          pricing information, broken out by
   *                                          AZ.
   *
   *  @return {array} - Array of objects that contain data about an instance's
   *                      cheapest spot prices.
   */
  function findCheapestAvailabilityZone() {
    service.cheapestSpotPrices = []
    angular.forEach(service.spotPrices, function (spotPrices, instanceType) {
      var cheapest = {
        name: instanceType,
        availbilityZone: null,
        price: null,
      };

      //  Search our prices and find the cheapest. I feel like there's probably
      //    a better answer here using sort or filter, but I haven't found
      //    another solution I like.
      angular.forEach(spotPrices, function (priceAttrs, region) {
        if (!cheapest.price) {
          cheapest.region = region;
          cheapest.price = parseFloat(priceAttrs.spotPrice);
          return;
        }

        var spotPrice = parseFloat(priceAttrs.spotPrice);
        if (spotPrice < cheapest.price) {
          cheapest.region = region;
          cheapest.price = spotPrice;
        }
      });

      service.cheapestSpotPrices.push(cheapest);
    });
  }

  /**
   *  Given our instances, and our pre-sorted instance Spot prices, run through
   *    them and figure out both the cheapest instance to use, as well as the
   *    cheapest instance to use that would require the fewest individual
   *    instances.
   *
   *  @param {object} instanceData  - All the attributes of our instances.
   *  @param {array} cheapestPrices - Presorted list of the cheapest spot
   *                                    prices.
   */
  function getMinMaxClusterConfiguration() {
    service.cheapestSpotPrices.forEach(function (cheapestPrice) {
      var instance = service.instanceData[cheapestPrice.name];

      //  Reformat our data a little. If there was more time, I'd rework the
      //    backend to return lists instead of hashs and push this work onto
      //    the server.
      instance.name = cheapestPrice.name;
      instance.price = cheapestPrice.price;
      instance.availbilityZone = cheapestPrice.availbilityZone;

      //  Based on our requirements, determine how many of each instance I would
      //    need.
      var cpu_count = service.requiredCpu ?
        divideAndRoundUp(service.requiredCpu, instance.vCPU) : 0;

      var memory_count = service.requiredMemory ?
        divideAndRoundUp(service.requiredMemory, instance.memory) : 0;

      var storage_count = service.requiredStorage ?
        divideAndRoundUp(service.requiredStorage, instance.storage.size) : 0;

      // Take whichever count is higher, then calculate the total price.
      instance.count = Math.max(cpu_count, memory_count, storage_count);
      instance.totalPrice = instance.price * instance.count;

      //  Now figure out who is cheapest, and who is cheapest while using
      //    minimal instances.
      if (!service.resultCheapestInstance || !service.resultMinInstances) {
        service.resultCheapestInstance = instance;
        service.resultMinInstances = instance;
        return;
      }

      if (service.resultCheapestInstance.totalPrice > instance.totalPrice) {
        service.resultCheapestInstance = instance
      }

      if (service.resultMinInstances.totalPrice > instance.totalPrice) {
        if (service.resultCheapestInstance.count > instance.count) {
          service.resultMinInstances = instance;
        }
      }
    });
  }

  /**
   *  Divide two numbers, and if they do not evenly divde, always round up to
   *    the next whole number.
   *
   *  @param {integer} a  - The dividend.
   *  @param {integer} b  - The divisor.
   *
   *  @returns {integer}
   */
  function divideAndRoundUp(a, b) {
    return a % b == 0 ? parseInt(a / b) : parseInt((a / b) + 1);
  };
}
