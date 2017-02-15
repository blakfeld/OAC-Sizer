/**
 *  computerCluster.service.js:
 *    Service for construcing Compute Cluster objects.
 *
 *  Author: Corwin Brown <corwin@corwinbrown.com>
 **/

'use strict';

angular.module('app.core')
  .factory('ComputeClusterService', function (AWSInstanceService, $q) {
    var computeCluster = {
      'requiredCpu': null,
      'requiredMemory': null,
      'requiredStorage': null,
      'instanceTypes': [],
      'isLoading': false,
      'getInstanceTypes': function () {
        var defer = $q.defer();
        var params = {
          max_cpu: this.requiredCpu,
          max_memory: this.requiredMemory,
          max_storage: this.requiredStorage,
        };
        computeCluster.isLoading = true;
        AWSInstanceService.query(params, function (data) {
          computeCluster.instanceTypes = data.instance_types;

          computeCluster.isLoading = false;
          defer.resolve();
        });

        return defer.promise;
      }
    };

    return computeCluster;
  });
