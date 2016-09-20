'use strict';

/* App Module */

var spaninsApp = angular.module('spaninsApp', [
    'ngRoute',
    'restangular',
    'ngMaterial',
    'md.data.table',
    'ngMdIcons',
    'ngAnimate'
]);

spaninsApp.config(['$routeProvider', 'RestangularProvider',
    function($routeProvider, RestangularProvider) {
        $routeProvider.
            when('/phages', {
                templateUrl: 'partials/phage_list.html',
                controller: 'PhageListCtrl'
            }).
            when('/phages/:phageID', {
                templateUrl: 'partials/phage_detail.html',
                controller: 'PhageDetailCtrl'
            }).
            otherwise({
                redirectTo: '/phages'
            });
        RestangularProvider.setBaseUrl('http://localhost:8000/');
        RestangularProvider.setRequestSuffix('/');
        RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
            var extractedData;
            // .. to look for getList operations
            if (operation === "getList") {
            // .. and handle the data and meta data
                extractedData = data.results;
                extractedData.meta = {
                    'count': data.count,
                    'next': data.next,
                    'previous': data.previous
                }
            } else {
                extractedData = data;
            }
            return extractedData;
        });
}]);

spaninsApp.filter('spanin_type_filter', function() {
    return function(input) {
        switch(input){
            case 0:
                return "embedded";
            case 1:
                return "overlapping";
            case 2:
                return "separate";
            case 3:
                return "unimolecular";
        }
    };
});

spaninsApp.controller('PhageListCtrl', ['$scope', 'Restangular', '$location',
    function($scope, Restangular, $location) {
        $scope.go = function(id) {
            $location.path('/phages/' + id);
        };

        $scope.spanin_types = [0, 1, 2, 3];
        $scope.choice = '';
        $scope.updateData = function(page) {
            if(!isNaN(parseInt(page))){
                $scope.query.page = page;
            }
            $scope.query.ordering = $scope.ordering;
            $scope.query.search = $scope.search;
            $scope.query.spanin_type = $scope.choice;
            $scope.promise = Restangular.all('phages').getList($scope.query).then(function(data) {
                $scope.phages = data;
            });
        };

        $scope.idk = function() {
            console.log('idk');
        };

        $scope.options = {
            limitSelect: true,
            pageSelect: true
        };

        $scope.query = {
            limit: 10,
            page: 1,
            search: $scope.search,
            spanin_type: $scope.choice,
        };

        $scope.updateData(1);
}]);

spaninsApp.controller('PhageDetailCtrl', ['$scope', 'Restangular', '$routeParams',
    function($scope, Restangular, $routeParams) {
        Restangular.one('phages', $routeParams.phageID).get().then(function(data) {
            $scope.phage = data;
        });
}]);