angular.module('acMobile.services')
    .service('gearData', function() {
        this.gearItems = [{
            icon: "img/icon_backpack.png",
            heading: "Avalanche Backpacks",
            desc: "<p>Avalanche airbags improve your odds of surviving an avalanche. Properly deployed, they can reduce the depth of burial or even keep you on the surface of an avalanche. Also, the big red bags make you more visible, increasing the ease and speed of rescue.</p>",
            link: "http://www.mec.ca/AST/ShopMEC/Snowsports/BackcountrySafety/AvalancheVests.jsp",
            linkText: "Shop avalanche backpacks at mec.ca"
        }, {
            icon: "img/icon_helmet.png",
            heading: "Helmets",
            desc: "<p>Trauma accounts for approximately 30% of all Canadian avalanche fatalities. Wearing a helmet will reduce your vulnerability to trauma. They're standard gear at ski areas and we're starting to see more in the backcountry. In our view, they're a good idea.</p>",
            link: "http://www.mec.ca/AST/ShopMEC/Snowsports/HelmetsKneepads.jsp",
            linkText: "Shop helmets at mec.ca"
        }, {
            icon: "img/icon_probe.png",
            heading: "Probes",
            desc: "<p>Probes vary in length, stiffness and material, which translate into differences in weight, durability and cost. Look for a durable locking mechanism and a cable that doesn't stretch. The shortest standard probes are 240cm, which work fine in drier climates. But if you ride in deeper snowpacks, consider buying a longer one.</p>",
            link: "http://www.mec.ca/AST/ShopMEC/Snowsports/BackcountrySafety/Probes.jsp",
            linkText: "Shop probes at mec.ca"
        }, {
            icon: "img/icon_shovel.png",
            heading: "Shovels",
            desc: "<p>We all like lightweight shovels, but don't sacrifice strength for weight. For efficient shovelling, look for an extendable shaft and a blade with a flat top, to provide a platform for your boot when digging in dense snow. And avoid plastic - it breaks in cold temperatures and hard avalanche debris.</p>",
            link: "http://www.mec.ca/AST/ShopMEC/Snowsports/BackcountrySafety/ShovelsSaws.jsp",
            linkText: "Shop shovels at mec.ca"
        }, {
            icon: "img/icon_transceiver.png",
            heading: "Transceivers",
            desc: "<p>Three-antennae digital transceivers with a visual display and audio speaker set the standard for ease of use, speed and accuracy. If this isn't what you use, then upgrade! But even the best transceiver won't work if you don't practice with it!</p>",
            link: "http://www.mec.ca/AST/ShopMEC/Snowsports/BackcountrySafety/Beacons.jsp",
            linkText: "Shop transceivers at mec.ca"
        }];

        this.gear = {
            "Avalanche Backpacks": {
                icon: "img/icon_backpack.png",
                heading: "Avalanche Backpacks",
                desc: "<p>Avalanche airbags improve your odds of surviving an avalanche. Properly deployed, they can reduce the depth of burial or even keep you on the surface of an avalanche. Also, the big red bags make you more visible, increasing the ease and speed of rescue.</p>",
                link: "http://www.mec.ca/AST/ShopMEC/Snowsports/BackcountrySafety/AvalancheVests.jsp",
                linkText: "Shop avalanche backpacks at mec.ca"
            },

            "Helmets": {
                icon: "img/icon_helmet.png",
                heading: "Helmets",
                desc: "<p>Trauma accounts for approximately 30% of all Canadian avalanche fatalities. Wearing a helmet will reduce your vulnerability to trauma. They're standard gear at ski areas and we're starting to see more in the backcountry. In our view, they're a good idea.</p>",
                link: "http://www.mec.ca/AST/ShopMEC/Snowsports/HelmetsKneepads.jsp",
                linkText: "Shop helmets at mec.ca"
            },
            "Probes": {
                icon: "img/icon_probe.png",
                heading: "Probes",
                desc: "<p>Probes vary in length, stiffness and material, which translate into differences in weight, durability and cost. Look for a durable locking mechanism and a cable that doesn't stretch. The shortest standard probes are 240cm, which work fine in drier climates. But if you ride in deeper snowpacks, consider buying a longer one.</p>",
                link: "http://www.mec.ca/AST/ShopMEC/Snowsports/BackcountrySafety/Probes.jsp",
                linkText: "Shop probes at mec.ca"
            },
            "Shovels": {
                icon: "img/icon_shovel.png",
                heading: "Shovels",
                desc: "<p>We all like lightweight shovels, but don't sacrifice strength for weight. For efficient shovelling, look for an extendable shaft and a blade with a flat top, to provide a platform for your boot when digging in dense snow. And avoid plastic - it breaks in cold temperatures and hard avalanche debris.</p>",
                link: "http://www.mec.ca/AST/ShopMEC/Snowsports/BackcountrySafety/ShovelsSaws.jsp",
                linkText: "Shop shovels at mec.ca"
            },
            "Transceivers": {
                icon: "img/icon_transceiver.png",
                heading: "Transceivers",
                desc: "<p>Three-antennae digital transceivers with a visual display and audio speaker set the standard for ease of use, speed and accuracy. If this isn't what you use, then upgrade! But even the best transceiver won't work if you don't practice with it!</p>",
                link: "http://www.mec.ca/AST/ShopMEC/Snowsports/BackcountrySafety/Beacons.jsp",
                linkText: "Shop transceivers at mec.ca"
            }
        };
    });
