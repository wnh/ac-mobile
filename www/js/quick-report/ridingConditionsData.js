angular.module('acMobile.services')
    .service('ridingConditionsData', function() {
        this.ridingQuality = {
            "prompt": "Riding quality was:",
            "options": ["Amazing", "Good", "OK", "Terrible"],
            "selected": ""
        };

        this.snowConditions = {
            "prompt": "Snow conditions were:",
            "options": {
                "Crusty": false,
                "Powder": false,
                "Deep powder": false,
                "Wet": false,
                "Heavy": false,
                "Wind affected": false,
                "Hard": false
            }
        };

        this.rideType = {
            "prompt": "We rode:",
            "options": {
                "Mellow slopes": false,
                "Steep slopes": false,
                "Convex slopes": false,
                "Sunny slopes": false,
                "Cut-blocks": false,
                "Open trees": false,
                "Dense trees": false,
                "Alpine slopes": false
            }
        };

        this.stayedAway = {
            "prompt": "We stayed away from:",
            "options": {
                "Steep slopes": false,
                "Convex slopes": false,
                "Sunny slopes": false,
                "Cut-blocks": false,
                "Open trees": false,
                "Alpine slopes": false
            }
        };

        this.weather = {
            "prompt": "The day was:",
            "options": {
                "Stormy": false,
                "Windy": false,
                "Sunny": false,
                "Cold": false,
                "Warm": false,
                "Cloudy": false,
                "Foggy": false,
                "Wet": false
            }
        };
    });
