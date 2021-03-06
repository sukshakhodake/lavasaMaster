myApp.controller('GalleryPostCtrl', function ($scope, TemplateService, $http, NavigationService, configService, $stateParams, $timeout) {

  $scope.template = TemplateService.getHTML("content/gallerypost.html");
  TemplateService.title = "Gallery Post"; //This is the Title of the Website
  $scope.navigation = NavigationService.getNavigation();
  // CONFIG SET
  configService.getDetail(function (data) {
      $scope.state = data.state;
      $scope.year = data.year;
      $scope.eventYear = data.eventYear;
      $scope.sfaCity = data.sfaCity;
      $scope.isCollege = data.isCollege;
      $scope.type = data.type;
  });
  // CONFIG SET END
  // START OF CONTROLLER
  // FUNCTIONS
  // SET CONTENT HEIGHT
  $scope.$on('$viewContentLoaded', function(event){
    $timeout(function () {
      $scope.contentHeight = $('.gallerypost-media').height();
      console.log("het", $scope.contentHeight);
      $(".gallerypost-content").innerHeight($scope.contentHeight);
    }, 100);
  });
  // SET CONTENT HEIGHT END
  // FUNCTIONS END
  // DUMMY JSONS
  $scope.pic = {
    medialink: '',
    mediatype: 'photo',
    title: 'Hello',
    tags: ['1', '2']
  }
  $scope.pic = {
    // medialink: '252660722', //VIMEO
    medialink: 'iGh1aO1skNc', //YOUTUBE
    mediatype: 'video',
    thumbnail: '',
    // source: 'vimeo',
    source: 'youtube',
    mediatitle: 'Hello',
    tags: ['1', '2']
  }
  // DUMMY JSONS END
  // END OF CONTROLLER
});
