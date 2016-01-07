(function() {


// Create all modules and define dependencies to make sure they exist
// and are loaded in the correct order to satisfy dependency injection
// before all nested files are concatenated by Grunt

// Config
angular.module('acComponents.config', [])
    .value('acComponents.config', {
        debug: true
    })
    .constant('AC_API_ROOT_URL', 'http://avalanche-canada-dev.elasticbeanstalk.com');

// Modules
angular.module('acComponents.directives', []);
angular.module('acComponents.filters', []);
angular.module('acComponents.services', []);
angular.module('acComponents',
    [
        'acComponents.config',
        'acComponents.directives',
        'acComponents.filters',
        'acComponents.services',
        'acComponents.templates',
        'ngSanitize'
    ]);

angular.module('acComponents.directives')
    .directive('acDangerIcon', function () {
        return {
            replace: true,
            templateUrl: 'danger-icon.html',
            link: function ($scope, el, attrs) {
                
            }
        };
    });
angular.module('acComponents.directives')
    .directive('acDatetimePicker', function () {
        return function () {
            if(jQuery().datetimepicker) {
                var options = {
                    format: "YYYY-MM-DD hh:mm A"
                };
                $('.min-form').first().find('[type="datetime"]').datetimepicker(options);
            }
        }
    });
angular.module('acComponents.directives')
    .directive('acDrawer', function () {
        return {
            replace: true,
            transclude: true,
            templateUrl: 'drawer.html',
            link: function ($scope, el, attrs) {
                $scope.expanded = false;

                $scope.toggleObs = function() {
                  $scope.$emit('ac.acDraw.toggleObs');
                };

                $scope.toggleDate = function(filter){
                  $scope.expanded = !$scope.expanded;
                  $scope.$emit('ac.acDraw.toggleDate', filter);
                }
            }
        };
    });

angular.module('acComponents.directives')
    .directive('acForecastMini', ["AC_API_ROOT_URL", function (AC_API_ROOT_URL) {
        return {
            templateUrl: 'forecast-mini.html',
            scope: {
                forecast: '=acForecast'
            },
            link: function ($scope, el, attrs) {
                el.addClass('ac-forecast-mini');
                $scope.apiUrl = AC_API_ROOT_URL;

                $scope.externalLinkClicked = function(url){
                  $scope.$emit('ac.acForecastMini.linkClicked', url);
                };
            }
        };
    }]);

angular.module('acComponents.directives')
    .directive('acLoadingIndicator', function () {
        return {
            templateUrl: 'loading-indicator.html',
            replace: true,
            link: function ($scope, el, attrs) {

            }
        };
    });
angular.module('acComponents.directives')
    .directive('acLocationSelect', ["MAPBOX_ACCESS_TOKEN", "MAPBOX_MAP_ID", "$timeout", function(MAPBOX_ACCESS_TOKEN, MAPBOX_MAP_ID, $timeout) {
        return {
            scope: {
                latlng: '='
            },
            link: function($scope, el, attrs) {
                var map, marker;
                L.mapbox.accessToken = MAPBOX_ACCESS_TOKEN;

                function setLatlng(latlng){
                    $timeout(function () {
                        $scope.latlng = [latlng.lat, latlng.lng];
                    }, 0);
                }

                $('#minForm').on('shown.bs.modal', function (e) {
                    map.invalidateSize();
                });

                map = L.mapbox.map(el[0], MAPBOX_MAP_ID, {
                    attributionControl: false,
                    scrollWheelZoom: false
                }).on('click', function (e) {
                    if (!marker) {
                        setLatlng(e.latlng);

                        marker = L.marker(e.latlng, {
                            icon: L.mapbox.marker.icon({
                                'marker-color': 'f79118'
                            }),
                            draggable: true
                        });

                        marker.bindPopup('Position: ' + e.latlng.toString().substr(6) + '<br/>(drag to relocate)')
                            .addTo(map)
                            .openPopup();

                        marker.on('dragend', function(e) {
                            var location = marker.getLatLng();
                            marker.setPopupContent('Position: ' + location.toString().substr(6) + '<br/>(drag to relocate)');
                            marker.openPopup();

                            setLatlng(location);
                        });
                    } else if(marker && !map.hasLayer(marker)) {
                        setLatlng(e.latlng);
                        marker
                            .setLatLng(e.latlng)
                            .addTo(map)
                            .openPopup();
                    }
                });

                map.setView([52.3, -120.74966], 5);

                $scope.$watch('latlng', function (latlng) {
                    if (marker && latlng.length === 0) {
                        map.removeLayer(marker);
                    }
                });
            }
        };
    }]);

angular.module('acComponents.directives')
    .directive('acMapboxMap', ["$rootScope", "$window", "$location", "$timeout", "acBreakpoint", "acObservation", "acForecast", "MAPBOX_ACCESS_TOKEN", "MAPBOX_MAP_ID", function ($rootScope, $window, $location, $timeout, acBreakpoint, acObservation, acForecast, MAPBOX_ACCESS_TOKEN, MAPBOX_MAP_ID) {
        return {
            template: '<div id="map"></div>',
            replace: true,
            scope: {
                region: '=acRegion',
                regions: '=acRegions',
                showRegions: '=acShowRegions',
                obs: '=acObs',
                ob: '=acOb'
            },
            link: function ($scope, el, attrs) {
                $scope.device = {};
                $scope.showRegions = $scope.showRegions || true;
                var layers = {
                    dangerIcons: L.featureGroup()
                };
                var styles = {
                    region: {
                        default: {
                            fillColor: 'transparent',
                            color: 'transparent'
                        },
                        selected: {
                            fillColor: '#489BDF'
                        },
                        hover: {
                            color: '#B43A7E'
                        },
                        selectedhover: {
                            fillColor: '#489BDF',
                            color: '#B43A7E'
                        }
                    }
                };

                L.mapbox.accessToken = MAPBOX_ACCESS_TOKEN;
                var map = L.mapbox.map(el[0].id, MAPBOX_MAP_ID, {attributionControl: false});
                map.setView([52.3, -120.74966],6);

                /*var provinces = L.mapbox.geocoder('mapbox.places-province-v1');
                provinces.query('British-Columbia', function (err, results) {
                    var bcBounds = L.latLngBounds([results.bounds[1], results.bounds[0]], [results.bounds[3], results.bounds[2]]);
                    map.fitBounds(bcBounds);
                });*/

                L.control.locate({
                    locateOptions: {
                        maxZoom: 14
                    }
                }).addTo(map);

                acBreakpoint.setBreakpoints({
                    xs: 480,
                    sm: 600,
                    md: 1025,
                });

                $rootScope.$on('breakpoint', function (e, breakpoint) {
                    $scope.device.size = breakpoint;
                });

                function getInvalidateSize(topOffset) {
                    return function () {
                        el.height($($window).height()-Number(topOffset));
                        map.invalidateSize();
                    }
                }

                if(attrs.topOffset) {
                    var offset = Number(attrs.topOffset);
                    var invalidateSize = getInvalidateSize(offset);

                    angular.element(document).ready(invalidateSize);
                    angular.element($window).bind('resize', invalidateSize);
                }

                function getDangerIcon(options) {
                    var size = map.getZoom() <= 6 ? 60 : 80;

                    return L.icon({
                        iconUrl: options.iconUrl || acForecast.getDangerIconUrl(options.regionId),
                        iconSize: [size, size],
                        labelAnchor: [6, 0]
                    });
                };

                function initRegionsLayer(){
                    layers.regions = L.geoJson($scope.regions, {
                        style: function(feature) {
                            return styles.region.default;
                        },
                        onEachFeature: function (featureData, layer) {
                            layer.bindLabel(featureData.properties.name);

                            function showRegion(evt){
                                if(map.getZoom() < 9) {
                                    var padding = getMapPadding();

                                    map.fitBounds(layer.getBounds(), {
                                        paddingBottomRight: padding
                                    });
                                }

                                layers.currentRegion = layer;

                                $scope.$apply(function () {
                                    $scope.region = layer;
                                });
                            }

                            layer.on('click', showRegion);

                            layer.on('mouseover', function() {
                                if(layer == layers.currentRegion){
                                    layer.setStyle(styles.region.selectedhover);
                                } else {
                                    layer.setStyle(styles.region.hover);
                                }
                            });

                            layer.on('mouseout', function() {
                                if(layer == layers.currentRegion){
                                    layer.setStyle(styles.region.selected);
                                } else {
                                    layer.setStyle(styles.region.default);
                                }
                            });

                            if(featureData.properties.centroid) {
                                var centroid = L.latLng(featureData.properties.centroid[1], featureData.properties.centroid[0]);

                                var marker = L.marker(centroid);
                                var icon = getDangerIcon({regionId: featureData.id});

                                marker.setIcon(icon);
                                var zindex = 1;
                                marker.setZIndexOffset(zindex);

                                marker.on('click', function () {
                                    //zindex = zindex === 1 ? 200 : 1;
                                    //marker.setZIndexOffset(zindex);
                                    showRegion();
                                });

                                layers.dangerIcons.addLayer(marker);
                            }
                        }
                    });

                    refreshLayers();
                }

                function refreshDangerIconsLayer(){
                    layers.dangerIcons.eachLayer(function (dangerIconLayer) {
                        var iconUrl = dangerIconLayer.options.icon.options.iconUrl;
                        var icon = getDangerIcon({ iconUrl: iconUrl });

                        dangerIconLayer.setIcon(icon);
                    });
                }

                function refreshLayers(){
                    var zoom = map.getZoom();

                    if(layers.regions && $scope.showRegions) {
                        var regionsVisible = map.hasLayer(layers.regions);

                        if(zoom < 6 && regionsVisible) {
                            map.removeLayer(layers.regions);
                        } else if (zoom >= 6 && !regionsVisible) {
                            map.addLayer(layers.regions);
                        } else if (zoom > 10 && regionsVisible) {
                            map.removeLayer(layers.regions);
                        }
                    }

                    if(layers.dangerIcons) {
                        var dangerIconsVisible = map.hasLayer(layers.dangerIcons);

                        if(map.getZoom() < 6 && dangerIconsVisible) {
                            map.removeLayer(layers.dangerIcons);
                        } else if (map.getZoom() >= 6 && !dangerIconsVisible){
                            map.addLayer(layers.dangerIcons);
                        }

                        var dangerIcon = layers.dangerIcons.getLayers()[0];
                        if(dangerIcon){
                            var dangerIconSize = dangerIcon.options.icon.options.iconSize[0];
                            if ((zoom > 6 && dangerIconSize === 60) || (zoom <= 6 && dangerIconSize === 80)) {
                                refreshDangerIconsLayer();
                            }
                        }
                    }

                    if(layers.obs) {
                        // var obsVisible = map.hasLayer(layers.obs);

                        // if(map.getZoom() < 7 && obsVisible) {
                        //     map.removeLayer(layers.obs);
                        // } else if (map.getZoom() >= 7 && !obsVisible){
                        //     map.addLayer(layers.obs);
                        // }

                        map.addLayer(layers.obs);
                    }

                    var opacity = 0.2;
                    if(layers.currentRegion && $scope.showRegions) {
                        if(zoom <= 9) {
                            styles.region.selected.fillOpacity = opacity;
                            layers.currentRegion.setStyle(styles.region.selected);
                        } else if(zoom > 9 && zoom < 13){
                            switch(zoom){
                                case 10:
                                    opacity = 0.15;
                                    break;
                                case 11:
                                    opacity = 0.10;
                                    break;
                                case 12:
                                    opacity = 0.05;
                                    break;
                            }

                            styles.region.selected.fillOpacity = opacity;
                            layers.currentRegion.setStyle(styles.region.selected);
                        } else {
                            layers.currentRegion.setStyle(styles.region.default);
                        }
                    }
                }

                function refreshObsLayer() {
                    if (map.hasLayer(layers.obs)){
                        map.removeLayer(layers.obs);
                    }

                    if($scope.obs.length > 0 ) {
                        var markers = $scope.obs.map(function (ob) {

                            var marker = L.marker(ob.latlng, {
                                icon: L.mapbox.marker.icon({
                                    'marker-size': 'small',
                                    'marker-color': '#09c'
                                })
                            });

                            marker.on('click', function () {
                                acObservation.getOne(ob.obid, 'html').then(function (obHtml) {
                                    $scope.$emit('ac.min.obclicked', obHtml);
                                    /*
                                    if($scope.device.size === 'sm' || $scope.device.size === 'xs') {
                                        $scope.$emit('ac.min.obclicked', obHtml);
                                    } else {
                                        var popup = marker.getPopup();

                                        if(!popup) {
                                            var maxHeight = map.getSize().y - 100;
                                            popup = L.popup({maxHeight: maxHeight, maxWidth: 400, autoPanPaddingTopLeft: [0, 30]});
                                            popup.setContent(obHtml);
                                            marker.bindPopup(popup);
                                        }

                                        marker.openPopup();
                                    }*/
                                });
                            });

                            marker.setZIndexOffset(100);

                            return marker;
                        });

                        layers.obs = L.featureGroup(markers);
                        layers.obs.bringToFront();
                    } else {
                        layers.obs = undefined;
                    }

                    refreshLayers();
                }

                function latLngToGeoJSON(latlng){
                    return {
                        type: 'Point',
                        coordinates: [latlng.lng, latlng.lat]
                    };
                }

                function getMapPadding(){
                    switch($scope.device.size) {
                        case 'xs':
                            return L.point([0, 0]);
                        case 'sm':
                            return L.point([350, 0]);
                        case 'md':
                        case 'lg':
                            return L.point([480, 0]);
                        default:
                            return L.point([0,0]);
                    }
                }

                function getMapOffset(){
                    return getMapPadding().divideBy(2);
                }

                // offfset can be negative i.e. [-240, 0]
                function offsetLatLng(latlng, offset){
                    var point = map.latLngToLayerPoint(latlng);
                    return map.layerPointToLatLng(point.subtract(offset));
                }

                function getMapCenter(){
                    var offset = getMapOffset();
                    return offsetLatLng(map.getCenter(), offset);
                }


                function setRegionFocus() {
                    if($scope.showRegions){
                        var regionLayers = layers.regions.getLayers();
                        var mapCenter = getMapCenter();

                        var region = _.find(regionLayers, function (r) {
                            return gju.pointInPolygon(latLngToGeoJSON(mapCenter), r.feature.geometry);
                        });

                        if(!region){
                            region = _.min(regionLayers, function (r) {
                                var centroid = L.latLng(r.feature.properties.centroid[1], r.feature.properties.centroid[0]);
                                return centroid.distanceTo(mapCenter);
                            });
                        }

                        if(region) setRegion(region);
                    }
                }

                function setRegion(region) {
                    layers.currentRegion = region;
                    if($scope.region !== region) {
                        $timeout(function () {
                            $scope.region = region;
                        }, 10);
                    }

                    layers.regions.eachLayer(function (layer) {
                        if(layer === region){
                            layer.setStyle(styles.region.selected);
                        } else {
                            layer.setStyle(styles.region.default);
                        }
                    });
                }


                map.on('load', refreshLayers);
                //map.on('dragend', setRegionFocus);
                map.on('zoomend', refreshLayers);

                $scope.$watch('region', function (newRegion, oldRegion) {
                    if(layers.regions && newRegion && newRegion !== oldRegion) {
                        setRegion(newRegion);
                    }
                });

                $scope.$watch('regions', function (newRegions, oldRegions) {
                    if(newRegions && newRegions.features) {
                        initRegionsLayer();
                    }
                });

                $scope.$watch('showRegions', function (newShowRegions, oldShowRegions) {
                    if(newShowRegions !== oldShowRegions) {
                        if(!newShowRegions && map.hasLayer(layers.regions)) {
                            if(layers.currentRegion) {
                                $scope.region = null;
                                layers.currentRegion.setStyle(styles.region.default);
                            }
                            map.removeLayer(layers.regions);
                        } else if (newShowRegions && !map.hasLayer(layers.regions)) {
                            map.addLayer(layers.regions);
                            setRegionFocus();
                        }
                    }
                });

                $scope.$watch('obs', function (newObs, oldObs) {
                    if(newObs) {
                        refreshObsLayer();
                    }
                });

                $scope.$watch('ob', function (newObs, oldObs) {
                    if(newObs && newObs.latlng) {
                        acObservation.getOne(newObs.obid, 'html').then(function (obHtml) {
                            var marker = L.marker(newObs.latlng, {
                                icon: L.mapbox.marker.icon({
                                    'marker-size': 'small',
                                    'marker-color': '#09c'
                                })
                            });
                            var maxHeight = map.getSize().y - 100;

                            marker.bindPopup(obHtml, {maxHeight: maxHeight, maxWidth: 400, autoPanPaddingTopLeft: [0, 30]});
                            marker.on('popupclose', function () {
                                map.removeLayer(marker);
                                $timeout(function () {
                                    $location.path('/');
                                }, 0);
                            });

                            marker.setZIndexOffset(10000);
                            map.addLayer(marker);

                            marker.togglePopup();
                        });
                    }
                });

            }
        };
    }]);

angular.module('acComponents.directives')
    .directive('fileModel', ["$parse", function($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function() {
                    scope.$apply(function() {
                        modelSetter(scope, element[0].files);
                    });
                });
            }
        };
    }])
    .directive('acMinReportForm', ["$q", "$timeout", "acQuickReportData", "acSubmission", "MAPBOX_ACCESS_TOKEN", "MAPBOX_MAP_ID", "store", function($q, $timeout, acQuickReportData, acSubmission, MAPBOX_ACCESS_TOKEN, MAPBOX_MAP_ID, store) {
        return {
            templateUrl: 'min-report-form.html',
            replace: true,
            link: function($scope, el, attrs) {
                var reportTemplate = {
                    title: 'auto: Quick Report',
                    datetime: moment().format('YYYY-MM-DD hh:mm A'),
                    latlng: [],
                    files: [],
                    ridingConditions: angular.copy(acQuickReportData.ridingConditions),
                    avalancheConditions: angular.copy(acQuickReportData.avalancheConditions),
                    comment: null
                };
                $scope.report = angular.copy(reportTemplate);

                function resetForm() {
                    $timeout(function () {
                        for (var field in $scope.report) {
                            if(field in reportTemplate) {
                                if(field === 'ridingConditions' || field === 'avalancheConditions'){
                                    $scope.report[field] = angular.copy(reportTemplate[field]);
                                } else {
                                    $scope.report[field] = reportTemplate[field];
                                }
                            }
                        }
                        delete $scope.report.subid;
                        $scope.minsubmitting = false;
                        $scope.minerror = false;
                    }, 0);
                }

                $scope.resetForm = resetForm;

                $scope.submitForm = function() {
                    var token = store.get('token');
                    if (token) {
                        $scope.minsubmitting = true;
                        return acSubmission.submit($scope.report, token).then(function(result) {
                            if (result.data && !('error' in result.data)) {
                                $scope.minsubmitting = false;
                                $scope.report.subid = result.data.subid;
                                $scope.report.shareUrl = result.data.obs[0].shareUrl;
                                console.log('submission: ' + result.data.subid);
                                return result;
                            } else {
                                $scope.minsubmitting = false;
                                $scope.minerror = true;
                                return $q.reject('error');
                            }
                        }, function(err) {
                            $scope.minsubmitting = false;
                            $scope.minerror = true;
                            $scope.minerrormsg = err;
                            return $q.reject(err);
                        });
                    } else {
                        return $q.reject('auth-error');
                    }
                };
            }
        };
    }]);

