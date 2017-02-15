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
        url: '/',
        views: {
          main: {
            templateUrl: 'static/templates/main.tpl.html',
            controller: 'MainController as main',
          },
        }
      })
      .state('requirements', {
        url: '/requirements?requiredCpu&requiredMemory&requiredStorage',
        views: {
          main: {
            templateUrl: 'static/templates/requirements.tpl.html',
            controller: 'RequirementsController as require',
          },
        }
      }).state('results', {
        url: '/results?requiredCpu&requiredMemory&requiredStorage',
        views: {
          main: {
            templateUrl: 'static/templates/results.tpl.html',
            controller: 'ResultsController as results'
          }
        }
      });

    $urlRouterProvider.otherwise('/');
  });
