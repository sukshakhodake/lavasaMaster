var year15 = '2015-16';
var year16 = '2016-17';
var year17 = '2017-18';
var year18 = '2018-19';
var eventYear = '2018-19';

// For Test ALL CITY WISE LINK FOR SCHOOL COLLEGE OVERALL

var serverType = 'test';
var globalLinkSchoolRegister = "http://testmumbaischool.sfanow.in";
var globalLinkCollegeRegister = "http://testmumbaicollege.sfanow.in";
var globalLinkForAll = "http://testmumbai.sfanow.in/";

// var globalLinkSchoolRegister = "http://testhyderabadschool.sfanow.in";
// var globalLinkCollegeRegister = "http://testhyderabadcollege.sfanow.in";
// var globalLinkForAll = "http://testhyderabad.sfanow.in/";
// var globalLinkSchoolRegister = "http://testahmedabadschool.sfanow.in";
// var globalLinkCollegeRegister = "http://testahmedabadcollege.sfanow.in";
// var globalLinkForAll = "http://testahmedabad.sfanow.in/";

// For Test ALL CITY WISE LINK FOR SCHOOL COLLEGE OVERALL END


//For Live ALL CITY WISE LINK FOR SCHOOL COLLEGE OVERALL

// var serverType = 'live';
// var globalLinkSchoolRegister = "https://mumbaischool.sfanow.in";
// var globalLinkCollegeRegister = "http://mumbaicollege.sfanow.in";
// var globalLinkForAll = "https://mumbai.sfanow.in/";

// var globalLinkSchoolRegister = "http://mumbaischool.sfanow.in/2017";
// var globalLinkCollegeRegister = "http://mumbaicollege.sfanow.in";
// var globalLinkForAll = "https://mumbai.sfanow.in/";
// var globalLinkSchoolRegister = "http://hyderabadschool.sfanow.in";
// var globalLinkCollegeRegister = "http://hyderabadcollege.sfanow.in";
// var globalLinkForAll = "https://hyderabad.sfanow.in/";

//For Live ALL CITY WISE LINK FOR SCHOOL COLLEGE OVERALL END