angular.module('acComponents.directives')
    .directive('acMinReportModal', function () {
        return {
            templateUrl: 'min-report-modal.html',
            replace: true,
            link: function ($scope, el, attrs) {

            }
        };
    });
angular.module('acComponents.directives')
    .directive('acSocialShare', function () {
        return {
            templateUrl: 'social-share.html',
            replace: true,
            link: function ($scope, el, attrs) {

            }
        };
    });
angular.module('acComponents.filters')
    .filter('acNormalizeForecastTitle', function () {
        return function (item) {
            if (item) {
                return item.replace(/^Avalanche (Forecast|Bulletin) - /g, '');
            }
        };
    });
'use strict';

angular.module('acComponents.filters')
    .filter('dateUtc', function () {
        return function (datePST, format) {
            if (datePST) {
                return moment.utc(datePST).format(format) ;
            }
        };
    });

angular.module('acComponents.services')
    .factory('acBreakpoint', ["$rootScope", "$timeout", "$window", function ($rootScope, $timeout, $window) {
        return {
            setBreakpoints: function (breakpoints) { // {xs: 400, sm: 600, md: 1025}
                var breakpoint;

                function broadcastBreakpoint() {
                    var bp;
                    var width = $($window).width();

                    if(width < breakpoints.xs) {
                        bp = 'xs';
                    } else if(width >= breakpoints.xs && width < breakpoints.sm) {
                        bp = 'sm';
                    } else if(width >= breakpoints.sm && width < breakpoints.md) {
                        bp = 'md';
                    } else {
                        bp = 'lg';
                    }

                    if(!breakpoint || bp !== breakpoint) {
                        breakpoint = bp;
                        $timeout(function () {
                            $rootScope.$broadcast('breakpoint', breakpoint);
                        }, 0);
                    }
                }

                broadcastBreakpoint();
                angular.element($window).bind('resize', broadcastBreakpoint);
            }
        };
    }]);
