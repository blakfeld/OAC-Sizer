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
      'instanceTypes': null,
      'getInstances': function () {
        var defer = $q.defer();
        var params = {
          max_cpu: this.requiredCpu,
          max_memory: this.requiredMemory,
          max_storage: this.requiredStorage,
        };
        AWSInstanceService.query(params, function (data) {
          computeCluster.instanceTypes = data.instance_types;
          defer.resolve();
        });

        return defer.promise;
      }
    };

    return computeCluster;
  });