myApp.controller('headerCtrl', function ($scope, TemplateService, $rootScope, NavigationService, errorService, toastr, configService) {
    $scope.template = TemplateService;
    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $(window).scrollTop(0);
    });
    $.fancybox.close(true);
    $scope.variables = {};
    $scope.$watch('online', function (newStatus) {
        $scope.variables.online = $rootScope.online;
    });

    $rootScope.year15 = year15;
    $rootScope.year16 = year16;
    if (globalLinkForAll == 'https://mumbai.sfanow.in/') {
        $scope.selectedCity = 'mumbai';
    } else if (globalLinkForAll == 'https://hyderabad.sfanow.in/') {
        $scope.selectedCity = 'hyderabad';
    } else if (globalLinkForAll == 'https://ahmedabad.sfanow.in/') {
        $scope.selectedCity = 'ahmedabad';
    } else if (globalLinkForAll == 'http://testmumbai.sfanow.in/') {
        $scope.selectedCity = 'mumbai';
    } else if (globalLinkForAll == 'http://testhyderabad.sfanow.in/') {
        $scope.selectedCity = 'hyderabad';
    } else if (globalLinkForAll == 'http://testahmedabad.sfanow.in/') {
        $scope.selectedCity = 'ahmedabad';
    }

    if (serverType == 'test') {
        $scope.changeUrl = function (selectedCity) {
            var sublink = '';
            // console.log(selectedCity);
            switch (selectedCity) {
                case 'mumbai':
                    $scope.selectedCity = 'mumbai';
                    if (window.location.pathname == '/') {
                        if (window.location.href == 'http://testhyderabadschool.sfanow.in') {
                            sublink = "http://testmumbaischool.sfanow.in";
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://testhyderabadcollege.sfanow.in') {
                            sublink = "http://testmumbaicollege.sfanow.in";
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://testahmedabadschool.sfanow.in') {
                            sublink = "http://testmumbaischool.sfanow.in";
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://testahmedabadcollege.sfanow.in') {
                            sublink = "http://testmumbaicollege.sfanow.in";
                            window.open(sublink, '_self');
                        }
                    } else {
                        if (window.location.href == 'http://testhyderabadschool.sfanow.in' + window.location.pathname) {
                            sublink = "http://testmumbaischool.sfanow.in" + window.location.pathname;
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://testhyderabadcollege.sfanow.in' + window.location.pathname) {
                            sublink = "http://testmumbaicollege.sfanow.in" + window.location.pathname;
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://testahmedabadschool.sfanow.in' + window.location.pathname) {
                            sublink = "http://testmumbaischool.sfanow.in" + window.location.pathname;
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://testahmedabadcollege.sfanow.in' + window.location.pathname) {
                            sublink = "http://testmumbaicollege.sfanow.in" + window.location.pathname;
                            window.open(sublink, '_self');
                        }
                    }
                    break;
                case 'hyderabad':
                    $scope.selectedCity = 'hyderabad';
                    if (window.location.pathname == '/') {
                        if (window.location.href == 'http://testmumbaischool.sfanow.in') {
                            sublink = "http://testhyderabadschool.sfanow.in";
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://testmumbaicollege.sfanow.in') {
                            sublink = "http://testhyderabadcollege.sfanow.in";
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://testahmedabadschool.sfanow.in') {
                            sublink = "http://testhyderabadschool.sfanow.in";
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://testahmedabadcollege.sfanow.in') {
                            sublink = "http://testhyderabadcollege.sfanow.in";
                            window.open(sublink, '_self');
                        }
                    } else {
                        if (window.location.href == 'http://testmumbaischool.sfanow.in' + window.location.pathname) {
                            sublink = "http://testhyderabadschool.sfanow.in" + window.location.pathname;
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://testmumbaicollege.sfanow.in' + window.location.pathname) {
                            sublink = "http://testhyderabadcollege.sfanow.in" + window.location.pathname;
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://testahmedabadschool.sfanow.in' + window.location.pathname) {
                            sublink = "http://testhyderabadschool.sfanow.in" + window.location.pathname;
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://testahmedabadcollege.sfanow.in' + window.location.pathname) {
                            sublink = "http://testhyderabadcollege.sfanow.in" + window.location.pathname;
                            window.open(sublink, '_self');
                        }
                    }
                    break;
                case 'ahmedabad':
                    $scope.selectedCity = 'ahmedabad';
                    if (window.location.pathname == '/') {
                        if (window.location.href == 'http://testhyderabadschool.sfanow.in') {
                            sublink = "http://testahmedabadschool.sfanow.in";
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://testhyderabadcollege.sfanow.in') {
                            sublink = "http://testahmedabadcollege.sfanow.in";
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://testmumbaischool.sfanow.in') {
                            sublink = "http://testahmedabadschool.sfanow.in";
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://testmumbaicollege.sfanow.in') {
                            sublink = "http://testahmedabadcollege.sfanow.in";
                            window.open(sublink, '_self');
                        }
                    } else {
                        if (window.location.href == 'http://testhyderabadschool.sfanow.in' + window.location.pathname) {
                            sublink = "http://testahmedabadschool.sfanow.in" + window.location.pathname;
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://testhyderabadcollege.sfanow.in' + window.location.pathname) {
                            sublink = "http://testahmedabadcollege.sfanow.in" + window.location.pathname;
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://testmumbaischool.sfanow.in' + window.location.pathname) {
                            sublink = "http://testahmedabadschool.sfanow.in" + window.location.pathname;
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://testmumbaicollege.sfanow.in' + window.location.pathname) {
                            sublink = "http://testahmedabadcollege.sfanow.in" + window.location.pathname;
                            window.open(sublink, '_self');
                        }
                    }
                    break;
                default:
                    break;
            }
        };
    } else {
        $scope.changeUrl = function (selectedCity) {
            var sublink = '';
            // console.log(selectedCity);
            switch (selectedCity) {
                case 'mumbai':
                    $scope.selectedCity = 'mumbai';
                    if (window.location.pathname == '/') {
                        if (window.location.href == 'http://hyderabadschool.sfanow.in') {
                            sublink = "https://mumbaischool.sfanow.in";
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://hyderabadcollege.sfanow.in') {
                            sublink = "http://mumbaicollege.sfanow.in";
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://ahmedabadschool.sfanow.in') {
                            sublink = "https://mumbaischool.sfanow.in";
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://ahmedabadcollege.sfanow.in') {
                            sublink = "http://mumbaicollege.sfanow.in";
                            window.open(sublink, '_self');
                        }
                    } else {
                        if (window.location.href == 'http://hyderabadschool.sfanow.in' + window.location.pathname) {
                            sublink = "https://mumbaischool.sfanow.in/championship";
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://hyderabadcollege.sfanow.in' + window.location.pathname) {
                            sublink = "http://mumbaicollege.sfanow.in/championship";
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://ahmedabadschool.sfanow.in' + window.location.pathname) {
                            sublink = "https://mumbaischool.sfanow.in/championship";
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://ahmedabadcollege.sfanow.in' + window.location.pathname) {
                            sublink = "http://mumbaicollege.sfanow.in/championship";
                            window.open(sublink, '_self');
                        }
                    }
                    break;
                case 'hyderabad':
                    $scope.selectedCity = 'hyderabad';
                    if (window.location.pathname == '/') {
                        if (window.location.href == 'https://mumbaischool.sfanow.in') {
                            sublink = "http://hyderabadschool.sfanow.in";
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://mumbaicollege.sfanow.in') {
                            sublink = "http://hyderabadcollege.sfanow.in";
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://ahmedabadschool.sfanow.in') {
                            sublink = "http://hyderabadschool.sfanow.in";
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://ahmedabadcollege.sfanow.in') {
                            sublink = "http://hyderabadcollege.sfanow.in";
                            window.open(sublink, '_self');
                        }
                    } else {
                        if (window.location.href == 'https://mumbaischool.sfanow.in' + window.location.pathname) {
                            sublink = "http://hyderabadschool.sfanow.in/championship";
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://mumbaicollege.sfanow.in' + window.location.pathname) {
                            sublink = "http://hyderabadcollege.sfanow.in/championship";
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://ahmedabadschool.sfanow.in' + window.location.pathname) {
                            sublink = "http://hyderabadschool.sfanow.in/championship";
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://ahmedabadcollege.sfanow.in' + window.location.pathname) {
                            sublink = "http://hyderabadcollege.sfanow.in/championship";
                            window.open(sublink, '_self');
                        }
                    }
                    break;
                case 'ahmedabad':
                    $scope.selectedCity = 'ahmedabad';
                    if (window.location.pathname == '/') {
                        if (window.location.href == 'http://hyderabadschool.sfanow.in') {
                            sublink = "http://ahmedabadschool.sfanow.in";
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://hyderabadcollege.sfanow.in') {
                            sublink = "http://ahmedabadcollege.sfanow.in";
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'https://mumbaischool.sfanow.in') {
                            sublink = "http://ahmedabadschool.sfanow.in";
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://mumbaicollege.sfanow.in') {
                            sublink = "http://ahmedabadcollege.sfanow.in";
                            window.open(sublink, '_self');
                        }
                    } else {
                        if (window.location.href == 'http://hyderabadschool.sfanow.in' + window.location.pathname) {
                            sublink = "http://ahmedabadschool.sfanow.in/championship";
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://hyderabadcollege.sfanow.in' + window.location.pathname) {
                            sublink = "http://ahmedabadcollege.sfanow.in/championship";
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'https://mumbaischool.sfanow.in' + window.location.pathname) {
                            sublink = "http://ahmedabadschool.sfanow.in/championship";
                            window.open(sublink, '_self');
                        } else if (window.location.href == 'http://mumbaicollege.sfanow.in' + window.location.pathname) {
                            sublink = "http://ahmedabadcollege.sfanow.in/championship";
                            window.open(sublink, '_self');
                        }
                    }
                    break;
                default:
                    break;
            }
        };
    }

    if (window.location.host == "testmumbaischool.sfanow.in" || window.location.host == "testmumbaicollege.sfanow.in") {
        $scope.selectedCity = 'mumbai';
    } else if (window.location.host == "testhyderabadschool.sfanow.in" || window.location.host == "testhyderabadcollege.sfanow.in") {
        $scope.selectedCity = 'hyderabad';
    } else if (window.location.host == "testahmedabadschool.sfanow.in" || window.location.host == "testahmedabadcollege.sfanow.in") {
        $scope.selectedCity = 'ahmedabad';
    } else if (window.location.host == "mumbaischool.sfanow.in" || window.location.host == "mumbaicollege.sfanow.in") {
        $scope.selectedCity = 'mumbai';
    } else if (window.location.host == "hyderabadschool.sfanow.in" || window.location.host == "hyderabadcollege.sfanow.in") {
        $scope.selectedCity = 'hyderabad';
    } else if (window.location.host == "ahmedabadschool.sfanow.in" || window.location.host == "ahmedabadcollege.sfanow.in") {
        $scope.selectedCity = 'ahmedabad';
    }

    if (window.location.origin != globalLinkSchoolRegister) {
        $scope.registerSchool = globalLinkSchoolRegister;
    } else if (window.location.origin != globalLinkCollegeRegister) {
        $scope.registerCollege = globalLinkCollegeRegister;
    }
    $scope.specialLink = globalLinkSchoolRegister;
    $scope.linkForAll = globalLinkForAll;
    $scope.linkForAllSports = globalLinkForAll + "sport/";
    $scope.eventYear = eventYear;
    NavigationService.updateUserDetailsJstorage();

    //CONFIG PROPERTY
    // configService.getDetail(function (data) {
    //     $scope.year = data.year;
    // });
    //CONFIG PROPERTY END

    //MAKE DYNAMIC DEPENDING ON YEAR
    // if ($scope.year) {
    //     $scope.heads = [];
    //     while ($scope.year >= '2017') {
    //         if ($scope.year == '2017') {
    //             $scope.heads.push({
    //                 athlete: $scope.year + ' ATHLETES',
    //                 school: $scope.year + ' SCHOOLS',
    //                 team: $scope.year + ' TEAMS'
    //             });
    //             $scope.year = '2016';
    //             console.log('YEAR', $scope.heads);
    //         } else {
    //             if ($scope.year >= '2017') {
    //                 $scope.heads.push({
    //                     athlete: $scope.year + ' ATHLETES',
    //                     school: $scope.year + ' SCHOOLS',
    //                     team: $scope.year + ' TEAMS'
    //                 });
    //                 --$scope.year;
    //                 console.log('YEAR MANY', $scope.heads);
    //             }
    //         }
    //     }
    // }
    //MAKE DYNAMIC DEPENDING ON YEAR END

});