angular.module('acComponents.services')
    .factory('acForecast', ["$http", "$q", "acImageCache", "AC_API_ROOT_URL", function ($http, $q, acImageCache, AC_API_ROOT_URL) {
        var forecasts;
        var apiUrl = AC_API_ROOT_URL; // todo: move to constants

        function cacheDangerIcons(){
            var dangerIcons = _.map(forecasts.features, function (f) {
                return apiUrl + f.properties.dangerIconUrl;
            });

            acImageCache.cache(dangerIcons);
        }

        return {
            fetch: function () {
                var deferred = $q.defer();

                if(forecasts) {
                    deferred.resolve(forecasts);
                } else {
                    $http.get(apiUrl + '/api/forecasts').then(function (res) {
                        forecasts = res.data;
                        deferred.resolve(forecasts);
                    });
                }

                return deferred.promise;
            },
            getOne: function (regionId) {
                return $q.when(this.fetch()).then(function () {
                    var region = _.find(forecasts.features, {id: regionId});

                    return $http.get(apiUrl + region.properties.forecastUrl).then(function (res) {
                        return res.data;
                    });
                });
            },
            getDangerIconUrl: function(regionId) {
                var region = _.find(forecasts.features, {id: regionId});
                
                return AC_API_ROOT_URL + region.properties.dangerIconUrl
            }
        };
    }]);
