angular.module('acMobile.controllers')
    .controller('ForecastsMapCtrl', function($scope, $timeout, acForecast, acObservation, regions, obs, $ionicModal, $ionicPopup, $ionicScrollDelegate, acMobileSocialShare) {
        angular.extend($scope, {
            current: {
                region: null
            },
            drawer: {
                visible: false
            },
            regions: regions,
            obs: obs,
            filters: {
                obsPeriod: '48-hours'
            }

        });

        var shareMessage = "Check out this Mountain Information Network Report: ";

        $scope.resize = function() {
            //ac-components is built using bootstrap which doesn't have a tap/click handler to elimninate the 300ms
            //click delay on mobile devices. So we have to let the 300ms delay expire and then resize to ensure the
            //content of the div is shown onscreen.
            $timeout(function() {
                $ionicScrollDelegate.resize();
            }, 310);
        };

        function linkHandler(event) {
            $timeout(function() {
                $scope.imgSrc = event.currentTarget.href;
                $scope.showImage = true;
            }, 0);
            event.preventDefault();
            return false;
        }

        $ionicModal.fromTemplateUrl('templates/ob-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.obModal = modal;
        });
        $scope.showObModal = function() {
            $scope.obModal.show();
            $timeout(function() {
                $("a").on('click', linkHandler);
            }, 0);
        };
        $scope.closeObModal = function() {
            $("a").off('click', linkHandler);
            $scope.obModal.hide();
        };

        $scope.showShare = function() {
            $scope.sharePopup = $ionicPopup.show({
                templateUrl: 'templates/post-share.html ',
                title: "Share observation",
                subTitle: "",
                scope: $scope
            });
            $scope.sharePopup.then(function(provider) {
                if (provider) {
                    acMobileSocialShare.share(provider, $scope.shareUrl, shareMessage, null);
                }
            });
        };

        function removeTags(text, tag) {
            var wrapped = $("<div>" + text + "</div>");
            wrapped.find(tag).remove();
            return wrapped.html();
        }

        $scope.showImage = false;
        $scope.clearImage = function() {
            $scope.showImage = false;
            $scope.imgSrc = '';
        };

        $scope.$on('ac.min.obclicked', function(e, html) {
            var obHtml = removeTags(html, 'style');
            var shareUrl = $(html).find('ul.ac-min-shares').data('ac-shareurl');
            obHtml = removeTags(obHtml, 'ul.ac-min-shares');
            obHtml = removeTags(obHtml, 'h5:last-of-type');
            $scope.obHtml = obHtml;
            $scope.shareUrl = shareUrl;
            $scope.showObModal();
        });

        $scope.$watch('current.region', function(newRegion, oldRegion) {
            if (newRegion && newRegion !== oldRegion) {
                //console.log(newRegion);
                $scope.drawer.visible = false;
                $scope.imageLoaded = false;

                if (!newRegion.feature.properties.forecast) {
                    acForecast.getOne(newRegion.feature.id).then(function(forecast) {
                        newRegion.feature.properties.forecast = forecast;
                    });
                }

                $timeout(function() {
                    $scope.drawer.visible = true;
                }, 800);
            }
        });

        $scope.toggleFilter = function(filter) {
            if (filter || !$scope.filters.obsPeriod) {
                filter = filter || 'obsPeriod:48-hours';
                var filterType = filter.split(':')[0];
                var filterValue = filter.split(':')[1];

                if (filterType === 'obsPeriod') {
                    $scope.filters[filterType] = filterValue;
                    var period = filterValue.replace('-', ':');
                    acObservation.byPeriod(period).then(function(obs) {
                        $scope.obs = obs;
                    });
                }
            } else {
                $scope.obs = [];
                $scope.filters.obsPeriod = '';
            }
        };

        $scope.$on('$destroy', function() {
            $scope.obModal.remove();
        });
    });