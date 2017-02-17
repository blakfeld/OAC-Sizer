/**
 *  Resource to interact with our '/instances/types' backend endpoint.
 *
 *  Author: Corwin Brown <corwin@corwinbrown.com>
 */

'use strict';

angular.module('app')
  .factory('AWSInstanceTypeService', AWSInstanceTypeService)
  .factory('AWSInstancesService', AWSInstancesService);

AWSInstancesService.$inject = [
  '$location',
  '$resource',
]

function AWSInstancesService($location, $resource) {
  var url = $location.protocol() + '://' +
            $location.host() + ':' + $location.port() +
            '/api/v1.0/instances';

  return $resource(url, {}, {query: {isArray: false}});
}

AWSInstanceTypeService.$inject = [
  '$location',
  '$resource',
];

function AWSInstanceTypeService($location, $resource) {
  var url = $location.protocol() + '://' +
            $location.host() + ':' + $location.port() +
            '/api/v1.0/instances/types/:instanceType';

  return $resource(url, {instanceType: '@instanceType'}, {query: {isArray: false}});
}

