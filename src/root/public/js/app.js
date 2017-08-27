angular.module('GigApp', ['ngRoute'])
  .config(function($routeProvider, $locationProvider){
    $locationProvider.html5Mode({
      enabled: true,
      rewriteLinks: 'internal-link'
      // requireBase: false
    });

    $routeProvider
      .when('/', {
        controller: 'LoginController',
        templateUrl: '/partials/login.html'
      })
      .when('/home', {
        controller: 'HomeController',
        templateUrl: '/partials/home.html'
      })
      .when('/map', {
        controller: 'MapController',
        templateUrl: '/partials/map.html'
      })
      .when('/list', {
        controller: 'ListController',
        templateUrl: '/partials/list.html'
      })
  })
  .factory('LoginService', function($http, $q){
    return {
      login: function(user){
        var d = $q.defer();

        $http.get('/login').then(function(resp){
          console.log('resp:', resp);
          d.resolve(resp);
        }).catch(function(err){
          console.log('err:', err);
          d.reject(err);
        });

        return d.promise;
      }
    }
  })
  .factory('LocationService', function($http, $q){
    return {
      add_location: function(location){
        var d = $q.defer();

        $http.post('/locations/add', location).then(function(resp){
          d.resolve(resp.data);
        }).catch(function(err){
          d.reject(err);
        });

        return d.promise;
      }
    }
  })
  .directive('gigMenu', function(){
    return {
      restrict: 'E',
      // template: '<div>test</div>',
      scope: {},
      templateUrl: '/partials/menu.html'
    }
  })
  .controller('LoginController', function($scope, $location, LoginService){
    console.log('loaded', $location.url());

    $scope.login = function(){
      LoginService.login({}).then(function(resp){
        console.log("did it");
      }).catch(function(err){
        console.log("error");
      });
    };
  })
  .controller('HomeController', function($scope, LocationService){
    console.log('home');
    $scope.show_new_location = false;
    $scope.new_location = {};

    $scope.add_location = function(){
      $scope.show_location_form = true;
    };
    $scope.save_location = function(){
      LocationService.add_location($scope.new_location).then(function(resp){
        console.log('saved location:', resp);
      }).catch(function(err){
        console.log('err saving location:', err);
      });
    };
  })
  .controller('MapController', function($scope){
    console.log('map');

    mapboxgl.accessToken = 'pk.eyJ1Ijoic2FzaGFtNDMiLCJhIjoiY2lvYmlwZXB4MDN5Z3ZpbHp6Y29iNDNzOCJ9.07e5GLdp6XXmtuTGTshyWw';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9'
    });
    // Add geolocate control to the map.
    map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    }));
  })
  .controller('ListController', function($scope){
    console.log('list')
  })
