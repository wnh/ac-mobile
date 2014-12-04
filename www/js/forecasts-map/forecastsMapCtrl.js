angular.module('acMobile.controllers')
    .controller('ForecastsMapCtrl', function($scope, $timeout, acForecast, forecasts, obs, $ionicModal, $ionicScrollDelegate) {
        angular.extend($scope, {
            current: {},
            drawer: {
                visible: false
            },
            regions: forecasts,
            obs: obs
        });

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
            $scope.obHtml = obHtml;
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
    });