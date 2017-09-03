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
      },
      get_gigs_locations: function(){
        var d = $q.defer();

        $http.get('api/locations/gigs').then(function(resp){
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
        // console.log('address:', address)
        $http.get('api/maps/geocode/' + address).then(function(resp){
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
      scope: {
        active: '='
      },
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
  .controller('HomeController', function($scope, $timeout, LocationService, GigService){
    console.log('home');
    $scope.show_gigs = false;
    $scope.show_locations = false;
    $scope.notification = {
      text: '',
      status: ''
    };
    $scope.show_notification = false;
    $scope.show_new_location = false;
    $scope.new_location = {};
    $scope.locations = [];

    $scope.show_new_gig = false;
    $scope.new_gig = {};
    $scope.gigs = [];

    $scope.notify = function(text, status, timeout){
      $scope.notification.text = text;
      $scope.notification.status = status;
      $scope.show_notification = true;
      var delay = timeout || 3000;
      $timeout(function(){
        $scope.show_notification = false;
      }, delay);
    };

    $scope.get_locations = function(){
      LocationService.get_locations().then(function(resp){
        $scope.locations = resp;
      });
    };
    $scope.get_locations();

    $scope.add_location = function(){
      $scope.show_new_location = true;
      $scope.show_new_gig = false;
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
        $scope.notify('Location saved!', 'success');
      }).catch(function(err){
        console.log('err saving location:', err);
        $scope.notify('Error saving location', 'error');
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
      $scope.show_new_location = false;
    };
    $scope.save_gig = function(){
      $scope.new_gig.start_time = moment($scope.new_gig.start_time_input).format( 'HH:mm:ss');
      $scope.new_gig.end_time = moment($scope.new_gig.end_time_input).format( 'HH:mm:ss');

      GigService.add_gig($scope.new_gig).then(function(resp){
        $scope.new_gig = {};
        $scope.show_new_gig = false;
        $scope.get_gigs();
        $scope.notify('Gig saved!', 'success');
      }).catch(function(err){
        console.log('err saving gig:', err);
        $scope.notify('Error saving gig', 'error');
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


    $scope.toggle_gigs = function(){
      $scope.show_gigs = !$scope.show_gigs;
      // console.log('show', $scope.show_gigs)
    };
    $scope.toggle_locations = function(){
      $scope.show_locations = !$scope.show_locations;
    };
  })
  .controller('MapController', function($scope, $q, $compile, MapService, GigService, LocationService){
    console.log('map');
    $scope.locations = [];
    $scope.show_drawer = false;
    $scope.active_venue = {
      id: null
    };

    MapService.get_maps().then(function(mapbox){
      // console.log('got map:', mapbox);
      mapboxgl.accessToken = mapbox.accessToken;
      var map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v9',
          center: [
            -93.281765,
            44.963267
          ],
          zoom:5
      });
      // Add geolocate control to the map.
      map.addControl(new mapboxgl.GeolocateControl({
          positionOptions: {
              enableHighAccuracy: true
          },
          trackUserLocation: true
      }));

      $scope.hide_drawer = function(){
        $scope.show_drawer = false;
      };

      $scope.select_venue = function(id){
        // console.log('click', id);
        if($scope.active_venue.id == id){
          $scope.show_drawer = false;
          $scope.active_venue = {
            id: null
          };
        } else {
          $scope.active_venue = _.find($scope.locations, function(l){
            return l.id == id;
          });
          console.log('active_venue:', $scope.active_venue)
          $scope.show_drawer = true;
        }
      }

      var promises = [
        LocationService.get_locations(),
        GigService.get_gigs()
      ];

      $q.all(promises).then(function(data){
        var locations = data[0];
        var gigs = data[1];

        locations.map(function(l){
          var el = document.createElement('div');
          el.classList.add('glyphicon');
          el.classList.add('glyphicon-music');
          el.classList.add('gig-marker');

          if(l.lat && l.lng){
            var lat_lng = [
              l.lat,
              l.lng
            ];
            var marker =  new mapboxgl.Marker(el);
            marker.gigs = _.filter(gigs, function(g){
              return g.location_id == l.id;
            });
            // marker.id = l.id;
            // marker.name = l.name;
            if(marker.gigs.length && marker.gigs.length > 0){
              el.setAttribute('ng-click', 'select_venue(' + l.id + ')'); // a bit wack but oh well
            }
            var ng_el = angular.element(el);
            $compile(ng_el)($scope);
            marker = _.extend(marker, l)

            marker.setLngLat(lat_lng)
            marker.addTo(map);
            $scope.locations.push(marker);
          }
        });
        console.log('locations:', $scope.locations);
      });
    });
  })
  .controller('ListController', function($scope){
    console.log('list')
  })