angular.module('acComponents.services')
    .factory('acImageCache', ["$http", function($http) {
        return {
            cache: function (images) {
                images.forEach(function (i) {
                    $http.get(i);
                });
            }
        };
    }]);
angular.module('acComponents.services')
    .factory('acObservation', ["$http", "AC_API_ROOT_URL", function ($http, AC_API_ROOT_URL) {
        var endpointUrl = AC_API_ROOT_URL + '/api/min/observations';

        return {
            byPeriod: function (period) {
                var opt = {params: {last: period || '2:days'}};

                return $http.get(endpointUrl, opt).then(function (res) {
                    return res.data;
                });
            },
            getOne: function(obid, format) {
                var format = '.'+format || '';
                var obUrl = endpointUrl + '/' + obid + format;
                
                return $http.get(obUrl).then(function (res) {
                    return res.data;
                });
            }
        };
    }]);
angular.module('acComponents.services')
    .service('acQuickReportData', function() {
        this.avalancheConditions = {
            'slab': false,
            'sound': false,
            'snow': false,
            'temp': false,
        };

        this.ridingConditions = {
            ridingQuality: {
                prompt: 'Riding quality was:',
                type: 'single',
                options: ['Amazing', 'Good', 'OK', 'Terrible'],
                selected: null
            },

            snowConditions: {
                type: 'multiple',
                prompt: 'Snow conditions were:',
                options: {
                    'Crusty': false,
                    'Powder': false,
                    'Deep powder': false,
                    'Wet': false,
                    'Heavy': false,
                    'Wind affected': false,
                    'Hard': false
                }
            },

            rideType: {
                type: 'multiple',
                prompt: 'We rode:',
                options: {
                    'Mellow slopes': false,
                    'Steep slopes': false,
                    'Convex slopes': false,
                    'Sunny slopes': false,
                    'Cut-blocks': false,
                    'Open trees': false,
                    'Dense trees': false,
                    'Alpine slopes': false
                }
            },

            stayedAway: {
                type: 'multiple',
                prompt: 'We stayed away from:',
                options: {
                    'Steep slopes': false,
                    'Convex slopes': false,
                    'Sunny slopes': false,
                    'Cut-blocks': false,
                    'Open trees': false,
                    'Alpine slopes': false
                }
            },

            weather: {
                type: 'multiple',
                prompt: 'The day was:',
                options: {
                    'Stormy': false,
                    'Windy': false,
                    'Sunny': false,
                    'Cold': false,
                    'Warm': false,
                    'Cloudy': false,
                    'Foggy': false,
                    'Wet': false
                }
            }
        };
    });

