myApp.controller('VolleyballScoreCtrl', function ($scope, TemplateService, NavigationService, $timeout, $uibModal, $stateParams, $state, $interval, toastr, $rootScope) {
  $scope.template = TemplateService.getHTML("content/scorevolleyball.html");
  TemplateService.title = "Score Football"; //This is the Title of the Website
  $scope.navigation = NavigationService.getNavigation();
  // ************

  // INITIALISE VARIABLES
  $scope.match = {};
  $scope.stateParam = $stateParams;
  $scope.matchId = $stateParams.id;
  $scope.matchData = {};
  $scope.setLength = [];
  $scope.setDisplay = {
    value: 0
  };
  $scope.setDelete = {
    value: 0
  };
  $scope.btnDisable = false;
  // INITIALISE VARIABLES END

  // CLEAVE FUNCTION OPTIONS
  $scope.options = {
    formation: {
      blocks: [1, 1, 1, 1],
      uppercase: true,
      delimiters: ['-']
    },
    score: {
      blocks: [2],
      numeral: true
    }
  }
  // CLEAVE FUNCTION OPTIONS END

  // FUNCTIONS
  // SELECT TEAM
  $scope.selectTeam = function (result) {
    console.log("select");
    var teamSelection;
    $scope.result = result;
    $rootScope.modalInstance = $uibModal.open({
      animation: true,
      scope: $scope,
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      templateUrl: 'views/modal/teamselection-modal.html',
      windowClass: 'teamselection-modal'
    })
  }
  // SELECT TEAM END
  // SELECT PLAYING
  $scope.selectPlaying = function (team, player) {
    // $scope.match.minPlayers = 11;
    console.log('isPlaying');
    $scope.isPlayer = player;
    $scope.playingTeam = team;
    var playingCount = 0;
    if ($scope.isPlayer.isPlaying == false) {
      _.each($scope.playingTeam.players, function (n) {
        if (n.isPlaying == true) {
          playingCount = playingCount + 1;
        }
      });
      if (playingCount < $scope.match.minTeamPlayers) {
        if ($scope.isPlayer.isPlaying == true) {
          $scope.isPlayer.isPlaying = false;
        } else {
          $scope.isPlayer.isPlaying = true;
        }
      } else {
        toastr.warning('Maximum players selected');
      }
    } else {
      if ($scope.isPlayer.isPlaying == true) {
        $scope.isPlayer.isPlaying = false;
      } else {
        $scope.isPlayer.isPlaying = true;
      }
    }
    console.log(playingCount, 'playingCount');
    console.log($scope.isPlayer, 'playa');
  }
  // SELECT PLAYING END
  // SAVE PLAYING TEAM
  $scope.savePlayingTeam = function (result) {
    console.log(result, 'result');
    var saveCounter = 0;
    _.each(result.teams, function (n, nKey) {
      var countLength = 0;
      var tkey = 0;
      var tKey = nKey + 1;
      if (n.coach == "") {
        toastr.error("Please enter coach of Team " + tKey, "Enter Details");
      } else {
        _.each(n.players, function (m, mkey) {
          if (m.isPlaying == true) {
            countLength = countLength + 1;
          }
        });
        if (countLength < $scope.match.minTeamPlayers) {
          toastr.error("Select minimum " + $scope.match.minTeamPlayers + " players for Team " + tKey + " to start scoring.", "Enter Details");
        } else {
          saveCounter = saveCounter + 1;
        }
      }
    });
    if (saveCounter == 2) {
      $scope.matchResult = {
        resultVolleyball: result,
        matchId: $scope.matchData.matchId
      }

      console.log($scope.matchResult, "matchResult");
      if ($stateParams.drawFormat === 'League cum Knockout') {
        NavigationService.saveFootball($scope.matchResult, function (data) {
          if (data.value == true) {
            console.log('save success');
            $rootScope.modalInstance.close('a');
          } else {
            alert('fail save');
          }
        })
      } else {
        NavigationService.saveMatch($scope.matchResult, function (data) {
          if (data.value == true) {
            console.log('save success');
            $rootScope.modalInstance.close('a');
          } else {
            alert('fail save');
          }
        });
      }

    }
  }
  // SAVE PLAYING TEAM END
  // MATCH DRAW
  $scope.matchDraw = function(){
    if ($scope.match.resultVolleyball.isDraw == false) {
      $scope.match.resultVolleyball.isDraw = true;
    } else {
      $scope.match.resultVolleyball.isDraw = false;
    }
  }
  // MATCH DRAW END
  // TEAM SCORE INCREMENT
  $scope.incrementTeamPoint = function (team, point) {
    $scope.team = team;
    switch (point) {
      case 'spike':
        if ($scope.team.teamResults.spike == "") {
          $scope.team.teamResults.spike = 1;
        } else {
          $scope.team.teamResults.spike = $scope.team.teamResults.spike + 1;
        }
        break;
      case 'fouls':
        if ($scope.team.teamResults.fouls == "") {
          $scope.team.teamResults.fouls = 1;
        } else {
          $scope.team.teamResults.fouls = $scope.team.teamResults.fouls + 1;
        }
        break;
      case 'block':
        if ($scope.team.teamResults.block == "") {
          $scope.team.teamResults.block = 1;
        } else {
          $scope.team.teamResults.block = $scope.team.teamResults.block + 1;
        }
        break;
    }
    console.log(point, 'inTP');
  };
  // TEAM SCORE INCREMENT END
  // TEAM SCORE DECREMENT
  $scope.decrementTeamPoint = function (team, point) {
    $scope.team = team;
    switch (point) {
      case 'spike':
        if ($scope.team.teamResults.spike > 0) {
          $scope.team.teamResults.spike = $scope.team.teamResults.spike - 1;
        }
        break;
      case 'fouls':
        if ($scope.team.teamResults.fouls > 0) {
          $scope.team.teamResults.fouls = $scope.team.teamResults.fouls - 1;
        }
        break;
      case 'block':
        if ($scope.team.teamResults.block > 0) {
          $scope.team.teamResults.block = $scope.team.teamResults.block - 1;
        }
        break;
    }
    console.log(point, 'deTP');
  };
  // TEAM SCORE DECREMENT END
  // PLAYER SCORE INCREMENT
  $scope.incrementPlayerPoint = function (player, point) {
    $scope.player = player;
    switch (point) {
      case 'in':
        $scope.player.playerPoints.in.push({
          time: 0
        });
        $scope.player.isPlaying = true;
        break;
      case 'out':
        $scope.player.playerPoints.out.push({
          time: 0
        });
        $scope.player.isPlaying = false;
        break;
    }
    console.log('inPP');
  };
  // PLAYER SCORE INCREMENT END
  // PLAYER SCORE DECREMENT
  $scope.decrementPlayerPoint = function (player, point) {
    $scope.player = player;
    switch (point) {
      case 'in':
        if ($scope.player.playerPoints.in.length > 0) {
          var length = $scope.player.playerPoints.in.length - 1;
          _.remove($scope.player.playerPoints.in, function (m, index) {
            return length == index;
          })
        }
        break;
      case 'out':
        if ($scope.player.playerPoints.out.length > 0) {
          var length = $scope.player.playerPoints.out.length - 1;
          _.remove($scope.player.playerPoints.out, function (m, index) {
            return length == index;
          })
        }
        break;
    }
    console.log('dePP');
  };
  // PLAYER SCORE DECREMENT END
  // TEAM SETS
  // SCORE INCREMENT
  $scope.incrementScore = function (set, model) {
    $scope.set = set;
    switch (model) {
      case 'points':
        if ($scope.set.points == "") {
          $scope.set.points = 1;
        } else {
          $scope.set.points = $scope.set.points + 1;
        }
        break;
    }
    console.log("increment");
  };
  // SCORE INCREMENT END
  // SCORE DECREMENT
  $scope.decrementScore = function (set, model) {
    $scope.set = set;
    switch (model) {
      case 'points':
        if ($scope.set.points > 0) {
          $scope.set.points = $scope.set.points - 1;
        }
        break;
    }
    console.log("decrement");
  };
  // SCORE DECREMENT END
  // ADD SET
  $scope.addSet = function () {
    _.each($scope.match.resultVolleyball.teams, function (n) {
      n.teamResults.sets.push({
        points: ''
      });
    })
    _.each($scope.match.resultVolleyball.teams[0].teamResults.sets, function (n, key) {
      $scope.setLength[key] = {
        setShow: true
      }
    })
    $scope.setDisplay = {
      value: 0
    };
    $scope.setDelete = {
      value: 0
    };
  }
  // ADD SET END
  // REMOVE SET
  $scope.removeSets = function () {
    var modalSetDelete;
    $rootScope.modalInstance = $uibModal.open({
      animation: true,
      scope: $scope,
      keyboard: false,
      templateUrl: 'views/modal/removeset.html',
      windowClass: 'removeset-modal'
    })
  }
  $scope.deleteSet = function (index) {
    console.log(index, 'index che');
    _.each($scope.match.resultVolleyball.teams, function (n) {
      if (n.teamResults.sets.length > 1) {
        n.teamResults.sets.splice(index, 1);
        $scope.setLength = [];
        _.each($scope.match.resultVolleyball.teams[0].teamResults.sets, function (n, key) {
          $scope.setLength[key] = {
            setShow: true
          }
        });
        $scope.setDisplay = {
          value: 0
        };
        $scope.setDelete = {
          value: 0
        };
        toastr.success('Set deleted successfully');
        $rootScope.modalInstance.close('a');
        console.log($scope.match.resultVolleyball, 'After delete');
      } else {
        toastr.warning('Minimum 1 Set required');
      }
    });
  }
  // REMOVE SET END
  // TEAM SETS END
  // PLAYER POINTS MODAL
  $scope.addPlayerPoints = function (player, index, teamIndex) {
    $scope.selectedPlayer = player;
    $scope.selectedInPlayer = {};
    $scope.teamIndex = teamIndex;
    $scope.selectedTeam = $scope.match.teams[$scope.teamIndex];
    _.each($scope.selectedTeam.studentTeam, function (n, index) {
      n.isPlaying = "";
      _.each($scope.match.resultVolleyball.teams[$scope.teamIndex].players, function (m, mkey) {
        if (n.studentId._id == m.player) {
          n.isPlaying = m.isPlaying;
        }
      });
    });
    $rootScope.modalInstance = $uibModal.open({
      animation: true,
      scope: $scope,
      // backdrop: 'static',
      keyboard: false,
      size: 'lg',
      templateUrl: 'views/modal/scoreplayer-volleyball.html',
      windowClass: 'scoreplayer-volleyball-modal'
    })
  }
  // PLAYER POINTS MODAL END
  // CANCEL PLAYER POINTS SAVE
  $scope.cancelPlayerPoints = function () {
    if ($scope.selectedPlayer.isPlaying == false) {
      $scope.selectedPlayer.isPlaying = true;
      if ($scope.selectedPlayer.playerPoints.out.length > 0) {
        var length = $scope.player.playerPoints.out.length - 1;
        _.remove($scope.player.playerPoints.out, function (m, index) {
          return length == index;
        })
      }
    }
    _.each($scope.match.resultVolleyball.teams[$scope.teamIndex].players, function (n) {
      if (n.player == $scope.selectedInPlayer.player) {
        n.isPlaying = false;
      }
    });
    $rootScope.modalInstance.close('a');
  }
  // CANCEL PLAYER POINTS SAVE END
  // SAVE PLAYER POINTS
  $scope.savePlayerPoints = function () {
    if ($scope.selectedPlayer.isPlaying == false) {
      if (!_.isEmpty($scope.selectedInPlayer.player)) {
        var inLength = $scope.selectedPlayer.playerPoints.out.length - 1;
        $scope.inOutTime = $scope.selectedPlayer.playerPoints.out[inLength];
        console.log('inOutTime', $scope.inOutTime);
        if ($scope.inOutTime && $scope.inOutTime.time && $scope.inOutTime.time != '') {
          _.each($scope.match.resultVolleyball.teams[$scope.teamIndex].players, function (n) {
            if (n.player == $scope.selectedInPlayer.player) {
              n.isPlaying = true;
              n.playerPoints.in.push({
                time: $scope.inOutTime.time
              });
              console.log(n, 'yomama');
            }
          });
          $rootScope.modalInstance.close('a');
          $scope.selectedInPlayer = {};
        } else {
          toastr.error("Please Enter Out Time", "Error");
        }
      } else {
        toastr.error("Please select a Substitute", "Error");
      }
    }
  }
  // SAVE PLAYER POINTS END
  // PENALTY SHOOTOUTS MODAL
  $scope.startPenalty = function () {
    var teamPenaltyModal;
    teamPenaltyModal = $uibModal.open({
      animation: true,
      scope: $scope,
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      templateUrl: 'views/modal/penaltyshootouts.html',
      windowClass: 'penaltyshootouts-modal'
    })
  }
  // PENALTY SHOOTOUTS MODAL END
  // REMOVE MATCH SCORESHEET
  $scope.removeMatchScore = function (pic, type) {
    switch (type) {
      case 'matchPhoto':
        _.remove($scope.match.resultVolleyball.matchPhoto, function (n) {
          return n.image === pic.image;
        })
        break;
      case 'scoreSheet':
        _.remove($scope.match.resultVolleyball.scoreSheet, function (n) {
          return n.image === pic.image;
        })
        break;
    }
  }
  // REMOVE MATCH SCORESHEET END
  // FUNCTIONS END
  // API CALLS
  // GET MATCH
  $scope.getOneMatch = function () {
    $scope.matchData.matchId = $stateParams.id;
    NavigationService.getOneMatch($scope.matchData, function (data) {
      if (data.value == true) {
        if (data.data.error) {
          $scope.matchError = data.data.error;
          console.log($scope.matchError, 'error');
          toastr.error('Invalid MatchID. Please check the MatchID entered.', 'Error');
          if ($stateParams.drawFormat === 'League cum Knockout') {
            $state.go('league-knockoutTeam', {
              drawFormat: $stateParams.drawFormat,
              id: $stateParams.sport
            });
          } else {
            $state.go('knockout-team', {
              drawFormat: $stateParams.drawFormat,
              id: $stateParams.sport
            });
          }

        }
        $scope.match = data.data;
        $scope.match.matchId = $scope.matchData.matchId;
        _.each($scope.match.resultVolleyball.teams[0].teamResults.sets, function (n, key) {
          $scope.setLength[key] = {
            setShow: true
          }
        });
        if ($scope.match.resultVolleyball.teams[0] == "" || $scope.match.resultVolleyball.teams[1].coach == "" || $scope.match.resultVolleyball.teams[1] == '') {
          $scope.selectTeam($scope.match.resultVolleyball);
        }
      } else {
        console.log("ERROR IN getOneMatch");
      }
    })
  };
  $scope.getOneMatch();
  // GET MATCH END
  // SAVE RESULT
  $scope.saveResult = function (formData) {
    $scope.matchResult = {
      resultVolleyball: formData.resultVolleyball,
      matchId: $scope.matchData.matchId
    }
    if ($stateParams.drawFormat === 'League cum Knockout') {
      NavigationService.saveFootball($scope.matchResult, function (data) {
        if (data.value == true) {
          console.log('save success');
        } else {
          alert('fail save');
        }
      });
    } else {
      NavigationService.saveMatch($scope.matchResult, function (data) {
        if (data.value == true) {
          console.log('save success');
        } else {
          alert('fail save');
        }
      });
    }

  }
  // SAVE RESULT END
  // AUTO SAVE
  $scope.autoSave = function () {
    $scope.$on('$viewContentLoaded', function (event) {
      promise = $interval(function () {
        $scope.saveResult($scope.match);
      }, 10000);
    })
  }
  $scope.autoSave();
  // AUTO SAVE FUNCTION END
  // DESTROY AUTO SAVE
  // $scope.destroyAutoSave = function(){
  $scope.$on('$destroy', function () {
    console.log('destroy');
    $interval.cancel(promise);
  })
  // }
  // DESTROY AUTO SAVE END
  // AUTO SAVE END
  // MATCH COMPLETE
  $scope.completePopup = function () {
    console.log($scope.match, 'complete');
    if ($scope.match.resultVolleyball.matchPhoto.length == 0) {
      toastr.error('Please upload match photo.', 'Data Incomplete');
    } else if ($scope.match.resultVolleyball.scoreSheet.length == 0) {
      toastr.error('Please upload scoresheet.', 'Data Incomplete');
    } else if (!$scope.match.resultVolleyball.winner.player) {
      toastr.error('Please select a winner.', 'Data Incomplete');
    } else {
      $rootScope.modalInstance = $uibModal.open({
        animation: true,
        scope: $scope,
        backdrop: 'static',
        keyboard: false,
        templateUrl: 'views/modal/confirmcomplete.html',
        windowClass: 'completematch-modal'
      })
    }
  };
  $scope.matchComplete = function () {
    if ($scope.match.resultVolleyball) {
      $scope.btnDisable = true;
      _.each($scope.match.resultVolleyball.teams, function (n, nkey) {
        if (n.teamResults.block == "") {
          n.teamResults.block = 0;
        }
        if (n.teamResults.fouls == "") {
          n.teamResults.fouls = 0;
        }
        if (n.teamResults.spike == "") {
          n.teamResults.spike = 0;
        }
        if (n.teamResults.finalPoints == "") {
          n.teamResults.finalPoints = 0;
        }
        _.each(n.teamResults.sets, function (m, mkey) {
          if (m.points == "") {
            m.points = 0;
          }
        })
      });
      $scope.match.resultVolleyball.status = "IsCompleted";
      $scope.matchResult = {
        resultVolleyball: $scope.match.resultVolleyball,
        matchId: $scope.matchData.matchId
      }
      $interval.cancel(promise);
      if ($stateParams.drawFormat === 'League cum Knockout') {
        NavigationService.saveFootball($scope.matchResult, function (data) {
          if (data.value == true) {
            $scope.btnDisable = false;
            $state.go('league-knockoutTeam', {
              drawFormat: $stateParams.drawFormat,
              id: $stateParams.sport
            });
            console.log('save success');
          } else {
            $scope.btnDisable = false;
            toastr.error('Data save failed. Please try again.', 'Save Error');
          }
        });
      } else {
        NavigationService.saveMatch($scope.matchResult, function (data) {
          if (data.value == true) {
            $scope.btnDisable = false;
            $state.go('knockout-team', {
              drawFormat: $stateParams.drawFormat,
              id: $stateParams.sport
            });
            console.log('save success');
          } else {
            $scope.btnDisable = false;
            toastr.error('Data save failed. Please try again.', 'Save Error');
          }
        });
      }

      console.log($scope.matchResult, 'result#');
    } else {
      toastr.error('No data to save. Please check for valid MatchID.', 'Save Error');
    }
  }
  // MATCH COMPLETE END
  // API CALLS END
  // JSON
  $scope.match = {
    matchId: '123456',
    sportsName: 'Volleyball',
    age: 'u-11',
    gender: 'female',
    round: 'final',
    minPlayers: 4,
    resultVolleyball: {
      teams: [{
        teamId: '987654',
        teamResults: {
          block: 1,
          spike: 1,
          fouls: 1,
          sets: [{
            points: 1
          }, {
            points: 0
          }, {
            points: 0
          }]
        },
        players: [{
          name: 'hello',
          isPlaying: true,
          jerseyNo: 1,
          playerPoints: {
            goals: [],
            assist: [],
            redCard: [],
            yellowCard: [],
            penaltyPoint: 0,
            in: [],
            out: []
          }
        }, {
          name: 'hello',
          isPlaying: true,
          jerseyNo: 1,
          playerPoints: {
            goals: [],
            redCard: [],
            yellowCard: [],
            penaltyPoint: 0,
            in: [],
            out: []
          }
        }, {
          name: 'hello',
          isPlaying: false,
          jerseyNo: 1,
          playerPoints: {
            goals: [],
            assist: [],
            redCard: [],
            yellowCard: [],
            penaltyPoint: 0,
            in: [],
            out: []
          }
        }, {
          name: 'hello',
          isPlaying: true,
          jerseyNo: 1,
          playerPoints: {
            goals: [],
            assist: [],
            redCard: [],
            yellowCard: [],
            penaltyPoint: 0,
            in: [],
            out: []
          }
        }, {
          name: 'hello',
          isPlaying: false,
          jerseyNo: 1,
          playerPoints: {
            goals: [],
            assist: [],
            redCard: [],
            yellowCard: [],
            penaltyPoint: 0,
            in: [],
            out: []
          }
        }]
      }, {
        teamId: '54321',
        teamResults: {
          block: 1,
          spike: 1,
          fouls: 1,
          sets: [{
            points: 0
          }, {
            points: 5
          }, {
            points: 0
          }]
        },
        players: [{
          name: 'hello',
          isPlaying: false,
          jerseyNo: 1,
          playerPoints: {
            goals: [],
            assist: [],
            redCard: [],
            yellowCard: [],
            penaltyPoint: 0,
            in: [],
            out: []
          }
        }, {
          name: 'hello',
          isPlaying: true,
          jerseyNo: 1,
          playerPoints: {
            goals: [],
            assist: [],
            redCard: [],
            yellowCard: [],
            penaltyPoint: 0,
            in: [],
            out: []
          }
        }, {
          name: 'hello',
          isPlaying: false,
          jerseyNo: 1,
          playerPoints: {
            goals: [],
            assist: [],
            redCard: [],
            yellowCard: [],
            penaltyPoint: 0,
            in: [],
            out: []
          }
        }, {
          name: 'hello',
          isPlaying: false,
          jerseyNo: 1,
          playerPoints: {
            goals: [],
            assist: [],
            redCard: [],
            yellowCard: [],
            penaltyPoint: 0,
            in: [],
            out: []
          }
        }, {
          name: 'hello',
          isPlaying: true,
          jerseyNo: 1,
          playerPoints: {
            goals: [],
            assist: [],
            redCard: [],
            yellowCard: [],
            penaltyPoint: 0,
            in: [],
            out: []
          }
        }]
      }]
    },
    teams: [{
        schoolName: 'jamnabai narsee school',
        teamId: '987654',
        players: [{
          firstName: 'Jaiviraj singh rajputrajput singh'
        }, {
          firstName: 'hello2'
        }, {
          firstName: 'hello3'
        }, {
          firstName: 'hello4'
        }, {
          firstName: 'hello5'
        }]
      },
      {
        schoolName: 'Marvel iron high school',
        teamId: '54321',
        players: [{
          firstName: 'hello6'
        }, {
          firstName: 'hello7'
        }, {
          firstName: 'hello8'
        }, {
          firstName: 'hello9'
        }, {
          firstName: 'hello10'
        }]
      }
    ]
  }
  // JSON END

  // ************
})
