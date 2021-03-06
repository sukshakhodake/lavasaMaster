var uploadurl = adminurl + "upload/";
myApp.factory('NavigationService', function ($http, ResultSportInitialization, $filter) {
    var navigation = [{
        name: "Home",
        classis: "active",
        anchor: "home",
        subnav: []
    }, {
        name: "Sport Selection",
        classis: "active",
        anchor: "digital-home",
        subnav: []
    }, {
        name: "Sport Attendance",
        classis: "active",
        anchor: "digital-attendance",
        subnav: []
    }];

    return {
        getNavigation: function () {
            return navigation;
        },
        getOneMatch: function (formData, callback) {
            $http({
                url: adminurl + "match/getOne",
                method: "POST",
                data: formData
            }).success(function (data) {
                // console.log(data, "nav");
                callback(data)
            });
        },
        saveMatch: function (formData, callback) {
            // console.log(formData, 'saveMatch');
            $http({
                url: adminurl + "match/updateResult",
                method: "POST",
                data: formData
            }).success(function (data) {
                callback(data)
            });
        },
        updateResultImages: function (formData, callback) {
            $http({
                url: adminurl + "match/updateResultImages",
                method: "POST",
                data: formData
            }).success(function (data) {
                callback(data)
            });
        },
        saveMatchPp: function (match, resultVar, url, callback) {
            var obj = {};
            obj[resultVar] = match[resultVar];
            obj.matchId = match.matchId;
            $http({
                url: adminurl + url,
                method: "POST",
                data: obj
            }).success(function (data) {
                callback(data)
            });
        },
        saveFootball: function (formData, callback) {
            // console.log(formData, 'saveMatch');
            $http({
                url: adminurl + "match/updateLeagueKnockout",
                method: "POST",
                data: formData
            }).success(function (data) {
                callback(data)
            });
        },
        saveFencing: function (formData, callback) {
            $http({
                url: adminurl + "match/updateFencing",
                method: "POST",
                data: formData
            }).success(function (data) {
                callback(data)
            });
        },
        getAllSportsList: function (callback) {
            $http({
                url: adminurl + 'SportsList/getAll',
                method: 'POST'
            }).then(callback);
        },
        getAllAgeGroups: function (callback) {
            $http({
                url: adminurl + 'AgeGroup/getAll',
                method: 'POST'
            }).then(callback);
        },
        getAllWeights: function (callback) {
            $http({
                url: adminurl + 'Weight/getAll',
                method: 'POST'
            }).then(callback);
        },
        getQuickSportId: function (request, callback) {
            $http({
                url: adminurl + 'match/getQuickSportId',
                method: 'POST',
                data: request
            }).then(callback);
        },
        getSportStandings: function (request, url, callback) {
            $http({
                url: adminurl + url,
                method: 'POST',
                data: request
            }).then(callback);
        },
        getSportSpecificQualifyingRound: function (request, callback) {
            $http({
                url: adminurl + 'match/getSportSpecificRounds',
                method: 'POST',
                data: request
            }).then(callback);
        },
        getSportSpecificRounds: function (request, callback) {

            $http({
                url: adminurl + 'match/getSportSpecificRounds',
                method: 'POST',
                data: request
            }).then(function (data) {
                if (!_.isEmpty(data.data.data.roundsList)) {
                    var knockout = data.data.data;
                    var sportType = knockout.roundsList[0].match[0].sport.sportslist.sportsListSubCategory.sportsListCategory.name;
                    var sportName = knockout.roundsList[0].match[0].sport.sportslist.name;
                    // console.log(sportType, sportName);
                    var resultVar = ResultSportInitialization.getResultVariable(sportName, sportType);
                    // console.log(resultVar);

                    function sortOpponents(arrToSort, match1, match2, key) {
                        // console.log("arrToSort", arrToSort);
                        // console.log("match1", match1);
                        // console.log("match2", match2);
                        // console.log("key", key);

                        _.remove(arrToSort, function (n) {
                            return n == null;
                        });
                        // console.log("match1", match1);
                        // console.log("match2", match2);
                        var sortedArr = _.cloneDeep(arrToSort);

                        if (_.isEmpty(arrToSort)) {
                            // console.log("------------------------------------------");

                            return [{}, {}];
                        } else if (arrToSort.length == 1) {
                            var index = _.findIndex(match1, ["_id", arrToSort[0]._id]);
                            // console.log(index);
                            if (index == -1) {
                                sortedArr[0] = {};
                                sortedArr[1] = arrToSort[0];
                            } else {
                                sortedArr[0] = arrToSort[0];
                                sortedArr[1] = {};
                            }
                            // console.log("sortedArr", sortedArr);
                            // console.log("arrayLength 1");
                            // console.log("------------------------------------------");

                            return sortedArr;
                        } else if (arrToSort.length == 2) {
                            if (_.findIndex(match1, ["_id", arrToSort[0]._id]) == -1) {
                                sortedArr[0] = arrToSort[1];
                                sortedArr[1] = arrToSort[0];
                            } else {
                                sortedArr[0] = arrToSort[0];
                                sortedArr[1] = arrToSort[1];
                            }
                            // console.log("sortedArr", sortedArr);
                            // console.log("arrayLength 2");
                            // console.log("------------------------------------------");

                            return sortedArr;
                        }
                    }
                    _.each(knockout.roundsList, function (round, key) {
                        if (key > 0 && key < 3) {
                            _.each(round.match, function (match, index) {
                                // console.log(match);
                                var match1, match2;

                                if (!($filter('firstcapitalize')(round.name,{column1:true})==='Third Place' && key==2)) {
                                    console.log(round.name,"No Third Place");
                                    if (knockout && knockout.roundsList[key - 1] && knockout.roundsList[key - 1].match[index * 2] && knockout.roundsList[key - 1].match[index * 2][resultVar.opponentsVar]) {
                                        match1 = knockout.roundsList[key - 1].match[index * 2][resultVar.opponentsVar];
                                    }
                                    if (knockout && knockout.roundsList[key - 1] && knockout.roundsList[key - 1].match[index * 2 + 1] && knockout.roundsList[key - 1].match[index * 2][resultVar.opponentsVar]) {
                                        match2 = knockout.roundsList[key - 1].match[index * 2 + 1][resultVar.opponentsVar];
                                    }
                                } else {
                                    console.log(round.name,"Third place");
                                    if (knockout && knockout.roundsList[key - 1] && knockout.roundsList[key - 1].match[index * 2] && knockout.roundsList[key - 1].match[index * 2][resultVar.opponentsVar]) {
                                        match1 = knockout.roundsList[key - 2].match[index * 2][resultVar.opponentsVar];
                                    }
                                    if (knockout && knockout.roundsList[key - 1] && knockout.roundsList[key - 1].match[index * 2 + 1] && knockout.roundsList[key - 1].match[index * 2][resultVar.opponentsVar]) {
                                        match2 = knockout.roundsList[key - 2].match[index * 2 + 1][resultVar.opponentsVar];
                                    }
                                    console.log("match1 match2",match1,match2);
                                }
                                // console.log(match[resultVar.opponentsVar], "resultVar.opponentsVar");
                                match[resultVar.opponentsVar] = sortOpponents(match[resultVar.opponentsVar], match1, match2, key);
                                // console.log(match[resultVar.opponentsVar], "resultVar.opponentsVar");
                            });
                        }
                    });
                    // console.log(data.data.data);
                    callback(data);
                }

            });
        },
        getAllSpotsList: function (callback) {
            $http({
                url: adminurl + 'SportsListSubCategory/getAllSport',
                method: 'POST'
            }).then(callback);
        },
        getAllBySport: function (request, callback) {
            $http({
                url: adminurl + 'SportsList/getAllBySport',
                method: 'POST',
                data: request
            }).then(callback);
        },
        getSportLeagueKnockoutRounds: function (request, callback) {
            $http({
                url: adminurl + 'match/getSportLeagueKnockoutRounds',
                method: 'POST',
                data: request
            }).then(callback);
        },
        getOneSportDetail: function (request, callback) {
            $http({
                url: adminurl + 'sport/getOne',
                method: 'POST',
                data: request
            }).then(callback);
        },
        getQualifyingRound: function (formData, callback) {
            $http({
                url: adminurl + "match/getAllQualifyingPerRound",
                method: "POST",
                data: formData
            }).success(function (data) {
                callback(data)
            });
        },
        updateQualifyingDigital: function (formData, callback) {
            $http({
                url: adminurl + "match/updateQualifyingDigital",
                method: "POST",
                data: formData
            }).success(function (data) {
                callback(data)
            });
        },
        getAthleteForAttendance: function (formData, callback) {
            $http({
                url: adminurl + "Attendence/getAthleteForAttendence",
                method: "POST",
                data: formData
            }).success(function (data) {
                callback(data)
            });
        },
        saveAttendance: function (formData, callback) {
            $http({
                url: adminurl + "Attendence/saveAttendence",
                method: "POST",
                data: formData
            }).success(function (data) {
                callback(data)
            });
        },
        createMatch: function (formData, callback) {
            $http({
                url: adminurl + "Attendence/createMatch",
                method: "POST",
                data: formData
            }).success(function (data) {
                callback(data)
            });
        },
        getPlayersMatchSelection: function (formData, callback) {
            $http({
                url: adminurl + "Attendence/getPlayersMatchSelection",
                method: "POST",
                data: formData
            }).success(function (data) {
                callback(data)
            });
        },
        addQualifyingRoundPlayers: function (formData, callback) {
            $http({
                url: adminurl + "Attendence/addQualifyingRoundPlayers",
                method: "POST",
                data: formData
            }).success(function (data) {
                callback(data)
            });
        },
        getSportSpecificRoundsMatch: function(formData, callback){
          $http({
            url: adminurl + "match/getSportSpecificRounds",
            method: "POST",
            data: formData
          }).success ( function (data){
            callback(data)
          });
        },
        addPlayersToMatch: function(formData, callback){
          $http({
            url: adminurl + 'Attendence/addPlayersToMatch',
            method: 'POST',
            data: formData
          }).success(function(data) {
            callback(data)
          });
        },
        deletePlayerMatch: function(formData, callback){
          $http({
            url: adminurl + 'Attendence/deletePlayerMatch',
            method: 'POST',
            data: formData
          }).success(function(data){
            callback(data)
          });
        },
        deleteMatch: function(formData, callback){
          $http({
            url: adminurl + 'match/delete',
            method: 'POST',
            data: formData
          }).success(function(data){
            callback(data)
          });
        },
        getAthletesByEvent: function (formData, callback) {
            $http({
                url: adminurl + "Weight/getAthletesByEvent",
                method: "POST",
                data: formData
            }).success(function (data) {
                callback(data)
            });
        },
        getWeightsByEvent: function (formData, callback) {
          $http({
            url: adminurl + "Weight/getWeightsByEvent",
            method: "POST",
            data: formData
          }).success(function (data){
            callback(data)
          });
        },
        updateIndividualSport: function(formData, callback){
          $http({
            url: adminurl + "IndividualSport/updateSport",
            method: "POST",
            data: formData
          }).success(function (data){
            callback(data)
          });
        },
        generateWeightMatches: function(formData, callback){
          $http({
            url: adminurl + "Weight/generateMatches",
            method: "POST",
            data: formData
          }).success(function (data){
            callback(data)
          });
        },
        getIndividualPlayers: function(formData, callback){
          $http({
            url: adminurl + "Match/getIndividualPlayers",
            method: "POST",
            data: formData
          }).success(function (data){
            callback(data)
          });
        },
        addPlayersMatch: function(formData, callback){
          $http({
            url: adminurl + "Match/addPlayerToMatch",
            method: "POST",
            data: formData
          }).success(function(data){
            callback(data)
          });
        },

        Boolean: function (str) {
            if (str == 'true' || str || str === true) {
                return true;
            } else {
                return false;
            }
        }
    };
});
