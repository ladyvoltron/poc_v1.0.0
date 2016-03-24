'use strict';

// ===== Module for login handling ===== //

var login = angular.module('appPoc.login', [
  'ngRoute',
  'crmConstants'
]);

// ===== Routing ===== //
// Note: order of injected constants shall be the same
// as they are used in config !!!
login.config([
    '$routeProvider',
    'CRM_LOGIN_URL',
    function($routeProvider, CRM_LOGIN_URL) {
        $routeProvider.when(CRM_LOGIN_URL, {
        templateUrl: 'modules/crm/user/login.html',
        controller: 'loginController'
    })
    .otherwise({redirectTo: CRM_LOGIN_URL});
}]);

// ===== Controller for login action ===== //
// Note that the order of parameters in function shall be the same
// as order of injected constants !!!
login.controller('loginController', [
    '$rootScope',
    '$scope',
    '$http',
    '$location',
    '$cookies',
    'CRM_CITIES_URL',
    'CRM_CITY_URL',
    'CRM_LOGIN_URL',
    'CRM_AUTH_COOKIE',
    'CRM_CITY_COOKIE',
    'CRM_BE_CITIES_COUNTRIES_URL',
    'CRM_BE_CITIES_CITIES_URL',
    'CRM_BE_USER_LOGIN_URL',
    function($rootScope, $scope, $http, $location, $cookies,
             CRM_CITIES_URL, CRM_CITY_URL, CRM_LOGIN_URL, CRM_AUTH_COOKIE,CRM_CITY_COOKIE,
             CRM_BE_CITIES_COUNTRIES_URL, CRM_BE_CITIES_CITIES_URL, CRM_BE_USER_LOGIN_URL) {
        console.log('Hi, I am loginController');
        // Debug info - will be removed later
        console.log('cities url ' + CRM_CITIES_URL);
        console.log('city url ' + CRM_CITY_URL);
        console.log('login url ' + CRM_LOGIN_URL);
        console.log('auth cookie ' + CRM_AUTH_COOKIE);
        console.log('city cookie ' + CRM_AUTH_COOKIE);
        console.log(CRM_BE_CITIES_COUNTRIES_URL);
        console.log(CRM_BE_CITIES_CITIES_URL);
        console.log(CRM_BE_USER_LOGIN_URL);

        $scope.loginData={};
        $scope.nodeResponse={};
        $scope.errMsg = '';

        // Set cookie with authentication token
        // SHALL BE IN SHARED!!!
        $scope.writeCookie = function () {
            $cookies.put(CRM_AUTH_COOKIE, $scope.nodeResponse.auth_token);
            console.log('cookie is set ' + $scope.nodeResponse.auth_token);
        };

        // TODO: make it working!
        console.log('rootScope.appReferer ' + $rootScope.appReferrer);
        $scope.appReferrer = $rootScope.appReferrer;

        // Request to API to get authentication token
        $scope.submit = function() {
            $http({
            url: CRM_BE_USER_LOGIN_URL,
            method: 'POST',
            data: $scope.loginData,
            headers: {'Content-Type': 'application/json'}
        })
        .success( function (nodeResponse) {
              $scope.nodeResponse = nodeResponse;
              console.log('-->  nodeResponse.statusCode = ' +  $scope.nodeResponse.statusCode );
              if ( $scope.nodeResponse.statusCode == '200') {
                $scope.writeCookie();
                console.log('cookie is set ' + $scope.nodeResponse.auth_token);
                console.log('login ok, redirect to city select page');
                $location.path(CRM_CITIES_URL);
              }
            else {
                  $scope.errMsg = "Login error!"
                  $location.path(CRM_LOGIN_URL);
            }
        })
        .error(function (response) {
            console.log('Error: ' + JSON.stringify(response));
            $location.path(CRM_LOGIN_URL);
        })
    } // end submit

    }]); // end loginController
