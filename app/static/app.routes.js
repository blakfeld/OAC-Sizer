/**
 *  app.routes.js:
 *    Handle routing for our application.
 *
 *  Author: Corwin Brown <corwin@corwinbrown.com>
 **/

'use strict';

angular.module('app.routes', ['ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('main', {
        url: '/?requiredCPU&requiredMemory&requiredStorage',
        views: {
          main: {
            templateUrl: 'static/templates/main.tpl.html',
            controller: 'MainController as main',
          },
        }
      })
      .state('requirements', {
        url: '/requirements?requiredCPU&requiredMemory&requiredStorage',
        views: {
          main: {
            templateUrl: 'static/templates/requirements.tpl.html',
            controller: 'RequirementsController as require',
          },
        }
      }).state('results', {
        url: '/results?requiredCPU&requiredMemory&requiredStorage',
        views: {
          main: {
            templateUrl: 'static/templates/results.tpl.html',
            controller: 'ResultsController as results'
          }
        }
      });

    $urlRouterProvider.otherwise('/');
  });
