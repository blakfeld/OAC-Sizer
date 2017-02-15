/**
 *
 * Author: Corwin Brown <corwin@corwinbrown.com>
 **/

'use strict';

angular.module('app.core')
  .factory('AWSInstanceService', function ($location, $resource) {
    var url = $location.protocol() + '://' +
              $location.host() + ':' + $location.port() +
              '/api/v1.0/instances/types/:instanceType';

    // This is formatted super gross, but I've yet to come up
    //    with something that feels better.
    return $resource(url,
                     { instanceType: '@instance_type' },
                     { query: { isArray: false } });
  });
