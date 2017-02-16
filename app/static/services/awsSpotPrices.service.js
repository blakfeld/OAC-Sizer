/**
 * Resource to interact with our '/prices' backend endpoint.
 *
 *  Author: Corwin Brown <corwin@corwinbrown.com>
 */

'use strict';

angular.module('app')
  .factory('AWSSpotPriceService', AWSSpotPriceService);

AWSSpotPriceService.$inject = [
  '$location',
  '$resource',
];

function AWSSpotPriceService($location, $resource) {
  var url = $location.protocol() + '://' +
            $location.host() + ':' + $location.port() +
            '/api/v1.0/prices/:instanceType';

  return $resource(url, {instanceType: '@instanceType'}, {query: {isArray: false}});
}
