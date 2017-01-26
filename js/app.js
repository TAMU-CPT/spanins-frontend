window._ = require('lodash');
require('angular');
require('angular-route');
require('restangular');
require('angular-resource');
require('angular-material');
require('angular-material-icons');
require('angular-aria');
require('angular-gravatar');
require('angular-material-data-table');
require('angular-messages');
require('angular-animate');
require('jquery');

/* App Module */

var spaninsApp = angular.module('spaninsApp', [
    'ngRoute',
    'restangular',
    'ngMaterial',
    'md.data.table',
    'ngMdIcons',
    'ngAnimate'
]);

var sds = ['AGGAGGT',
           'GGAGGT',
           'AGGAGG',
           'GGGGGG',
           'GGAGG',
           'GGGGG',
           'GAGGT',
           'AGGAG',
           'GAGG',
           'GGAG',
           'AGGT',
           'AGGA',
           'GGGG',
           'GGT',
           'AGG',
           'GAG',
           'GGA',
           'GGG',
           ''
           ]

var scores = [18,
              16,
              14,
              13,
              11,
              10,
               8,
               7,
               0
             ]

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
            when('/spaninfreq', {
                templateUrl: 'partials/spanin_freq.html',
                controller: 'SpaninFreqCtrl'
            }).
            when('/spaninscore', {
                templateUrl: 'partials/spanin_score.html',
                controller: 'SpaninScoreCtrl'
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

spaninsApp.filter('color_filter', function() {
    return function(input) {
        switch(true) {
            case (input < 5):
                return "#ffffb2";
            case (input >= 5 && input < 10):
                return "#fed976";
            case (input >= 10 && input < 15):
                return "#feb24c";
            case (input >= 15 && input < 20):
                return "#fd8d3c";
            case (input >= 20 && input < 30):
                return "#f03b20";
            case (input >= 30):
                return '#bd0026'
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
            } else { $scope.query.page = 1; }
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

spaninsApp.controller('SpaninFreqCtrl', ['$scope', 'Restangular', '$filter',
    function($scope, Restangular, $filter) {
        $scope.sds = sds
        $scope.ratio = function(i, j) {
            if (i) {
                return (i/$scope[j]*100).toFixed(1);
            } else {
                return 0;
            }
        };
        $scope.heatmap = function(i, j) {
            return $filter('color_filter')((i/$scope[j]*100).toFixed(1));
        };

        Restangular.oneUrl('spaninfreq', 'http://localhost:8000/spaninfreq/').get().then(function(data) {
            $scope.idk = data.plain();
            $scope.eis = 0;
            $scope.eos = 0;
            $scope.ois = 0;
            $scope.oos = 0;
            $scope.sis = 0;
            $scope.sos = 0;
            $scope.us = 0;
            for (var i in $scope.idk) {
                $scope.eis = $scope.eis + $scope.idk[i].eis;
                $scope.eos = $scope.eos + $scope.idk[i].eos;
                $scope.ois = $scope.ois + $scope.idk[i].ois;
                $scope.oos = $scope.oos + $scope.idk[i].oos;
                $scope.sis = $scope.sis + $scope.idk[i].sis;
                $scope.sos = $scope.sos + $scope.idk[i].sos;
                $scope.us = $scope.us + $scope.idk[i].us;
            }
        });
}]);

spaninsApp.controller('SpaninScoreCtrl', ['$scope', 'Restangular', '$filter',
    function($scope, Restangular, $filter) {
        $scope.scores = scores
        $scope.ratio = function(i, j) {
            if (i) {
                return (i/$scope[j]*100).toFixed(1);
            } else {
                return 0;
            }
        };
        $scope.heatmap = function(i, j) {
            return $filter('color_filter')((i/$scope[j]*100).toFixed(1));
        };

        Restangular.oneUrl('spaninfreq', 'http://localhost:8000/spaninscore/').get().then(function(data) {
            $scope.idk = data.plain();
            $scope.eis = 0;
            $scope.eos = 0;
            $scope.ois = 0;
            $scope.oos = 0;
            $scope.sis = 0;
            $scope.sos = 0;
            $scope.us = 0;
            for (var i in $scope.idk) {
                $scope.eis = $scope.eis + $scope.idk[i].eis;
                $scope.eos = $scope.eos + $scope.idk[i].eos;
                $scope.ois = $scope.ois + $scope.idk[i].ois;
                $scope.oos = $scope.oos + $scope.idk[i].oos;
                $scope.sis = $scope.sis + $scope.idk[i].sis;
                $scope.sos = $scope.sos + $scope.idk[i].sos;
                $scope.us = $scope.us + $scope.idk[i].us;
            }
        });
}]);