angular.module('acComponents.services')
    .factory('acSubmission', ["$q", "$http", "AC_API_ROOT_URL", function ($q, $http, AC_API_ROOT_URL) {
        var endpointUrl = AC_API_ROOT_URL + '/api/min/submissions';
        var sizeLimit = 25000000;
        var allowedMimeTypes = ['image/png', 'image/jpeg'];
        var fileViolationErrorMsg = 'Invalid file! Files have to be smaller than 25 MB and of type: ' + allowedMimeTypes.join(', ');

        function fileIsValid(file){
            return file.size < sizeLimit && allowedMimeTypes.indexOf(file.type) !== -1;
        }

        function fileAreValid(files){
            return _.reduce(files, function (memo, file) {
                return memo && fileIsValid(file);
            }, true);
        }

        function prepareData(reportData) {
            var deferred = $q.defer();

            if(fileAreValid(reportData.files)){
                var formData =  _.reduce(reportData, function (data, value, key) {
                    if(key === 'files') {
                        _.forEach(value, function(file, counter) {
                            data.append('file' + counter, file, file.name);
                        });
                    } else if(_.isPlainObject(value) || _.isArray(value)) {
                        data.append(key, JSON.stringify(value));
                    } else if(key === 'datetime') {
                        data.append(key, moment(value, 'YYYY-MM-DD hh:mm A').format());
                    } else if(_.isString(value)) {
                        data.append(key, value);
                    }

                    return data;
                }, new FormData());

                deferred.resolve(formData);
            } else {
                deferred.reject(fileViolationErrorMsg);
            }

            return deferred.promise;
        }

        return {
            submit: function (submission, token) {
                return prepareData(submission).then(function (formData) {
                    return $http.post(endpointUrl, formData, {
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Bearer ' + token
                        }
                    });
                });
            },
            byPeriod: function (period) {
                var opt = {params: {period: period || '2:days'}};

                return $http.get(endpointUrl, opt).then(function (res) {
                    return res.data;
                });
            },
            getOne: function(obid, format) {
                var format = '.'+format || '';
                var obUrl = endpointUrl + obid + format;
                
                return $http.get(endpointUrl).then(function (res) {
                    return res.data;
                });
            }
        };
    }]);