myApp.controller('footerctrl', function ($scope, TemplateService, $rootScope, NavigationService, errorService, toastr, $state, $uibModal) {
    $scope.template = TemplateService;
    $rootScope.year15 = year15;
    $rootScope.year16 = year16;
    if (window.location.host == "testmumbaischool.sfanow.in" || window.location.host == "testmumbaicollege.sfanow.in") {
        $scope.selectedCity = 'mumbai';
    } else if (window.location.host == "testhyderabadschool.sfanow.in" || window.location.host == "testhyderabadcollege.sfanow.in") {
        $scope.selectedCity = 'hyderabad';
    } else if (window.location.host == "testahmedabadschool.sfanow.in" || window.location.host == "testahmedabadcollege.sfanow.in") {
        $scope.selectedCity = 'ahmedabad';
    } else if (window.location.host == "mumbaischool.sfanow.in" || window.location.host == "mumbaicollege.sfanow.in") {
        $scope.selectedCity = 'mumbai';
    } else if (window.location.host == "hyderabadschool.sfanow.in" || window.location.host == "hyderabadcollege.sfanow.in") {
        $scope.selectedCity = 'hyderabad';
    } else if (window.location.host == "ahmedabadschool.sfanow.in" || window.location.host == "ahmedabadcollege.sfanow.in") {
        $scope.selectedCity = 'ahmedabad';
    } else {
        $scope.selectedCity = 'mumbai';
    }

    if (window.location.origin != globalLinkSchoolRegister) {
        $scope.registerSchool = globalLinkSchoolRegister;
    } else if (window.location.origin != globalLinkCollegeRegister) {
        $scope.registerCollege = globalLinkCollegeRegister;
    }

    if ($state.current.name == 'sponsors-partner' || $state.current.name == 'individual-sponsor') {
        $scope.hideFooter = false;
    } else {
        $scope.hideFooter = true;
    }
    $scope.linkForAll = globalLinkForAll;
    $scope.linkForAllSports = globalLinkForAll + "sport/";
    $scope.eventYear = eventYear;

    $scope.getSponsor = function () {
        NavigationService.getSponsor(function (data) {
            $scope.sponsorData = data.data.data;
            console.log($scope.sponsorData, "console")
        });
    };
    $scope.getSponsor();

    $scope.goSponsor = function (data) {
        // console.log(data)
        if (data.insidePage === "true") {
            $state.go('individual-sponsor', {
                id: data._id
            })
        } else {
            // console.log("nothing")
        }
    };

    $scope.games = // JavaScript Document
        [
            //     {
            //     "img": "img/footer/n1.jpg",
            //     "href": "http://madeofgreat.tatamotors.com/tiago/",
            //     "game": "Fantastico Partner"
            // }, 
            {
                "img": "img/footer/p4.jpg",
                "href": "",
                "game": "Energy Drink Partner"
            }, {
                "img": "img/footer/n2.jpg",
                "href": "",
                "game": "Smartphone Partner"
            }, {
                "img": "img/footer/n9.png",
                "href": "",
                "game": "Radio Partner"
            }, {
                "img": "img/footer/n11.png",
                "href": "",
                "game": "Health & Togetherness Partner"
            }
        ];
    $scope.partner = // JavaScript Document
        [{
            "img": "img/footer/p1.jpg",
            "href": "",
            "game": "Venue Partner"
        }, {
            "img": "img/footer/p6.jpg",
            "href": "",
            "game": "Hospital Partner"
        }, {
            "img": "img/footer/n10.png",
            "href": "",
            "game": "Digital Parenting Partner"
        }, {
            "img": "img/footer/n12.png",
            "href": "",
            "game": "Sports Development Partner"
        }, {
            "img": "img/footer/n13.png",
            "href": "",
            "game": "Goodwill Partner"
        }, {
            "img": "img/footer/n14.png",
            "href": "",
            "game": "Online Promotional Partner"
        }];


    //  {
    //             "img": "img/footer/na1.jpg",
    //             "href": "",
    //             "game": "Sports Equipment Partner"
    //         }, {
    //             "img": "img/footer/na2.jpg",
    //             "href": "",
    //             "game": "Apparel Partner"
    //         },
    // {
    //     "img": "img/footer/na3.jpg",
    //     "href": "",
    //     "game": "Sports Surface Partner"
    // }, {
    //     "img": "img/footer/na6.jpg",
    //     "href": "",
    //     "game": "Sports Mentorship Partner"
    // }, {
    //     "img": "img/footer/na4.jpg",
    //     "href": "",
    //     "game": "Shooting Range Partner"
    // }, {
    //     "img": "img/footer/p5.jpg",
    //     "href": "",
    //     "game": "Medical Partner"
    // }, {
    //     "img": "img/footer/na5.jpg",
    //     "href": "",
    //     "game": "Event Partner"
    // }

    //  {
    //     "img": "img/footer/p7.jpg",
    //     "href": "",
    //     "game": "Media Partner "
    // }, {
    //     "img": "img/footer/n4.jpg",
    //     "href": "https://www.facebook.com/sportsillustratedindia/",
    //     "game": "Magazine Partner"
    // }
    $scope.supportedBy = [{
        "img": "img/footer/hyd/government.png",
        "href": "",
        "game": "Government of Telangana"
    }, {
        "img": "img/footer/hyd/authority.png",
        "href": "",
        "game": "Under the aegis of SATS"
    }];
    $scope.sponsor_partner = [{
        "img": "img/footer/hyd/enerzal.png",
        "href": "",
        "game": "Energy Drink Partner"
    }, {
        "img": "img/footer/hyd/fever.png",
        "href": "",
        "game": "Radio Partner"
    }, {
        "img": "img/footer/hyd/tv5.png",
        "href": "",
        "game": "News Channel Partner"
    }, {
        "img": "img/footer/hyd/ibrand.png",
        "href": "",
        "game": "Marketing & Strategy Partner"
    }, {
        "img": "img/footer/hyd/wizcraft.png",
        "href": "",
        "game": "Event Partner"
    }, {
        "img": "img/footer/n12.png",
        "href": "",
        "game": "Sports Development Partner"
    }];
    // TV Support Partner

    // FOOTER SPORTS MUMBAI
    $scope.hyderabadFooter = [{
        name: 'archery'
    }, {
        name: 'athletics'
    }, {
        name: 'badminton'
    }, {
        name: 'basketball'
    }, {
        name: 'boxing'
    }, {
        name: 'carrom'
    }, {
        name: 'chess'
    }, {
        name: 'fencing'
    }, {
        name: 'football'
    }, {
        name: 'handball'
    }, {
        name: 'hockey'
    }, {
        name: 'judo'
    }, {
        name: 'kabaddi'
    }, {
        name: 'karate'
    }, {
        name: 'kho Kho'
    }, {
        name: 'shooting'
    }, {
        name: 'swimming'
    }, {
        name: 'table Tennis'
    }, {
        name: 'taekwondo'
    }, {
        name: 'tennis'
    }, {
        name: 'throwball'
    }, {
        name: 'volleyball'
    }, {
        name: 'water Polo'
    }]

    $scope.mumbaiFooter = [{
        name: 'archery'
    }, {
        name: 'athletics'
    }, {
        name: 'badminton'
    }, {
        name: 'basketball'
    }, {
        name: 'boxing'
    }, {
        name: 'carrom'
    }, {
        name: 'chess'
    }, {
        name: 'fencing'
    }, {
        name: 'football'
    }, {
        name: 'handball'
    }, {
        name: 'hockey'
    }, {
        name: 'judo'
    }, {
        name: 'kabaddi'
    }, {
        name: 'karate'
    }, {
        name: 'kho Kho'
    }, {
        name: 'sport MMA'
    }, {
        name: 'shooting'
    }, {
        name: 'squash'
    }, {
        name: 'swimming'
    }, {
        name: 'table Tennis'
    }, {
        name: 'taekwondo'
    }, {
        name: 'tennis'
    }, {
        name: 'throwball'
    }, {
        name: 'volleyball'
    }, {
        name: 'water Polo'
    }, {
        name: 'wrestling'
    }]
    // FOOTER SPORTS END


    // CHAMPIONS JOSN
    $scope.mumbaiChampion = [{
        name: 'school championship',
        // mainLink: 'http://mumbaischool.sfanow.in',
        champDetail: [{
                name: 'about championship',
                link: 'aboutchampionship'
            },
            //  {
            //     name: 'live updates',
            //     link: 'liveupdates',
            //     live: 'true'
            // }, {
            //     name: 'live scores',
            //     link: 'livescore',
            //     score: 'live'
            // }, 
            // {
            //     name: 'register',
            //     link: 'register'
            // },
            // {
            //     name: 'championship schedule',
            //     link: 'championship-schedule'
            // }, {
            //     name: 'draws schedule',
            //     link: 'draws-schedule'
            // },
            {
                name: 'Register As a player',
                link: 'register/player'
            },
            {
                name: 'Register As a school',
                link: 'register/school'
            },
            {
                name: 'faqs',
                link: 'faq'
            }
        ]
    }, {
        name: 'college championship',
        // mainLink: 'http://mumbaicollege.sfanow.in',
        champDetail: [{
            name: 'register',
            link: 'register'
        }, {
            name: 'championship schedule',
            link: 'championship-schedule'
        }, {
            name: 'draws schedule',
            link: 'draws-schedule'
        }, {
            name: 'faqs',
            link: 'faq'
        }]
    }];
    // CHAMPIONS JOSN END

    // CHAMPIONS JOSN
    $scope.hyderabadChampion = [{
        name: 'school championship',
        champDetail: [{
            name: 'about championship',
            link: 'championship'
        }, {
            name: 'register',
            link: 'register'
        }, {
            name: 'championship schedule',
            link: 'championship-schedule'
        }, {
            name: 'draws schedule',
            link: 'draws-schedule'
        }, {
            name: 'special event',
            link: 'specialevents'
        }, {
            name: 'faqs',
            link: 'faq'
        }]
    }]
    // CHAMPIONS JOSN END

    // MUMBAI PROFILE
    $scope.sfamumbaiProfile = [{
        name: 'school',
        school: true,
        detail: [{
            name: '2018 Athlete',
            link: 'students'
        }, {
            name: '2018 school',
            link: 'school'
        }, {
            name: '2018 teams',
            link: 'team'
        }]
    }]

    $scope.profileCollege = [{
        name: 'college',
        // mainLink: 'http://mumbaicollege.sfanow.in',
        detail: [{
            name: '2018 Athlete',
            link: 'students'
        }, {
            name: '2018 college',
            link: 'school'
        }, {
            name: '2018 teams',
            link: 'team'
        }]
    }]
    // MUMBAI PROFILE END

    // MUMBAI PROFILE
    $scope.hyderabadProfile = [{
        name: 'athletes',
        link: 'students'
    }, {
        name: 'school',
        link: 'school'
    }, {
        name: 'teams',
        link: 'team'
    }]
    // MUMBAI PROFILE END
});