// DETAIL MATCHES
myApp.controller('DetailMatchesCtrl', function ($scope, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
  //Used to name the .html file
  $scope.template = TemplateService.changecontent("detailmatch");
  $scope.menutitle = NavigationService.makeactive("Detail Match");
  TemplateService.title = $scope.menutitle;
  $scope.navigation = NavigationService.getnav();
});

// DETAIL MATCHES END

// TABLE PDF
myApp.controller('TablePdfCtrl', function ($scope, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr, $uibModal) {
  //Used to name the .html file
  $scope.template = TemplateService.changecontent("tablepdf");
  $scope.menutitle = NavigationService.makeactive("Table Pdf");
  TemplateService.title = $scope.menutitle;
  $scope.navigation = NavigationService.getnav();
  $scope.formData = {};
  $scope.formData.page = 1;
  $scope.formData.type = '';
  $scope.formData.keyword = '';

  $scope.confDel = function (data) {
    $scope.pdf = data;
    console.log(data, "in modal")
    $scope.modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'views/modal/pdfdelete.html',
      backdrop: 'static',
      keyboard: false,
      size: 'sm',
      scope: $scope
    });
  };

  $scope.removepdf = function (data) {
    console.log(data, "remove");
    // delete data.eventPdf;
    data.eventPdf = '';
    // $scope.searchForEventPdf();
    console.log(data);
    if (data) {
      $scope.url = "Sport/saveSport";
      NavigationService.apiCall($scope.url, data, function (data) {
        console.log("data.value", data);
        if (data.data.nModified == '1') {
          toastr.error(" Deleted Successfully", "Event Pdf");
          $state.reload('tablepdf');
        }
      });

    } else {
      toastr.error("Something went wrong", "Error");
    }
  }

  $scope.noDelete = function () {
    $scope.modalInstance.close();
  }

  $scope.searchForEventPdf = function () {
    $scope.formData.page = $scope.formData.page++;
    NavigationService.searchForEventPdf($scope.formData, function (data) {
      console.log("data.value", data);
      $scope.items = data.data.results;
      $scope.totalItems = data.data.total;
      $scope.maxRow = data.data.options.count;
    });

  }
  $scope.searchForEventPdf();

});

// TABLE PDF END

myApp.controller('DetailPdfCtrl', function ($scope, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
  //Used to name the .html file
  $scope.template = TemplateService.changecontent("detailpdf");
  $scope.menutitle = NavigationService.makeactive("Detail Pdf");
  TemplateService.title = $scope.menutitle;
  $scope.navigation = NavigationService.getnav();
  $scope.form = {};
  $scope.flag = '';
  $scope.searchInTable = function (data) {
    $scope.formData.page = 1;
    if (data.length >= 2) {
      $scope.formData.keyword = data;
      $scope.viewTable();
    } else if (data.length == '') {
      $scope.formData.keyword = data;
      $scope.viewTable();
    }
  }


  console.log("$stateParams.id", $stateParams.id);
  if ($stateParams.id != '') {
    console.log("edit")
    $scope.title = "Edit";
    $scope.flag = 'edit';
    $scope.getOneOldSchoolById = function () {
      $scope.url = "Sport/getOne";
      $scope.constraints = {};
      $scope.constraints._id = $stateParams.id;
      console.log($stateParams.id);
      NavigationService.apiCall($scope.url, $scope.constraints, function (data) {
        console.log("data.value sportlist", data);
        $scope.form.gender = data.data.gender;
        $scope.form = data.data;
        // $scope.form.eventPdf = data.data.eventPdf;
      });
    }
    $scope.getOneOldSchoolById();
  } else {
    $scope.title = "Upload";
    $scope.getAllSportList = function (data) {
      $scope.url = "SportsList/search";
      console.log(data);
      $scope.constraints = {};
      $scope.constraints.keyword = data;
      NavigationService.apiCall($scope.url, $scope.constraints, function (data) {
        console.log("data.value sportlist", data);
        $scope.sportitems = data.data.results;

      });
    }

    $scope.searchSportList = function (data) {
      $scope.draws = data;
    }

    $scope.getAllAge = function (data) {
      $scope.url = "AgeGroup/search";
      console.log(data);
      $scope.constraints = {};
      $scope.constraints.keyword = data;
      NavigationService.apiCall($scope.url, $scope.constraints, function (data) {
        console.log("data.value age", data);
        $scope.ageitems = data.data.results;

      });
    }

    $scope.searchAge = function (data) {
      $scope.draw = data;
    }

    $scope.getAllWeight = function (data) {
      $scope.url = "Weight/search";
      console.log(data);
      $scope.constraints = {};
      $scope.constraints.keyword = data;
      NavigationService.apiCall($scope.url, $scope.constraints, function (data) {
        console.log("data.value weight", data);
        $scope.weightitems = data.data.results;

      });
    }

    $scope.searchWeight = function (data) {
      $scope.drawing = data;
    }

  }



  // SAVE
  $scope.saveDataMatch = function (formData) {
    console.log(formData, "check this");
    var paramValue = {};
    if (formData.sportsListSubCategory) {
      paramValue.sportsListSubCategory = formData.sportsListSubCategory;
    } else {
      paramValue.sportslist = formData.sportslist;
      paramValue.gender = formData.gender;
      paramValue.ageGroup = formData.ageGroup._id;
      if (formData.weight) {
        paramValue.weight = formData.weight._id;
      }
    }
    paramValue.eventPdf = formData.eventPdf;


    // $scope.formData.matchId = $stateParams.id;
    console.log(paramValue, "save");
    NavigationService.setEventPdf(paramValue, function (data) {
      if (data.value == true) {
        console.log("res", data);
        toastr.success("Data saved successfully", 'Success');
        // if (data.data == []) {
        //   console.log("in empty");
        //   $scope.formData = {};
        //   toastr.error("Mention Sport Do not exist", 'error');
        // } else {
        //   $state.go('tablepdf')
        // }

        if (data.data.nModified === 1) {
          console.log("edit")
          $state.go('tablepdf');
        }

      } else {
        toastr.error("Data save failed ,please try again or check your internet connection", 'Save error');
      }
    })


  }

  // SAVE-END
  $scope.getAllSportListSubCategory = function (data) {
    $scope.url = "SportsListSubCategory/getEventSportslistSubCategory";
    console.log(data);
    $scope.constraints = {};
    $scope.constraints.keyword = data;
    NavigationService.apiCall($scope.url, $scope.constraints, function (data) {
      console.log("dataa", data);
      if (data.value) {
        $scope.sportlistSubCat = data.data;
        console.log("data.value sportlist", $scope.sportlistSubCat);

      }


    });
  };
  $scope.getAllSportListSubCategory();
  //
  $scope.gotoFun = function (id, data) {
    console.log(data, "data");
    console.log("id", id);
    if (id && id != undefined || id != null) {
      if (data === 'sportListSubCat') {
        $scope.hideDetails = true;
      } else if (data === 'sportslist' || data === 'ageGroup' || data === 'weight' || data === 'gender') {
        $scope.hideSportListSubCat = true;
      } else {

      }
    } else {
      if (data === 'sportListSubCat') {
        $scope.hideDetails = false;
      } else if (data === 'sportslist' || data === 'ageGroup' || data === 'weight' || data === 'gender') {
        $scope.hideSportListSubCat = false;
      }

    }
  };

});