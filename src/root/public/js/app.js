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

        $http.post('api/locations/add', location).then(function(resp){
          d.resolve(resp.data);
        }).catch(function(err){
          d.reject(err);
        });

        return d.promise;
      },
      get_locations: function(){
        var d = $q.defer();

        $http.get('api/locations/').then(function(resp){
          d.resolve(resp.data);
        }).catch(function(err){
          d.reject(err);
        });

        return d.promise;
      }
    }
  })
  .factory('GigService', function($http, $q){
    return {
      add_gig: function(location){
        var d = $q.defer();

        $http.post('api/gigs/add', location).then(function(resp){
          d.resolve(resp.data);
        }).catch(function(err){
          d.reject(err);
        });

        return d.promise;
      },
      get_gigs: function(){
        var d = $q.defer();

        $http.get('api/gigs/').then(function(resp){
          d.resolve(resp.data);
        }).catch(function(err){
          d.reject(err);
        });

        return d.promise;
      }
    }
  })
  .factory('MapService', function($q, $http){
    return {
      get_maps: function(){
        var d = $q.defer();

        $http.get('api/maps/').then(function(resp){
          d.resolve(resp.data);
        }).catch(function(err){
          d.reject(err);
        });

        return d.promise;
      },
      geocode: function(address){
        var d = $q.defer();

        $http.post('api/maps/geocode', address).then(function(resp){
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
  .controller('HomeController', function($scope, LocationService, GigService){
    console.log('home');
    $scope.show_new_location = false;
    $scope.new_location = {};
    $scope.locations = [];

    $scope.show_new_gig = false;
    $scope.new_gig = {};
    $scope.gigs = [];

    $scope.get_locations = function(){
      LocationService.get_locations().then(function(resp){
        $scope.locations = resp;
      });
    };
    $scope.get_locations();

    $scope.add_location = function(){
      $scope.show_new_location = true;
    };
    $scope.cancel_location = function(){
      $scope.show_new_location = false;
      $scope.new_location = {};
    };
    $scope.save_location = function(){
      LocationService.add_location($scope.new_location).then(function(resp){
        console.log('saved location:', resp);
        $scope.new_location = {};
        $scope.show_new_location = false;
        $scope.get_locations();
      }).catch(function(err){
        console.log('err saving location:', err);
      });
    };
    $scope.edit_location = function(l){
      $scope.new_location = l;
      $scope.show_new_location = true;
    };

    $scope.get_gigs = function(){
      GigService.get_gigs().then(function(resp){
        $scope.gigs = resp;
      });
    };
    $scope.get_gigs();
    $scope.add_gig = function(){
      $scope.show_new_gig = true;
    };
    $scope.save_gig = function(){
      GigService.add_gig($scope.new_gig).then(function(resp){
        $scope.new_gig = {};
        $scope.show_new_gig = false;
        $scope.get_gigs();
      }).catch(function(err){
        console.log('err saving gig:', err);
      });
    };
    $scope.cancel_gig = function(){
      $scope.show_new_gig = false;
      $scope.new_gig = {};
    };
    $scope.edit_gig = function(g){
      $scope.new_gig = g;
      $scope.show_new_gig = false;
    };
  })
  .controller('MapController', function($scope, MapService, GigService, LocationService){
    console.log('map');

    MapService.get_maps().then(function(mapbox){
      // console.log('got map:', mapbox);
      mapboxgl.accessToken = mapbox.accessToken;
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
    });

    LocationService.get_locations().then(function(resp){
      console.log('gigs:', resp);
      $scope.gigs = resp;

      var address = $scope.gigs[6].street + ' ' + $scope.gigs[6].city + ' ' + $scope.gigs[6].state + ' ' + $scope.gigs[6].zip;

      MapService.geocode(address).then(function(resp){
        console.log('geocode:', resp);
      }).catch(function(err){
        console.log('err', err);
      });
    })

    // mapboxgl.accessToken = 'pk.eyJ1Ijoic2FzaGFtNDMiLCJhIjoiY2lvYmlwZXB4MDN5Z3ZpbHp6Y29iNDNzOCJ9.07e5GLdp6XXmtuTGTshyWw';
    // var map = new mapboxgl.Map({
    //     container: 'map',
    //     style: 'mapbox://styles/mapbox/streets-v9'
    // });
    // // Add geolocate control to the map.
    // map.addControl(new mapboxgl.GeolocateControl({
    //     positionOptions: {
    //         enableHighAccuracy: true
    //     },
    //     trackUserLocation: true
    // }));
    //
    // var geocode = new MapboxGeocoder({
    //   accessToken: 'pk.eyJ1Ijoic2FzaGFtNDMiLCJhIjoiY2lvYmlwZXB4MDN5Z3ZpbHp6Y29iNDNzOCJ9.07e5GLdp6XXmtuTGTshyWw'
    // })
    // console.log('geocode:', geocode);
  })
  .controller('ListController', function($scope){
    console.log('list')
  })