angular.module("acComponents.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("danger-icon.html","<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"398.5 12.1 555 560\" enable-background=\"new 398.5 12.1 555 560\" xml:space=\"preserve\" class=\"danger-icon\"><polygon id=\"alp\" points=\"747.7,218.1 623.1,197.6 678.8,109.8\"></polygon><polygon id=\"tln\" points=\"794.2,291 542.8,323.6 616.7,207.4 755.5,230.3\"></polygon><polygon id=\"btl\" points=\"858.3,391.8 499.4,391.8 535.1,335.5 800.6,301.1\"></polygon></svg>");
$templateCache.put("drawer.html","<div class=\"ac-drawer\"><style>.ac-drawer-tools {\n    z-index: -200;\n}\n\n.ac-date-filters {\n    background-color: transparent;\n}\n\n.ac-date-filters ul {\n    position: relative;\n    width: 150px;\n}\n\n.ac-date-filters ul.expanded {\n    right: 100px;\n}\n\n.ac-date-filters ul li {\n    color: rgba(255, 255, 255, 0.2);\n}\n\n.ac-date-filters ul li.on {\n    color: rgb(0, 86, 183);\n}\n\n.ac-date-filters ul li i {\n    padding-top: 5px;\n    margin-left: 8px;\n}\n\n.ac-date-filters ul li span {\n    display: block;\n    font-size: 0.7em;\n    padding-left: 4px;\n}\n</style><a ng-click=\"drawer.visible = false\" class=\"ac-drawer-close visible-xs\"><i class=\"fa fa-close fa-lg\"></i></a><div class=\"ac-drawer-tools\"><ul><li ng-click=\"toggleObs()\" ng-class=\"{on: filters.obsPeriod !== \'\'}\" style=\"padding-top: 11px; padding-left: 15px;\"><i class=\"fa fa-map-marker fa-inverse fa-2x\"></i></li><li style=\"background-color: transparent;\" class=\"ac-date-filters\"><ul ng-class=\"{expanded: expanded}\" class=\"list-inline\"><li ng-repeat=\"dateFilter in dateFilters\" ng-click=\"toggleDate(\'obsPeriod:\' + dateFilter)\" ng-class=\"{on: filters.obsPeriod === dateFilter}\"><i class=\"fa fa-calendar fa-inverse fa-2x\"></i><span>{{ dateFilter }}</span></li></ul></li></ul></div><div ng-transclude=\"ng-transclude\" class=\"ac-drawer-body\"></div></div>");
$templateCache.put("forecast-mini.html","<div class=\"panel\"><div ng-show=\"forecast.externalUrl\" style=\"min-height: 500px;\" class=\"panel-body\"><div class=\"row\"><div class=\"col-xs-12\"><h3 class=\"ac-forecast-region\">{{ forecast.name }}</h3></div></div><div class=\"row\"><div class=\"col-xs-12\"><p>Avalanche information for this region is available &nbsp;<a ng-click=\"externalLinkClicked(forecast.externalUrl)\"><i class=\"fa fa-external-link\">here</i></a></p></div></div></div><div ng-hide=\"forecast.externalUrl\" class=\"panel-body ac-forecast-mini-body\"><div scroll=\"true\" class=\"ion-content\"><div class=\"row\"><div class=\"col-xs-12\"><h4 class=\"ac-forecast-region\">{{ forecast.bulletinTitle | acNormalizeForecastTitle }}</h4></div></div><div class=\"row ac-forecast-dates\"><div class=\"col-md-6\"><dl><dd class=\"small\"><strong class=\"ac-text-primary\">DATE ISSUED</strong></dd><dt class=\"small\"><span class=\"ac-text-default\">{{ forecast.dateIssued | date:\'EEEE MMMM d, y h:mm a\'  | uppercase }}</span></dt></dl></div><div class=\"col-md-6\"><dl><dd class=\"small\"><strong class=\"ac-text-primary\">VALID UNTIL</strong></dd><dt class=\"small\"><span class=\"ac-text-default\">{{ forecast.validUntil | date:\'EEEE MMMM d, y h:mm a\' | uppercase }}</span></dt></dl></div></div><div class=\"row\"><div class=\"col-xs-12\"><p class=\"ac-forecast-highlights\"><strong ng-bind-html=\"forecast.highlights\"></strong></p></div></div><div class=\"row\"><div class=\"col-xs-12\"><ul role=\"tablist\" class=\"nav nav-pills\"><li class=\"active\"><a href=\"\" role=\"tab\" data-target=\"#forecast\" data-toggle=\"tab\">Forecast</a></li><li><a href=\"\" role=\"tab\" data-target=\"#problems\" data-toggle=\"tab\">Problems</a></li><li><a href=\"\" role=\"tab\" data-target=\"#details\" data-toggle=\"tab\">Details</a></li><li><a href=\"/forecasts/{{forecast.region}}\" role=\"tab\" data-toggle=\"tab\">Full Page</a></li></ul><div class=\"tab-content\"><div id=\"forecast\" class=\"tab-pane active\"><div class=\"row\"><div class=\"col-xs-12\"><div class=\"panel panel-primary\"><div class=\"panel-heading\">{{ forecast.dangerRatings[0].date | dateUtc:\'dddd\' }}</div><div ng-hide=\"forecast.dangerMode==\'Spring situation\'\" class=\"panel-body ac-forecast-nowcast\"><img ng-show=\"forecast.region\" ng-src=\"{{forecast.region &amp;&amp; apiUrl+\'/api/forecasts/\' + forecast.region  + \'/nowcast.svg\' || \'\'}}\" class=\"ac-nowcast\"/></div><div ng-show=\"forecast.dangerMode==\'Spring situation\'\" class=\"panel-body spring-forecast\"><img ng-src=\"http://www.avalanche.ca/assets/images/no_rating_icon_only.svg\" class=\"col-md-4 spring-img\"/><p class=\"col-md-8\">The avalanche danger is variable and can range from Low to High. Travelling early in the day is recommended, as conditions can change rapidly in short periods of time due to daytime warming. Pay careful attention to the integrity of surface crusts formed overnight and rising air temperatures during the day. Dry slab avalanche danger may also exist during spring snow storms.<a ng-click=\"externalLinkClicked(forecast.externalUrl)\">More Spring Conditions details.</a></p></div><table class=\"table table-condensed ac-forecast-days\"><thead class=\"ac-thead-dark\"><tr><th></th><th>{{ forecast.dangerRatings[1].date | dateUtc:\'dddd\' }}</th><th>{{ forecast.dangerRatings[2].date | dateUtc:\'dddd\' }}</th></tr></thead><tbody><tr><td class=\"ac-veg-zone--alp\"><strong>Alpine</strong></td><td class=\"ac-danger-rating--{{ forecast.dangerRatings[1].dangerRating.alp.split(\':\')[1].toLowerCase()}}\"><strong>{{ forecast.dangerRatings[1].dangerRating.alp.replace(\':\', \' \') }}</strong></td><td class=\"ac-danger-rating--{{ forecast.dangerRatings[2].dangerRating.alp.split(\':\')[1].toLowerCase()}}\"><strong>{{ forecast.dangerRatings[2].dangerRating.alp.replace(\':\', \' \') }}</strong></td></tr><tr><td class=\"ac-veg-zone--tln\"><strong>Treeline</strong></td><td class=\"ac-danger-rating--{{ forecast.dangerRatings[1].dangerRating.tln.split(\':\')[1].toLowerCase()}}\"><strong>{{ forecast.dangerRatings[1].dangerRating.tln.replace(\':\', \' \') }}</strong></td><td class=\"ac-danger-rating--{{ forecast.dangerRatings[2].dangerRating.tln.split(\':\')[1].toLowerCase()}}\"><strong>{{ forecast.dangerRatings[2].dangerRating.tln.replace(\':\', \' \') }}</strong></td></tr><tr><td class=\"ac-veg-zone--btl\"><strong>Bellow Treeline</strong></td><td class=\"ac-danger-rating--{{ forecast.dangerRatings[1].dangerRating.btl.split(\':\')[1].toLowerCase()}}\"><strong>{{ forecast.dangerRatings[1].dangerRating.btl.replace(\':\', \' \') }}</strong></td><td class=\"ac-danger-rating--{{ forecast.dangerRatings[2].dangerRating.btl.split(\':\')[1].toLowerCase()}}\"><strong>{{ forecast.dangerRatings[2].dangerRating.btl.replace(\':\', \' \') }}</strong></td></tr><tr><td><strong>Confidence:</strong></td><td colspan=\"2\"><span class=\"ac-text-default\">{{ forecast.confidence }}</span></td></tr></tbody></table></div></div></div></div><div id=\"problems\" class=\"tab-pane\"><div id=\"problemsAccordion\" class=\"panel-group\"><div ng-repeat=\"problem in forecast.problems\" class=\"panel panel-primary\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><a href=\"\" data-target=\"#problem{{$index}}\" data-toggle=\"collapse\" data-parent=\"#problemsAccordion\">{{ problem.type }}<i class=\"fa fa-fw fa-level-down pull-right\"></i><small class=\"pull-right\">click to expand</small></a></h4></div><div id=\"problem{{$index}}\" class=\"panel-collapse collapse\"><div class=\"panel-body\"><div class=\"row\"><div class=\"col-md-6\"><div class=\"panel panel-default\"><div class=\"panel-heading\"><strong class=\"small\">What Elevations?</strong></div><div class=\"panel-body ac-problem-icon ac-problem-icon--elevations\"><img ng-src=\"{{problem.icons.elevations}}\" class=\"center-block\"/></div></div></div><div class=\"col-md-6\"><div class=\"panel panel-default\"><div class=\"panel-heading\"><strong class=\"small\">What Aspects?</strong></div><div class=\"panel-body ac-problem-icon ac-problem-icon--aspects\"><img ng-src=\"{{problem.icons.aspects}}\" class=\"center-block\"/></div></div></div></div><div class=\"row\"><div class=\"col-md-6\"><div class=\"panel panel-default\"><div class=\"panel-heading\"><strong class=\"small\">Chances of Avalanches?</strong></div><div class=\"panel-body ac-problem-icon ac-problem-icon--likelihood\"><img ng-src=\"{{problem.icons.likelihood}}\" class=\"center-block\"/></div></div></div><div class=\"col-md-6\"><div class=\"panel panel-default\"><div class=\"panel-heading\"><strong class=\"small\">Expected Size?</strong></div><div class=\"panel-body ac-problem-icon ac-problem-icon--expected-size\"><img ng-src=\"{{problem.icons.expectedSize}}\" class=\"center-block\"/></div></div></div></div><div class=\"row\"><div class=\"col-md-12\"><p ng-bind-html=\"problem.comment\" class=\"ac-problem narative\"></p><div class=\"panel panel-default ac-problem-travel-advice\"><div class=\"panel-heading\"><strong class=\"small\">Travel and Terrain Advice</strong></div><div class=\"panel-body\"><p ng-bind-html=\"problem.travelAndTerrainAdvice\"></p></div></div></div></div></div></div></div></div></div><div id=\"details\" class=\"tab-pane\"><div id=\"detailsAccordion\" class=\"panel-group\"><div class=\"panel panel-primary\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><a href=\"\" data-target=\"#avalancheSummary\" data-toggle=\"collapse\" data-parent=\"#detailsAccordion\">Avalanche Summary<i class=\"fa fa-fw fa-level-down fa-lg pull-right\"></i><small class=\"pull-right\">click to expand</small></a></h4></div><div id=\"avalancheSummary\" class=\"panel-collapse collapse\"><div ng-bind-html=\"forecast.avalancheSummary\" class=\"panel-body\"></div></div></div><div class=\"panel panel-primary\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><a href=\"\" data-target=\"#snowpackSummary\" data-toggle=\"collapse\" data-parent=\"#detailsAccordion\">Snowpack Summary<i class=\"fa fa-fw fa-level-down fa-lg pull-right\"></i><small class=\"pull-right\">click to expand</small></a></h4></div><div id=\"snowpackSummary\" class=\"panel-collapse collapse\"><div ng-bind-html=\"forecast.snowpackSummary\" class=\"panel-body\"></div></div></div><div class=\"panel panel-primary\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><a href=\"\" data-target=\"#weatherForecast\" data-toggle=\"collapse\" data-parent=\"#detailsAccordion\">Weather Forecast<i class=\"fa fa-fw fa-level-down fa-lg pull-right\"></i><small class=\"pull-right\">click to expand</small></a></h4></div><div id=\"weatherForecast\" class=\"panel-collapse collapse\"><div ng-bind-html=\"forecast.weatherForecast\" class=\"panel-body\"></div></div></div></div></div></div></div></div></div></div></div>");
$templateCache.put("loading-indicator.html","<div class=\"ac-loading-indicator\"><div class=\"rect1\"></div><div class=\"rect2\"></div><div class=\"rect3\"></div><div class=\"rect4\"></div><div class=\"rect5\"></div></div>");
$templateCache.put("min-report-form.html","<div class=\"min-form\"><form name=\"acMinForm\" ng-submit=\"submitForm()\" ng-show=\"!report.subid &amp;&amp; !minerror\" role=\"form\"><div ng-class=\"{\'has-error\': !acMinForm.title.$valid}\" class=\"form-group\"><label for=\"title\"><i class=\"fa fa-newspaper-o\"></i> Report title</label><input type=\"text\" name=\"title\" ng-model=\"report.title\" required=\"required\" class=\"form-control\"/></div><div ng-class=\"{\'has-error\': !acMinForm.datetime.$valid}\" class=\"form-group\"><label for=\"datetime\"><i class=\"fa fa-clock-o\"></i> Date and Time</label><input type=\"datetime\" name=\"datetime\" ng-model=\"report.datetime\" ac-datetime-picker=\"ac-datetime-picker\" class=\"form-control\"/></div><div ng-class=\"{\'has-error\': !acMinForm.latlng.$valid}\" class=\"form-group\"><label for=\"latlng\"><i class=\"fa fa-map-marker\"></i> Location</label><div ac-location-select=\"ac-location-select\" latlng=\"report.latlng\" style=\"height: 300px; width: 100%; margin: 10px 0;\"></div><input type=\"text\" name=\"latlng\" ng-model=\"report.latlng\" placeholder=\"Drop pin on map to set location\" required=\"required\" class=\"form-control\"/></div><div class=\"form-group\"><label for=\"uploads\"><i class=\"fa fa-image\"></i> Add photo<small style=\"font-weight: normal;\"> .jpg or .png</small></label><input type=\"file\" name=\"uploads\" file-model=\"report.files\" accept=\".png,.jpg,.jpeg\" multiple=\"multiple\" class=\"form-control\"/><div>{{ report.files.length }} photos added</div></div><div class=\"panel-group\"><div class=\"panel panel-default\"><div style=\"background-color: black; color: white;\" class=\"panel-heading\"><h4 class=\"panel-title\">Riding conditions</h4></div><div class=\"panel-body\"><div class=\"panel-group\"><div ng-repeat=\"(item, ridingCondition) in report.ridingConditions\" class=\"panel panel-default\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><strong>{{ ridingCondition.prompt }}</strong></h4></div><div class=\"panel-body\"><div class=\"form-group\"></div><div ng-if=\"ridingCondition.type==\'multiple\'\" ng-repeat=\"(option, enabled) in ridingCondition.options\" class=\"checkbox\"><label><input type=\"checkbox\" ng-model=\"report.ridingConditions[item].options[option]\"/>{{option}}</label></div><div ng-if=\"ridingCondition.type==\'single\'\" ng-repeat=\"option in ridingCondition.options\" class=\"radio\"><label><input type=\"radio\" ng-model=\"report.ridingConditions[item].selected\" ng-value=\"option\"/>{{option}}</label></div></div></div></div></div></div><div class=\"panel panel-default\"><div style=\"background-color: black; color: white;\" class=\"panel-heading\"><h4 class=\"panel-title\"><strong>Avalanche conditions</strong></h4></div><div class=\"panel-body\"><div class=\"form-group\"><div class=\"checkbox\"><label><input type=\"checkbox\" ng-model=\"report.avalancheConditions.slab\"/>Slab avalanches today or yesterday.</label></div><div class=\"checkbox\"><label><input type=\"checkbox\" ng-model=\"report.avalancheConditions.sound\"/>Whumphing or drum-like sounds or shooting cracks.</label></div><div class=\"checkbox\"><label><input type=\"checkbox\" ng-model=\"report.avalancheConditions.snow\"/>30cm + of new snow, or significant drifitng, or rain in the last 48 hours.</label></div><div class=\"checkbox\"><label><input type=\"checkbox\" ng-model=\"report.avalancheConditions.temp\"/>Rapid temperature rise to near zero degrees or wet surface snow.</label></div></div></div></div></div><div class=\"form-group\"><label>Comments</label><textarea rows=\"3\" ng-model=\"report.comment\" class=\"form-control\"></textarea></div><input type=\"submit\" id=\"submit\" value=\"Submit\" ng-disabled=\"minsubmitting\" style=\"border-radius:0; background-color: rgb(0, 86, 183); color: white;\" class=\"btn btn-default\"/><i ng-show=\"minsubmitting\" class=\"fa fa-fw fa-lg fa-spinner fa-spin\"></i></form><div ng-show=\"report.subid\"><div role=\"alert\" class=\"alert alert-success\">Your report was successfully submited.</div><div class=\"well\"><H4>Share this report:</H4><ul class=\"list-inline\"><li><a ng-href=\"https://twitter.com/intent/tweet?status={{report.shareUrl}}\"><i class=\"fa fa-twitter fa-fw fa-lg\"></i></a></li><li><a ng-href=\"https://www.facebook.com/sharer/sharer.php?u={{report.shareUrl}}\"><i class=\"fa fa-facebook fa-fw fa-lg\"></i></a></li><li><a ng-href=\"https://plus.google.com/share?url={{report.shareUrl}}\"><i class=\"fa fa-google-plus fa-fw fa-lg\"></i></a></li></ul></div></div><div ng-show=\"minerror\"><div role=\"alert\" class=\"alert alert-danger\"><p>There was an error submittting you report.</p><p>{{minerrormsg}}</p></div></div></div>");
$templateCache.put("min-report-modal.html","<div id=\"minForm\" role=\"dialog\" class=\"modal fade\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button data-dismiss=\"modal\" class=\"close\"><span>close</span></button><h4 class=\"modal-title\">Mountain Information Network Report</h4></div><div class=\"modal-body\"><div ac-min-report-form=\"ac-min-report-form\"></div></div></div></div></div>");
$templateCache.put("min-report-popup-modal.html","<div id=\"mobileMapPopup\" role=\"dialog\" class=\"modal fade\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-body\"></div>                <a href=\"#\" data-dismiss=\"modal\" style=\"position: absolute; right: 10px; top: 10px;\" class=\"pull-right\"><i class=\"fa fa-close fa-lg\"></i></a></div></div></div>");
$templateCache.put("social-share.html","<div class=\"well\"><H4>Share this report:</H4><ul class=\"list-inline\"><li><a href=\"https://twitter.com/intent/tweet?url=http://avalanche.ca\"><i class=\"fa fa-twitter fa-fw fa-lg\"></i></a></li><li><a href=\"https://www.facebook.com/sharer/sharer.php?u=http://avalanche.ca\"><i class=\"fa fa-facebook fa-fw fa-lg\"></i></a></li><li><a href=\"https://plus.google.com/share?url=http://avalanche.ca\"><i class=\"fa fa-google-plus fa-fw fa-lg\"></i></a></li></ul></div>");}]);
}());