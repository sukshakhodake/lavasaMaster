myApp.controller('MatchTeamCtrl', function ($scope, TemplateService, NavigationService, $timeout, $uibModal, $stateParams, $state, toastr, $rootScope, ResultSportInitialization) {
    $scope.template = TemplateService.getHTML("content/match-team.html");
    TemplateService.title = "Sport Match"; //This is the Title of the Website
    $scope.navigation = NavigationService.getNavigation();
    $scope.matchId = $stateParams.id;
    // VARIABLE INITIALISE
    $scope.showMatchPhoto = false;
    $scope.matchData = {};
    $scope.matchDetails = {};
    $scope.matchPics = [];
    $scope.disableWinner = false;
    $scope.matchError = "";
    $scope.showError = false;
    $scope.removeReset = true;
    var resultVar = {};
    // VARIABLE INITIALISE END

    //INTEGRATION

    var initilizeMyTemplate = function () {
        console.log("For Data Initialization", $scope.resultVar.resultVar, $scope.matchDetails[$scope.resultVar.resultVar]);
        if ($scope.matchDetails[$scope.resultVar.resultVar] == null || $scope.matchDetails[$scope.resultVar.resultVar] == "" || $scope.matchDetails[$scope.resultVar.resultVar] == undefined) {
            ResultSportInitialization.getMyResult($scope.matchDetails.sportsName, $scope.matchDetails, function (result) {
                console.log("finalResult", result);
                var resultVar = ResultSportInitialization.getResultVariable($scope.matchDetails.sportsName, $scope.matchDetails.sportType);
                $scope.formData = result[resultVar.resultVar];
                console.log(resultVar, $scope.formData);
            });
        } else {
            $scope.formData = $scope.matchDetails[$scope.resultVar.resultVar];
            if ($scope.matchDetails[$scope.resultVar.resultVar].status == 'IsCompleted') {
                toastr.warning("This match has already been scored.", "Match Complete");
                if ($stateParams.drawFormat === 'Knockout') {
                    $state.go('knockout-team', {
                        drawFormat: $stateParams.drawFormat,
                        id: $stateParams.sport
                    });
                } else if ($stateParams.drawFormat === 'Heats') {
                    $state.go('heats', {
                        drawFormat: $stateParams.drawFormat,
                        id: $stateParams.sport
                    });
                } else if ($stateParams.drawFormat === 'League cum Knockout') {
                    $state.go('league-knockoutTeam', {
                        drawFormat: $stateParams.drawFormat,
                        id: $stateParams.sport
                    });
                }
            }
        }
    };



    // GET MATCH
    $scope.getOneMatch = function () {
        $scope.matchData.matchId = $stateParams.id;
        NavigationService.getOneMatch($scope.matchData, function (data) {
            if (data.value == true) {
                if (data.data.error) {
                    $scope.matchError = data.data.error;
                    console.log($scope.matchError, 'error');
                    toastr.error('Invalid MatchID. Please check the MatchID entered.', 'Error');
                }
                $scope.matchDetails = data.data;
                $scope.matchDetails.matchId = $scope.matchData.matchId;
                console.log("$scope.matchDetails.sportType", $scope.matchDetails.sportType);
                $scope.resultVar = resultVar = ResultSportInitialization.getResultVariable($scope.matchDetails.sportsName, $scope.matchDetails.sportType);
                console.log("$scope.resultVar", $scope.resultVar);
                console.log($scope.matchDetails, '$scope.matchDetails');
                if ($scope.matchDetails.teams.length == 0) {
                    toastr.error("Empty Data");
                    if ($stateParams.drawFormat === 'Knockout') {
                        $state.go('knockout-team', {
                            drawFormat: $stateParams.drawFormat,
                            id: $stateParams.sport
                        });
                    } else if ($stateParams.drawFormat === 'Heats') {
                        $state.go('heats', {
                            drawFormat: $stateParams.drawFormat,
                            id: $stateParams.sport
                        });
                    } else if ($stateParams.drawFormat === 'League cum Knockout') {
                        $state.go('league-knockoutTeam', {
                            drawFormat: $stateParams.drawFormat,
                            id: $stateParams.sport
                        });
                    }
                } else {
                    // INITIALISE RESULTS
                    switch ($scope.matchDetails.sportsName) {
                        case "Football":
                        case "Volleyball":
                        case 'Basketball':
                        case 'Hockey':
                        case 'Kabaddi':
                        case 'Handball':
                        case "Throwball":
                        case 'Water Polo':
                        case 'Karate Team Kumite':
                            initilizeMyTemplate();
                            break;
                    }
                    // INITIALISE RESULTS END
                }
            } else {
                toastr.error('There was some internal error. Please try again.');
                console.log("ERROR IN getOneMatch");
            }
        })
    };
    $scope.getOneMatch();
    // GET MATCH END
    // GET MATCH SCORESHEET
    $scope.getMatchPhoto = function (detail) {
        console.log(detail, 'pic return');
        $scope.showMatchPhoto = true;
        // $scope.swiperInit();
    };
    // GET MATCH SCORESHEET END
    // REMOVE MATCH SCORESHEET
    $scope.removeMatchScore = function (pic) {
        _.remove($scope.formData.matchPhoto, function (n) {
            return n.image === pic.image;
        })
    }
    // REMOVE MATCH SCORESHEET END
    // TEAM NO MATCH
    $scope.setTeamNoMatch = function () {
        _.each($scope.formData.teams, function (team) {
            team.noShow = true;
            team.walkover = false;
        })
    }
    // TEAM NO MATCH END
    // SAVE RESULT
    $scope.saveResult = function (formData) {
        console.log(formData, 'svae data');
        if (formData) {
            if ($scope.matchDetails.teams.length == 1) {
                toastr.error('Minimum 2 Players required to start scoring');
            } else {
                if (!formData) {
                    // formData.matchPhoto.length == 0
                    toastr.error('Please upload match photo.', 'Data Incomplete');
                } else {
                    $scope.matchResult = {
                        matchId: $scope.matchData.matchId
                    }
                    switch ($scope.matchDetails.sportsName) {
                        case "Throwball":
                        case "Volleyball":
                        case "Football":
                        case "Basketball":
                        case 'Hockey':
                        case 'Kabaddi':
                        case 'Handball':
                        case 'Water Polo':
                        case 'Karate Team Kumite':
                            $scope.matchResult[$scope.resultVar.resultVar] = formData;
                            if (!$scope.matchResult[$scope.resultVar.resultVar].status) {
                                $scope.matchResult[$scope.resultVar.resultVar].status = "IsLive";
                            }
                            break;
                    }
                    if ($stateParams.drawFormat === 'League cum Knockout') {
                        NavigationService.saveFootball($scope.matchResult, function (data) {
                            if (data.value == true) {
                                switch ($scope.matchDetails.sportsName) {
                                    case "Throwball":
                                    case "Volleyball":
                                    case "Football":
                                    case "Basketball":
                                    case 'Hockey':
                                    case 'Kabaddi':
                                    case 'Handball':
                                    case 'Water Polo':
                                        $state.go('scorebasketball', {
                                            drawFormat: $stateParams.drawFormat,
                                            sport: $stateParams.sport,
                                            id: $scope.matchData.matchId
                                        })
                                }
                            } else {
                                toastr.error('Data save failed. Please try again.', 'Save Error');
                            }
                        });
                    } else {
                        NavigationService.saveMatch($scope.matchResult, function (data) {
                            if (data.value == true) {
                                switch ($scope.matchDetails.sportsName) {
                                    case "Throwball":
                                    case "Volleyball":
                                    case "Football":
                                    case "Basketball":
                                    case 'Hockey':
                                    case 'Kabaddi':
                                    case 'Handball':
                                    case 'Water Polo':
                                    case 'Karate Team Kumite':
                                        $state.go('scorebasketball', {
                                            drawFormat: $stateParams.drawFormat,
                                            sport: $stateParams.sport,
                                            id: $scope.matchData.matchId
                                        })
                                }


                            } else {
                                toastr.error('Data save failed. Please try again.', 'Save Error');
                            }
                        });
                    }
                }
            }
        } else {
            toastr.error('No data to save. Please check for valid MatchID.', 'Save Error');
        }
    }
    // SAVE RESULT END
    $scope.updateTeamWinner = function () {
        $scope.matchResult = {
            matchId: $scope.matchData.matchId
        }
        switch ($scope.matchDetails.sportsName) {
            case "Football":
                // $scope.matchResult.resultFootball = $scope.formData;
                // $scope.matchResult.resultFootball.status = "IsCompleted";
                // break;
            case "Volleyball":
                // $scope.matchResult.resultVolleyball = $scope.formData;
                // $scope.matchResult.resultVolleyball.status = "IsCompleted";
                // break;
            case "Throwball":
            case "Basketball":
            case 'Hockey':
            case 'Kabaddi':
            case 'Handball':
            case 'Water Polo':
            case "Karate Team Kumite":
                $scope.matchResult[$scope.resultVar.resultVar] = $scope.formData;
                $scope.matchResult[$scope.resultVar.resultVar].status = "IsCompleted";
                break;
        }
        switch ($stateParams.drawFormat) {
            case "Knockout":
                NavigationService.saveMatch($scope.matchResult, function (data) {
                    if (data.value == true) {
                        toastr.success('Results stored successfully', 'Saved success');
                        $state.go('knockout-team', {
                            drawFormat: $stateParams.drawFormat,
                            id: $stateParams.sport
                        });
                    } else {
                        toastr.error('Match save failed. Please try again', 'Scoring Save Failed');
                    }
                });
                break;
            case "League cum Knockout":
                console.log('FOOOTBALL');
                NavigationService.saveFootball($scope.matchResult, function (data) {
                    if (data.value == true) {
                        toastr.success('Results stored successfully', 'Saved success');
                        $state.go('league-knockoutTeam', {
                            drawFormat: $stateParams.drawFormat,
                            id: $stateParams.sport
                        });
                    } else {
                        toastr.error('Match save failed. Please try again', 'Scoring Save Failed');
                    }
                });
                break;
        }
    }
    $scope.saveTeamWinner = function () {
        if ($scope.matchDetails.teams.length == 1) {
            if ($scope.formData.teams[0].noShow == true) {
                $scope.formData.isNoMatch = true;
                $scope.formData.winner.player = "";
                $scope.updateTeamWinner();
            } else {
                $scope.formData.isNoMatch = false;
                if ($scope.formData.winner.player == "" || !$scope.formData.winner.player) {
                    toastr.warning('Please select a winner');
                } else {
                    if ($scope.formData.teams[0].walkover == true) {
                        $scope.updateTeamWinner();
                    } else {
                        $scope.formData.winner.reason = 'Bye';
                        $scope.updateTeamWinner();
                    }
                }
            }
        } else {
            if ($scope.formData.teams[0].noShow == true && $scope.formData.teams[1].noShow == true) {
                $scope.formData.isNoMatch = true;
                $scope.formData.winner = {};
                $scope.formData.winner.player = "";
                $scope.updateTeamWinner();
            } else {
                $scope.formData.isNoMatch = false;
                if ($scope.formData.winner.player == "" || !$scope.formData.winner.player) {
                    toastr.warning('Please select a winner');
                } else {
                    _.each($scope.formData.teams, function (n) {
                        if ($scope.formData.winner.player == n.team) {
                            n.walkover = true;
                            n.noShow = false;
                        } else {
                            n.walkover = false;
                            n.noShow = true;
                        }
                    })
                    $scope.updateTeamWinner();
                }
            }
        }
    }
    // OPEN MATCH-NO MATCH MODAL
    $scope.showNoMatch = function () {
        if ($scope.formData) {

            $uibModal.open({
                animation: true,
                scope: $scope,
                backdrop: 'static',
                keyboard: false,
                templateUrl: 'views/modal/team-match-nomatch.html',
                size: 'lg',
                windowClass: 'match-nomatch'
            })

        } else {
            toastr.error('No player data to enter.', 'Error');
        }

    }
    // OPEN MATCH-NO MATCH MODAL
    // OPEN MATCH-NO MATCH MODAL END
    // RESET RESULT POPUP
    $scope.resetResultPop = function () {
        $rootScope.modalInstance = $uibModal.open({
            animation: true,
            scope: $scope,
            templateUrl: 'views/modal/resetresult.html',
            windowClass: 'completematch-modal resetresult-modal'
        })
    }
    // RESET RESULT POPUP END
    // RESET MATCH RESULT
    $scope.resetMatchResult = function () {
        $scope.formData = {};
        ////
        $scope.matchResult = {
            matchId: $scope.matchData.matchId
        }
        switch ($scope.matchDetails.sportsName) {
            case "Football":
                // $scope.matchResult.resultFootball = $scope.formData;
                // if (!$scope.matchResult.resultFootball.status) {
                //     $scope.matchResult.resultFootball.status = "IsPending";
                // }
                // break;
            case "Volleyball":
                // $scope.matchResult.resultVolleyball = $scope.formData;
                // if (!$scope.matchResult.resultVolleyball.status) {
                //     $scope.matchResult.resultVolleyball.status = "IsPending";
                // }
                // break;
            case "Throwball":
            case "Basketball":
            case 'Hockey':
            case 'Kabaddi':
            case 'Handball':
            case 'Water Polo':
                console.log(resultVar);
                $scope.matchResult[resultVar.resultVar] = {};
                // $scope.matchResult[resultVar.resultVar].status = "IsPending";
                break;
        }
        if ($stateParams.drawFormat === 'League cum Knockout') {
            NavigationService.saveFootball($scope.matchResult, function (data) {
                if (data.value == true) {
                    toastr.success('Match result has been successfully reset', 'Result Reset');
                    $rootScope.modalInstance.close('a');
                    location.reload();
                } else {
                    toastr.error('Match result reset failed. Please try again', 'Result Reset Failed');
                }
            });
        } else {
            NavigationService.saveMatch($scope.matchResult, function (data) {
                if (data.value == true) {
                    toastr.success('Match result has been successfully reset', 'Result Reset');
                    $rootScope.modalInstance.close('a');
                    location.reload();
                } else {
                    toastr.error('Match result reset failed. Please try again', 'Result Reset Failed');
                }
            });
        }
        ////
        $rootScope.modalInstance.close('a');
        toastr.success('Match Result has been successfully reset', 'Result Reset');
    }
    // RESET MATCH RESULT
    // REMOVE RESET
    $scope.removeReset = function () {
        $scope.removeReset = false;
    }
    // REMOVE RESET END

})
