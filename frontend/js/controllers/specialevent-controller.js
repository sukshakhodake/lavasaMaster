myApp.controller('SpecialEventCtrl', function ($scope, TemplateService, $state, NavigationService, $stateParams, toastr, $rootScope, $uibModal, $timeout) {
    $scope.template = TemplateService.getHTML("content/special-events.html");
    TemplateService.title = "Special Events"; //This is the Title of the Website
    $scope.navigation = NavigationService.getNavigation();

    // VARIABLE INITITALISE
    // VARIABLE INITITALISE END

    // FUNCTIONS
    // INITIALSE EVENT COLOR CLASS
    $scope.initialiseColor = function(){
      _.each($scope.events, function(n){
        _.each(n.dates, function(m){
          m.colorClass = "";
          color = m.color.toLowerCase();
          switch (color) {
            case "yellow":
              m.colorClass = "eventcard-yellow";
            break;
            case "blue":
              m.colorClass = "eventcard-blue";
            break;
            case "green":
              m.colorClass = "eventcard-green";
            break;
          }
        });
      });
    }
    $scope.initialiseColor();
    // INITIALSE EVENT COLOR CLASS END
    // $scope.$on('$viewContentLoaded', function (event){
    //   $timeout(function () {
    //     $('.grid').masonry({
    //       // options
    //       itemSelector: '.grid-item',
    //     });
    //   }, 300);
    // });
    // FUNCTIONS END

    // JSONS
    $scope.events = [{
      name: 'December 2017',
      dates: [{
        eventDate: ' 6',
        day: 'Wednesday',
        color: 'yellow',
        colorClass: "eventcard-blue",
        format: 'card2',
        section1: {
          type: 'text',
          text:{
            header: 'welcome to sfa mumbai 2017',
            content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
          }
        }
      },{
        eventDate: ' 6',
        day: 'Wednesday',
        color: 'yellow',
        colorClass: "eventcard-green",
        format: 'card3',
        section1: {
          type: 'image',
          image:{
            header: 'welcome to sfa mumbai 2017',
            name: 'img/sl1.jpg'
          }
        },
        section2: {
          type: 'text',
          text:{
            header: 'welcome to sfa mumbai 2017',
            content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
          }
        }
      },{
        eventDate: ' 6',
        day: 'Wednesday',
        color: 'yellow',
        colorClass: "eventcard-yellow",
        format: 'card4',
        section1: {
          type: 'image',
          image:{
            header: 'welcome to sfa mumbai 2017',
            name: 'img/dishapatani1.jpg'
          }
        },
        section2: {
          type: 'text',
          text:{
            header: 'welcome to sfa mumbai 2017',
            content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
          }
        },
        section3: {
          type: 'image',
          image:{
            header: 'welcome to sfa mumbai 2017',
            name: 'img/dishapatani1.jpg'
          }
        }
      }]
    }];
    // JSONS END

  //
})