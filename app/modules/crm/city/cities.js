'use strict';

// ===== Module for country/city selection page ===== //

var cities = angular.module('appPoc.cities', [
    'ngRoute',
    'crmConstants'
]);

// ===== Routing ===== //
// Note: order of injected constants shall be the same
// as they are used in config !!!
cities.config([
    '$routeProvider',
    'CRM_CITIES_URL',
    'CRM_LOGIN_URL',
    function($routeProvider, CRM_CITIES_URL) {
      $routeProvider.when(CRM_CITIES_URL, {
            templateUrl: 'modules/crm/city/cities.html',
            controller: 'citiesController'
    })
    .otherwise({redirectTo: 'CRM_LOGIN_URL'});
}]);

// ===== Controller for couontry/city selection page =====
// Note that the order of parameters in function shall be the same
// as order of injected constants !!!
cities.controller('citiesController', [
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
    function($scope, $http, $cookies, $location,
             CRM_CITIES_URL, CRM_CITY_URL, CRM_LOGIN_URL, CRM_AUTH_COOKIE,CRM_CITY_COOKIE,
             CRM_BE_CITIES_COUNTRIES_URL, CRM_BE_CITIES_CITIES_URL) {
        // Debug info - will be removed later
        console.log('Hi, I am citiesController');
        console.log('cities url ' + CRM_CITIES_URL);
        console.log('city url ' + CRM_CITY_URL);
        console.log('login url ' + CRM_LOGIN_URL);
        console.log('auth cookie ' + CRM_AUTH_COOKIE);
        console.log('city cookie ' + CRM_AUTH_COOKIE);
        console.log(CRM_BE_CITIES_COUNTRIES_URL);
        console.log(CRM_BE_CITIES_CITIES_URL);

        // Check if authentication token cookie exists
        // If it does not exist, redirect to login page
        $scope.auth_token = $cookies.get(CRM_AUTH_COOKIE);
        if ( angular.isUndefined($scope.auth_token)) {
            console.log('no authorisation cookie, redirecting to login page ' + CRM_LOGIN_URL);
            $location.path(CRM_LOGIN_URL)
        }

        // Assume that auth cookie is present
        $scope.countries = {};
        $scope.cities = {};

        // Get all countries from API
        $scope.getCountries = function () {
            console.log('get countries request to backend, token is ' + $scope.auth_token);
            console.log('backend url is ' + CRM_BE_CITIES_COUNTRIES_URL);
            $http({
                url: CRM_BE_CITIES_COUNTRIES_URL,
                method: 'GET',
                params: {token: $scope.auth_token},
                headers: {'Content-Type': 'application/json'}
            })
            .success(function (nodeResponse) {
                console.log('countries get request is successful');
                $scope.countries = nodeResponse;
                if ( angular.isDefined($scope.countries.error) ) {
                    console.log('Error connection to API (cookie expired?), redirecting to login page');
                    $location.path(CRM_LOGIN_URL);
                }
            })
            .error(function (response) {
                console.log('Error: ' + JSON.stringify(response));
                $location.path(CRM_LOGIN_URL);
            })
        }; // end getCountries

        // Get cities for a given country id from backend
        // Triggered by ng-cnahge directive
        $scope.getCountryCities = function () {
            console.log('get cities request to backend, token is ' + $scope.auth_token);
            $http({
                url: CRM_BE_CITIES_CITIES_URL,
                method: 'GET',
                params: {token: $scope.auth_token, country_id: $scope.selectedCountryId},
                headers: {'Content-Type': 'application/json'}
            })
            .success(function (nodeResponse) {
                console.log('countries get request is successful');
                $scope.countryCities = nodeResponse;
                console.log('citiesController countries are ' + JSON.stringify($scope.countries));
                if ( angular.isDefined($scope.countryCities.error) ) {
                    console.log('Error connection to API (cookie expired), redirecting to login page');
                    $location.path(CRM_LOGIN_URL);
                }
            })
            .error(function (response) {
                console.log('Error: ' + JSON.stringify(response));
                $location.path(CRM_LOGIN_URL);
            })
        }; // end getCountryCities

        // Here scope is populated with countries  data
        $scope.getCountries();

        // As country not selected yet, no cities are displayed
        $scope.countryCities = [];

        // Listens to ng-click on submit button
        $scope.submit = function() {
            console.log('Get city info button pressed');
            $cookies.put(CRM_CITY_COOKIE, $scope.selectedCityId);
//            $cookies.put("poc.city_id", $scope.selectedCityId);
            $location.path(CRM_CITY_URL);
//            $location.path('/fe/user/login');
        } // end submit

    }]); // end citiesController

