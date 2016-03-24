'use strict';

// ===== Module for city detailed view ===== //

var city = angular.module('appPoc.city', [
  'ngRoute',
  'crmConstants'
]);

// ===== Routing ===== //
// Note: order of injected constants shall be the same
// as they are used in config !!!
city.config([
    '$routeProvider',
    'CRM_CITY_URL',
    'CRM_LOGIN_URL',
    function($routeProvider, CRM_CITY_URL) {
        $routeProvider.when(CRM_CITY_URL, {
        templateUrl: 'modules/crm/city/city.html',
        controller: 'cityController'
    })
    .otherwise({redirectTo: 'CRM_LOGIN_URL'});
}]);


// ===== Controller for city detailed view ===== //
// Note that the order of parameters in function shall be the same
// as order of injected constants !!!
city.controller('cityController', [
    '$scope',
    '$http',
    '$cookies',
    '$location',
    'CRM_CITIES_URL',
    'CRM_CITY_URL',
    'CRM_LOGIN_URL',
    'CRM_AUTH_COOKIE',
    'CRM_CITY_COOKIE',
    'CRM_BE_CITIES_COUNTRIES_URL',
    'CRM_BE_CITIES_CITIES_URL',
    'CRM_BE_CITY_INFO_URL',
    function($scope, $http, $cookies, $location,
             CRM_CITIES_URL, CRM_CITY_URL, CRM_LOGIN_URL, CRM_AUTH_COOKIE,CRM_CITY_COOKIE,
             CRM_BE_CITIES_COUNTRIES_URL, CRM_BE_CITIES_CITIES_URL, CRM_BE_CITY_INFO_URL) {

        console.log('Hi, I am cityController');
        // Debug info - will be removed later
        console.log('Hi, I am citiesController');
        console.log('cities url ' + CRM_CITIES_URL);
        console.log('city url ' + CRM_CITY_URL);
        console.log('login url ' + CRM_LOGIN_URL);
        console.log('auth cookie ' + CRM_AUTH_COOKIE);
        console.log('city cookie ' + CRM_CITY_COOKIE);
        console.log(CRM_BE_CITIES_COUNTRIES_URL);
        console.log(CRM_BE_CITIES_CITIES_URL);
        console.log(CRM_BE_CITY_INFO_URL);

        $scope.auth_token = $cookies.get(CRM_AUTH_COOKIE);
        $scope.city_id    = $cookies.get(CRM_CITY_COOKIE);
        if ( angular.isUndefined($scope.city_id)) {
            console.log('no city id, redirecting to cities selection page');
            $location.path(CRM_CITIES_URL)
        }

        // Get city information from API
        $scope.getCityInfo = function () {
            console.log('get info for city id  ' + $scope.city_id);
            if ( angular.isUndefined($scope.city_id)) {
                console.log('city_id is not defined, redirecting to cities page');
                $location.path(CRM_CITIES_URL);
            }

            $http({
                url: CRM_BE_CITY_INFO_URL,
                method: 'GET',
                params: {token: $scope.auth_token, city_id: $scope.city_id},
                headers: {'Content-Type': 'application/json'}
            })
            .success(function (nodeResponse) {
                console.log('city info get request is successful');
                $scope.cityInfo = nodeResponse;
                if ( angular.isDefined($scope.cityInfo.error) ) {
                    console.log('Error connection to API (cookie expired), redirecting to login page');
                    $location.path(CRM_LOGIN_URL);
                }
            })
            .error(function (response) {
                console.log('Error connection to API (cookie expired), redirecting to login page');
                $location.path(CRM_LOGIN_URL);
            })
        }; // end getCityInfo

    $scope.getCityInfo();

    // Back to cities selection page
    // Listens to ng-click in the button below
    $scope.back = function() {
        $cookies.remove(CRM_CITY_COOKIE);
        $location.path(CRM_CITIES_URL);
    }; // end back

}]); // end cityController

