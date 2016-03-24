'use strict';

// ===== Constants used within CRM namespace ===== //
var crmConstants = angular.module('crmConstants', [])
.constant('CRM_LOGIN_URL', '/fe/user/login')
.constant('CRM_CITIES_URL', '/fe/cities')
.constant('CRM_CITY_URL', '/fe/city')
.constant('CRM_AUTH_COOKIE', 'poc.auth_token')
.constant('CRM_CITY_COOKIE', 'poc.city_id')
.constant('CRM_BE_CITIES_COUNTRIES_URL', 'http://localhost:8090/be/cities/countries')
.constant('CRM_BE_CITIES_CITIES_URL', 'http://localhost:8090/be/cities/cities')
.constant('CRM_BE_CITY_INFO_URL', 'http://localhost:8090/be/city/info')
.constant('CRM_BE_USER_LOGIN_URL', 'http://localhost:8090/be/login')
;

