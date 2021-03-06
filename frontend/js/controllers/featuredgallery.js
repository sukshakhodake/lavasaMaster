myApp.controller('featuredGalleryCtrl', function ($scope, TemplateService, toastr, NavigationService, $state, errorService, $stateParams, configService, $timeout, MediaPopupService) {
  //Used to name the .html file

  $scope.template = TemplateService.getHTML("content/featured-gallery.html");
  TemplateService.title = "SFA Gallery";
  $scope.navigation = NavigationService.getNavigation();

  //config property
  configService.getDetail(function (data) {
    $scope.state = data.state;
    $scope.year = data.year;
    $scope.eventYear = data.eventYear;
    $scope.sfaCity = data.sfaCity;
    $scope.isCollege = data.isCollege;
    $scope.type = data.type;

  });
  //

  // VARIABLE INITIALISE
  $scope.mediaType = $stateParams.mediaType;
  $scope.showFolderFilter = false;
  $scope.defaultFolder = $stateParams.name;
  $scope.selectedType = $stateParams.type;
  $scope.selectfolder = '';
  $scope.allphotosbyfolder = {};
  // VARIABLE INITIALISE END
  // PHOTO VIDEO POPUP FUNCTION
  var photoPopUp;
  $scope.showPopup = function (picIndex, picList) {
    MediaPopupService.openMediaPopup(picIndex, picList, $scope);
  }
  $scope.nextSlides = function (currentindex, click) {

    MediaPopupService.nextSlide(currentindex, $scope.allphotosbyfolder, $scope, click);
  }
  $scope.prevSlides = function (currentindex, click) {

    MediaPopupService.prevSlide(currentindex, $scope.allphotosbyfolder, $scope, click);
  }
  // PHOTO VIDEO POPUP FUNCTION END
  // FUNCTIONS
  // SELECT PHOTO FOLDER
  $scope.viewFolder = function () {
    if ($stateParams.mediaType == 'video') {
      $state.go('featuredvideogallery', {
        type: $stateParams.type,
        name: $scope.defaultFolder
      });
    } else if ($stateParams.mediaType == 'photo') {
      $state.go('featuredgallery', {
        type: $stateParams.type,
        name: $scope.defaultFolder
      });
    }
    if ($scope.showFolderFilter == false) {
      $scope.showFolderFilter = true;
    } else {
      $scope.showFolderFilter = false;
    }
  };

  $scope.selectFolder = function (folder) {
    if ($scope.selectFolder == 'all') {
      $scope.selectfolder = '';
    } else {
      $scope.selectfolder = folder._id;
    }
    $scope.defaultFolder = folder._id;
    $scope.viewFolder();
  };
  // END PHOTO FOLDER END
  // SHOW VIDEO FOLDER
  console.log(" $scope.mediaType", $scope.mediaType);
  console.log("$scope.defaultFolder", $scope.defaultFolder);
  $scope.viewVideoFolder = function () {
    $state.go('featuredvideogallery', {
      mediaType: $scope.mediaType,
      name: $scope.defaultFolder
    });
    if ($scope.showFolderFilter == false) {
      $scope.showFolderFilter = true;
    } else {
      $scope.showFolderFilter = false;
    }
  }
  // SHOW VIDEO FOLDER END
  // GENDER
  $scope.showGenderFilter = false;
  $scope.defaultGender = 'all';
  $scope.selectgender = '';
  $scope.viewGender = function () {
    if ($scope.showGenderFilter == false) {
      $scope.showGenderFilter = true;
    } else {
      $scope.showGenderFilter = false;
    }
  }

  $scope.selectGender = function (gender) {
    if ($scope.selectGender == 'all') {
      $scope.selectgender = '';
    } else {
      $scope.selectgender = gender;
    }
    $scope.defaultGender = gender;
    $scope.viewGender();
  }
  $scope.genderItem = ['Boys', 'Girls', 'Boys & Girls']
  // GENDER END

  // SPORTS
  $scope.showSportFilter = false;
  $scope.defaultSport = 'all';
  $scope.selectsport = '';
  $scope.viewSport = function () {
    if ($scope.showSportFilter == false) {
      $scope.showSportFilter = true;
    } else {
      $scope.showSportFilter = false
    }
  }

  $scope.selectSport = function (sport) {
    if ($scope.selectSport == 'all') {
      $scope.selectsport = '';
    } else {
      $scope.selectsport = sport;
    }
    $scope.defaultSport = sport;
    $scope.viewSport();
  }
  // SPORTS END
  // FUNCTIONS END

  // API CALLS
  if ($stateParams.mediaType == 'photo') {
    if ($stateParams.type && $stateParams.name) {
      $scope.filterObj = {};
      $scope.filterObj.folderType = $stateParams.type;
      $scope.filterObj.folderName = $stateParams.name;
      NavigationService.getAllPhotosByFolder($scope.filterObj, function (data) {
        if (data) {
          errorService.errorCode(data, function (allData) {
            if (!allData.message) {
              if (allData.value === true) {
                if (allData.data.length > 0) {
                  $scope.allphotosbyfolder = allData.data;
                } else {
                  toastr.error('No Photos Found', 'Error Message');
                  $state.go('eventgallery');
                }

              } else {
              }
            } else {
              toastr.error(allData.message, 'Error Message');
            }
          });
        }
      });
    }

    if ($stateParams.type) {
      $scope.typefilter = {};
      $scope.typefilter.folderType = $stateParams.type;
      NavigationService.getAllPhotosByType($scope.typefilter, function (data) {
        errorService.errorCode(data, function (allData) {
          if (!allData.message) {
            if (allData.value === true) {
              $scope.allfolderName = allData.data;
            } else {
              console.log("im in else");
            }
          } else {
            toastr.error(allData.message, 'Error Message');
          }
        });
      });
    }
  } else if ($stateParams.mediaType == 'video') {
    $scope.constraints = {};
    $scope.constraints.folder = $stateParams.name;
    NavigationService.getAllVideosByFolder($scope.constraints, function (data) {
      errorService.errorCode(data, function (allData) {
        if (!allData.message) {
          if (allData.value === true) {
            if (allData.data.length > 0) {
              $scope.allphotosbyfolder = allData.data;
              _.each($scope.allphotosbyfolder, function (key) {
                if (key.thumbnails != undefined) {
                  if (key.thumbnails.length === 0) {
                    key.thumbnail = 'img/media-video-thumb.jpg';
                  } else {
                    key.thumbnail = key.thumbnails[3].link;
                  }
                } else {
                  key.thumbnail = 'img/media-video-thumb.jpg';
                }
              });
            } else {
              toastr.error('No Videos found');
              $state.go('eventgallery');
            }

          } else {
            console.log("im in else");
          }
        } else {
          toastr.error(allData.message, 'Error Message');
        }
      });
    });
    //get all videos
    NavigationService.getAllVideos(function (data) {
      errorService.errorCode(data, function (allData) {
        if (!allData.message) {
          if (allData.value === true) {
            $scope.allfolderName = allData.data;
            console.log("$scope.allfolderName", $scope.allfolderName);
          } else {
            console.log("im in else");
          }
        } else {

          toastr.error(allData.message, 'Error Message');
        }
      });
    });

  }





});