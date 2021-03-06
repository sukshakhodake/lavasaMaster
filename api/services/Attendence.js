var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var uniqueValidator = require('mongoose-unique-validator');
// var timestamps = require('mongoose-timestamp');
var validators = require('mongoose-validators');
var monguurl = require('monguurl');
var autoIncrement = require('mongoose-auto-increment');
var objectid = require("mongodb").ObjectID;
var moment = require('moment');
var request = require("request");
autoIncrement.initialize(mongoose);

var schema = new Schema({
    sport: {
        type: Schema.Types.ObjectId,
        ref: 'Sport'
    },
    attendenceListIndividual: [{
        athleteId: {
            type: Schema.Types.ObjectId,
            ref: 'Athelete'
        },
        athleteName: String,
        sfaId: String,
        schoolName: String,
        attendance: Boolean,
        opponentSingle: {
            type: Schema.Types.ObjectId,
            ref: 'IndividualSport'
        },
        selection: Boolean,
    }],
    attendenceListTeam: [{
        team: {
            type: Schema.Types.ObjectId,
            ref: 'TeamSport'
        },
        teamName: String,
        teamId: String,
        schoolName: String,
        players: [{
            sfaId: String,
            playerName: String
        }],
        attendance: Boolean,
        selection: Boolean,
    }]
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Attendence', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    getAthleteForAttendence: function (data, callback) {
        async.waterfall([
                function (callback) {
                    var test = {};
                    test._id = data.sport;
                    Sport.getOne(test, function (err, found) {
                        if (err || _.isEmpty(found)) {
                            err = "Sport,Event,AgeGroup,Gender may have wrong values";
                            callback(null, {
                                error: err,
                                success: found
                            });
                        } else {
                            console.log("found----->", found);
                            callback(null, found);
                        }
                    });
                },
                function (found, callback) {
                    if (found.error) {
                        callback(null, found);
                    } else if (found.sportslist.sportsListSubCategory.isTeam == true) {
                        StudentTeam.find({
                            sport: data.sport
                        }).deepPopulate("teamId studentId").lean().exec(function (err, studentData) {
                            if (err || _.isEmpty(studentData)) {
                                callback(null, {
                                    error: "No Data Found",
                                    data: data
                                });
                            } else {
                                var complete = {};
                                complete.isTeam = true;
                                complete.attendenceListTeam = [];
                                var teamData = _.groupBy(studentData, 'teamId.name');
                                _.each(teamData, function (teams) {
                                    var team = {};
                                    team.team = teams[0].teamId._id;
                                    team.teamId = teams[0].teamId.teamId;
                                    team.teamName = teams[0].teamId.name;
                                    team.schoolName = teams[0].teamId.schoolName;
                                    team.players = [];
                                    _.each(teams, function (player) {
                                        console.log("player", player);
                                        var member = {};
                                        member.sfaId = player.studentId.sfaId;
                                        if (player.studentId.middleName) {
                                            member.playerName = player.studentId.firstName + " " + player.studentId.middleName + " " + player.studentId.surname;
                                        } else {
                                            member.playerName = player.studentId.firstName + " " + player.studentId.surname;
                                        }
                                        team.players.push(member);
                                    });
                                    team.attendance = false;
                                    team.selection = false;
                                    complete.attendenceListTeam.push(team);
                                });
                                callback(null, complete);
                            }
                        });
                    } else {
                        IndividualSport.find({
                            sport: data.sport
                        }).deepPopulate("athleteId.school").lean().exec(function (err, individualData) {
                            if (err || _.isEmpty(individualData)) {
                                callback(null, {
                                    error: "No data teamData",
                                    data: data
                                });
                            } else {
                                var complete = {};
                                complete.isTeam = false;
                                complete.attendenceListIndividual = [];
                                _.each(individualData, function (n) {
                                    var single = {};
                                    single.athleteId = n.athleteId._id;
                                    if (n.middleName) {
                                        single.athleteName = n.athleteId.firstName + " " + n.athleteId.middleName + " " + n.athleteId.surname;
                                    } else {
                                        single.athleteName = n.athleteId.firstName + " " + n.athleteId.surname;
                                    }
                                    single.sfaId = n.athleteId.sfaId;
                                    if (n.athleteId.atheleteSchoolName) {
                                        single.schoolName = n.athleteId.atheleteSchoolName;
                                    } else {
                                        single.schoolName = n.athleteId.school.name;
                                    }
                                    single.opponentSingle = n._id;
                                    single.attendance = false;
                                    single.selection = false;
                                    complete.attendenceListIndividual.push(single);
                                });
                                callback(null, complete);
                            }
                        });
                    }
                },
                function (complete, callback) {
                    if (complete.error) {
                        callback(null, complete);
                    } else {
                        Attendence.findOne({
                            sport: objectid(data.sport)
                        }).lean().exec(function (err, attendenceData) {
                            if (err || _.isEmpty(attendenceData)) {
                                callback(null, complete);
                            } else {
                                if (complete.isTeam == true) {
                                    var common = {};
                                    common.sport = attendenceData.sport;
                                    common.isTeam = true;
                                    common.attendenceListTeam = attendenceData.attendenceListTeam;

                                } else {
                                    var common = {};
                                    common.sport = attendenceData.sport;
                                    common.isTeam = false;
                                    common.attendenceListIndividual = attendenceData.attendenceListIndividual;
                                }
                                callback(null, common);
                            }
                        });
                    }
                },
            ],
            function (err, data2) {
                if (err) {
                    callback(null, []);
                } else if (data2) {
                    if (_.isEmpty(data2)) {
                        callback(null, data2);
                    } else {
                        callback(null, data2);
                    }
                }
            });
    },

    saveAttendence: function (data, callback) {
        async.waterfall([
                function (callback) {
                    // console.log("data", data);
                    Attendence.findOne({
                        sport: objectid(data.sport)
                    }).lean().exec(function (err, found) {
                        if (err) {
                            callback(null, {
                                error: "data not found"
                            });
                        } else if (found == null) {
                            callback(null, []);
                        } else {
                            callback(null, found);
                        }
                    });
                },
                function (found, callback) {
                    console.log("found", found);
                    if (found.error) {
                        callback(null, found);
                    } else if (_.isEmpty(found)) {
                        if (data.isTeam == true) {
                            var formdata = {};
                            formdata.sport = objectid(data.sport);
                            formdata.attendenceListTeam = data.attendenceListTeam;
                        } else {
                            var formdata = {};
                            formdata.sport = objectid(data.sport);
                            formdata.attendenceListIndividual = data.attendenceListIndividual;
                        }
                        Attendence.saveData(formdata, function (err, complete) {
                            if (err || _.isEmpty(complete)) {
                                callback(err, null);
                            } else {
                                callback(null, complete);
                            }
                        });
                    } else {
                        if (data.isTeam == true) {
                            var formdata = {
                                $set: {
                                    attendenceListTeam: data.attendenceListTeam
                                }
                            };
                            Attendence.update({
                                sport: objectid(data.sport)
                            }, formdata).exec(function (err, updateData) {
                                if (err || _.isEmpty(updateData)) {
                                    callback(null, {
                                        error: "No data found!",
                                        success: data
                                    });
                                } else {
                                    callback(null, updateData);
                                }
                            });
                        } else {
                            console.log("individual", data.attendenceListIndividual);
                            var formdata = {
                                $set: {
                                    attendenceListIndividual: data.attendenceListIndividual
                                }
                            };
                            Attendence.update({
                                sport: objectid(data.sport)
                            }, formdata).exec(function (err, updateData) {
                                if (err || _.isEmpty(updateData)) {
                                    callback(null, {
                                        error: "No data found!",
                                        success: data
                                    });
                                } else {
                                    callback(null, updateData);
                                }
                            });
                        }
                    }
                }
            ],
            function (err, data2) {
                if (err) {
                    callback(null, []);
                } else if (data2) {
                    if (_.isEmpty(data2)) {
                        callback(null, data2);
                    } else {
                        callback(null, data2);
                    }
                }
            });

    },

    getPlayersMatchSelection: function (data, callback) {
        async.waterfall([
                function (callback) {
                    var test = {};
                    test._id = data.sport;
                    Sport.getOne(test, function (err, found) {
                        if (err || _.isEmpty(found)) {
                            err = "Sport,Event,AgeGroup,Gender may have wrong values";
                            callback(null, {
                                error: err,
                                success: found
                            });
                        } else {
                            callback(null, found);
                        }
                    });
                },
                function (found, callback) {
                    if (found.error) {
                        callback(null, found);
                    } else if (found.sportslist.sportsListSubCategory.isTeam == true) {
                        Attendence.findOne({
                            sport: data.sport
                        }).lean().exec(function (err, teamData) {
                            if (err || _.isEmpty(teamData)) {
                                callback(null, {
                                    error: "No Data found",
                                    data: data
                                });
                            } else {
                                var team = _.filter(teamData.attendenceListTeam, function (o) {
                                    return o.attendance == true;
                                });
                                var teamForSelection = _.filter(team, function (o) {
                                    return o.selection == false;
                                });
                                callback(null, teamForSelection);
                            }
                        });
                    } else {
                        Attendence.findOne({
                            sport: data.sport
                        }).lean().exec(function (err, individualData) {
                            if (err || _.isEmpty(individualData)) {
                                callback(null, {
                                    error: "No Data Found",
                                    data: data
                                });
                            } else {
                                var single = _.filter(individualData.attendenceListIndividual, function (o) {
                                    return o.attendance == true;
                                });
                                var singleForSelection = _.filter(single, function (o) {
                                    return o.selection == false;
                                });
                                callback(null, singleForSelection);
                            }
                        });
                    }
                },
            ],
            function (err, data2) {
                if (err) {
                    callback(null, []);
                } else if (data2) {
                    if (_.isEmpty(data2)) {
                        callback(null, data2);
                    } else {
                        callback(null, data2);
                    }
                }
            });
    },

    createMatchHeat: function (data, callback) {
        async.waterfall([
                function (callback) {
                    Attendence.updateMatchPrefix(data, function (err, found) {
                        if (err || _.isEmpty(found)) {
                            err = "Headers may have wrong values";
                            callback(null, {
                                error: err,
                                success: found
                            });
                        } else {
                            console.log("found----->", found);
                            callback(null, found);
                        }
                    });
                },
                function (found, callback) {
                    if (data.round) {
                        Match.findOne({
                            sport: objectid(data.sport),
                            round: data.round
                        }).sort({
                            createdAt: -1
                        }).lean().exec(function (err, matchData) {
                            if (err) {
                                callback(null, {
                                    error: "No data Found"
                                });
                            } else if (_.isEmpty(matchData)) {
                                var formData = {};
                                formData.sport = data.sport;
                                if (!found.matchPrefix) {
                                    formData.matchId = data.prefix;
                                } else {
                                    formData.matchId = found.matchPrefix;
                                }
                                formData.round = data.round;
                                formData.heatNo = 1;
                                callback(null, formData);
                            } else {
                                var formData = {};
                                formData.sport = data.sport;
                                if (!found.matchPrefix) {
                                    formData.matchId = data.prefix;
                                } else {
                                    formData.matchId = found.matchPrefix;
                                }
                                if (data.round) {
                                    formData.round = data.round;
                                    if (data.round != matchData.round) {
                                        formData.heatNo = 1;
                                    } else {
                                        formData.heatNo = ++matchData.heatNo;
                                    }
                                } else {
                                    formData.round = matchData.round;
                                    formData.heatNo = ++matchData.heatNo;
                                }
                                callback(null, formData);
                            }
                        });

                    } else {
                        callback(null, "round not found");
                    }
                },
                function (formData, callback) {
                    Match.saveMatch(formData, function (err, complete) {
                        if (err || _.isEmpty(complete)) {
                            callback(err, null);
                        } else {
                            callback(null, complete);
                        }
                    });
                },
            ],
            function (err, data2) {
                if (err) {
                    callback(null, []);
                } else if (data2) {
                    if (_.isEmpty(data2)) {
                        callback(null, data2);
                    } else {
                        callback(null, data2);
                    }
                }
            });
    },

    createMatchQualifying: function (data, callback) {
        async.waterfall([
                function (callback) {
                    Attendence.updateMatchPrefix(data, function (err, found) {
                        if (err || _.isEmpty(found)) {
                            err = "Headers may have wrong values";
                            callback(null, {
                                error: err,
                                success: found
                            });
                        } else {
                            callback(null, found);
                        }
                    });
                },
                function (found, callback) {
                    Match.findOne({
                        sport: objectid(data.sport)
                    }).sort({
                        createdAt: -1
                    }).lean().exec(function (err, matchData) {
                        if (err) {
                            callback(null, {
                                error: "No data Found"
                            });
                        } else if (_.isEmpty(matchData)) {
                            Attendence.saveQualifyingMultiplePlayers(found, data, function (err, complete) {
                                console.log("complete", complete);
                                if (err || _.isEmpty(complete)) {
                                    err = "Headers may have wrong values";
                                    callback(null, {
                                        error: err,
                                        success: complete
                                    });
                                } else {
                                    callback(null, complete);
                                }
                            });
                        } else {
                            if (data.matchId) {
                                var formData = {};
                                formData.opponentsSingle = [];
                                if (!_.isEmpty(data.players)) {
                                    formData.opponentsSingle.push(data.players[0].opponentSingle);
                                }
                                Match.update({
                                    matchId: data.matchId
                                }, formData).exec(function (err, updateData) {
                                    if (err || _.isEmpty(updateData)) {
                                        callback(null, {
                                            error: "No data found!",
                                            success: data
                                        });
                                    } else {
                                        callback(null, updateData);
                                    }
                                });
                            } else {
                                var formData = {};
                                formData.sport = data.sport;
                                if (!found.matchPrefix) {
                                    formData.matchId = data.prefix;
                                } else {
                                    formData.matchId = found.matchPrefix;
                                }
                                formData.round = data.round;
                                formData.opponentsSingle = [];
                                Match.saveMatch(formData, function (err, complete) {
                                    if (err || _.isEmpty(complete)) {
                                        callback(err, null);
                                    } else {
                                        callback(null, complete);
                                    }
                                });
                            }
                        }
                    });
                },
            ],
            function (err, data2) {
                if (err) {
                    callback(null, []);
                } else if (data2) {
                    if (_.isEmpty(data2)) {
                        callback(null, data2);
                    } else {
                        callback(null, data2);
                    }
                }
            });
    },

    saveQualifyingMultiplePlayers: function (found, data, callback) {
        async.waterfall([
                function (callback) {
                    Attendence.getPlayersMatchSelection(data, function (err, playersData) {
                        if (err || _.isEmpty(playersData)) {
                            err = "Sport,Event,AgeGroup,Gender may have wrong values";
                            callback(null, {
                                error: err,
                                success: playersData
                            });
                        } else {

                            callback(null, playersData);
                        }
                    });
                },
                function (playersData, callback) {
                    async.concatSeries(playersData, function (n, callback) {
                        console.log("n", n);
                        var formData = {};
                        formData.sport = data.sport;
                        if (!found.matchPrefix) {
                            formData.matchId = data.prefix;
                        } else {
                            formData.matchId = found.matchPrefix;
                        }
                        formData.round = data.round;
                        formData.opponentsSingle = [];
                        formData.opponentsSingle.push(n.opponentSingle);
                        console.log("formData", formData);
                        Match.saveMatch(formData, function (err, complete) {
                            if (err || _.isEmpty(complete)) {
                                callback(err, null);
                            } else {
                                callback(null, complete);
                            }
                        });
                    }, function (err, final) {
                        console.log("final", final);
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, final);
                        }
                    });
                },
            ],
            function (err, data2) {
                if (err) {
                    callback(null, []);
                } else if (data2) {
                    if (_.isEmpty(data2)) {
                        callback(null, data2);
                    } else {
                        callback(null, data2);
                    }
                }
            });

    },

    addQualifyingRoundPlayers: function (data, callback) {
        var lastRound = data.roundsListName[data.roundsListName.length - 2];
        Match.find({
            sport: objectid(data.sport),
            resultQualifyingRound: {
                $exists: true
            },
            round: lastRound
        }, {
            opponentsSingle: 1,
            resultQualifyingRound: 1,
        }).deepPopulate("opponentsSingle.athleteId").lean().exec(function (err, matchData) {
            if (err || _.isEmpty(matchData)) {
                callback(null, {
                    error: "No data Found"
                });
            } else {
                var playerList = [];
                _.each(matchData, function (n) {
                    console.log("qualifying", n.resultQualifyingRound.player);
                    if (n.resultQualifyingRound.player.result == "QF" || n.resultQualifyingRound.player.result == "qf") {
                        var formData = {};
                        if (n.resultQualifyingRound.player.bestAttempt) {
                            formData.bestAttempt = n.resultQualifyingRound.player.bestAttempt;
                        }
                        formData.attempt = n.resultQualifyingRound.player.attempt;
                        formData.athleteId = n.opponentsSingle[0].athleteId;
                        formData.opponentSingle = n.opponentsSingle[0]._id;
                        playerList.push(formData);
                    }
                });
                callback(null, playerList);
            }
        });
    },

    updateMatchPrefix: function (data, callback) {
        async.waterfall([
                function (callback) {
                    var test = {};
                    test._id = objectid(data.sport);
                    Sport.getOne(test, function (err, found) {
                        if (err || _.isEmpty(found)) {
                            err = "Sport,Event,AgeGroup,Gender may have wrong values";
                            callback(null, {
                                error: err,
                                success: found
                            });
                        } else {
                            console.log("found----->", found);
                            callback(null, found);
                        }
                    });
                },
                function (found, callback) {
                    if (found.error) {
                        callback(null, found);
                    } else if (found.matchPrefix) {
                        callback(null, found);
                    } else {
                        var formData = {
                            $set: {
                                matchPrefix: data.prefix
                            }
                        };
                        Sport.update({
                            _id: objectid(data.sport)
                        }, formData).exec(function (err, updateData) {
                            if (err || _.isEmpty(updateData)) {
                                callback(null, {
                                    error: "No data found!",
                                    success: data
                                });
                            } else {
                                callback(null, found);
                            }
                        });
                    }
                },
            ],
            function (err, data2) {
                if (err) {
                    callback(null, []);
                } else if (data2) {
                    if (_.isEmpty(data2)) {
                        callback(null, data2);
                    } else {
                        callback(null, data2);
                    }
                }
            });
    },

    addPlayersToMatch: function (data, callback) {
        async.waterfall([
                function (callback) {
                    var test = {};
                    test._id = objectid(data.sport);
                    Sport.getOne(test, function (err, found) {
                        if (err || _.isEmpty(found)) {
                            err = "Sport,Event,AgeGroup,Gender may have wrong values";
                            callback(null, {
                                error: err,
                                success: found
                            });
                        } else {
                            callback(null, found);
                        }
                    });
                },
                function (found, callback) {
                    if (found.error) {
                        callback(null, found);
                    } else if (found.sportslist.sportsListSubCategory.isTeam == true) {
                        Match.findOne({
                            matchId: data.matchId
                        }).exec(function (err, matchData) {
                            if (err || _.isEmpty(matchData)) {
                                callback(null, {
                                    error: "No data found!",
                                    success: data
                                });
                            } else {
                                var final = {};
                                final.opponents = matchData.opponentsTeam;
                                if (matchData.resultHeat) {
                                    final.teams = matchData.resultHeat.teams;
                                }
                                final.isTeam = true;
                                callback(null, final);
                            }
                        });
                    } else {
                        Match.findOne({
                            matchId: data.matchId
                        }).exec(function (err, matchData) {
                            if (err || _.isEmpty(matchData)) {
                                callback(null, {
                                    error: "No data found!",
                                    success: data
                                });
                            } else {
                                var final = {};
                                final.opponents = matchData.opponentsSingle;
                                if (matchData.resultHeat) {
                                    final.players = matchData.resultHeat.players;
                                }
                                final.isTeam = false;
                                callback(null, final);
                            }
                        });
                    }
                },
                function (final, callback) {
                    if (final.error) {
                        callback(null, final);
                    } else if (final.isTeam == true) {
                        var opponets = final.opponets;
                        var result = {};
                        result.teams = final.teams;
                        _.each(data.players, function (n) {
                            opponets.push(n.team);
                            var player = {};
                            player.id = n.team;
                            player.laneNo = n.laneNo;
                            result.teams.push(player);
                        });
                        if (!_.isEmpty(final.teams)) {
                            var players = [].concat.apply([], [
                                final.teams,
                                result.teams,
                            ]);
                            result.players = players;
                        }
                        var formData = {
                            $set: {
                                opponentsTeam: opponets,
                                resultHeat: result

                            }
                        };
                        Match.update({
                            matchId: data.matchId
                        }, formData).exec(function (err, updateData) {
                            if (err || _.isEmpty(updateData)) {
                                callback(null, {
                                    error: "No data found!",
                                    success: data
                                });
                            } else {
                                callback(null, final);
                            }
                        });
                    } else {
                        var opponets = final.opponents;
                        var result = {};
                        result.players = [];
                        _.each(data.players, function (n) {
                            opponets.push(n.opponentSingle);
                            var player = {};
                            player.id = n.opponentSingle;
                            player.laneNo = n.laneNo;
                            result.players.push(player);
                        });
                        if (!_.isEmpty(final.players)) {
                            var players = [].concat.apply([], [
                                final.players,
                                result.players,
                            ]);
                            result.players = players;
                        }
                        var formData = {
                            $set: {
                                opponentsSingle: opponets,
                                resultHeat: result
                            }
                        };
                        Match.update({
                            matchId: data.matchId
                        }, formData).exec(function (err, updateData) {
                            if (err || _.isEmpty(updateData)) {
                                callback(null, {
                                    error: "No data found!",
                                    success: data
                                });
                            } else {
                                callback(null, final);
                            }
                        });
                    }
                },
                function (final, callback) {
                    if (final.error) {
                        callback(null, final);
                    } else if (final.isTeam == true) {
                        async.eachSeries(data.players, function (n, callback) {
                            Attendence.findOne({
                                sport: data.sport
                            }).exec(function (err, attendanceData) {
                                if (err || _.isEmpty(attendanceData)) {
                                    callback(null, {
                                        error: "No data found!",
                                        success: data
                                    });
                                } else {
                                    console.log("attendanceData", attendanceData);
                                    var attendenceListTeam = _.find(attendanceData.attendenceListTeam, function (o) {
                                        if (o.team.toString() === n.team) {
                                            return o;
                                        }
                                    });
                                    console.log("attendenceListTeam", attendenceListTeam);
                                    attendenceListTeam.selection = true;
                                    console.log("attendanceData.attendenceListTeam", attendanceData.attendenceListTeam);
                                    var matchObj = {
                                        $set: {
                                            attendenceListTeam: attendanceData.attendenceListTeam
                                        }
                                    };
                                    Attendence.update({
                                        sport: data.sport,
                                    }, matchObj).exec(
                                        function (err, match) {
                                            console.log("match", match);
                                            callback(null, match);
                                        });
                                }
                            });
                            console.log("n of team", n);
                        }, function (err) {
                            callback(null, "Updated Successfully");
                        });
                        // callback(null, final);
                    } else {
                        async.eachSeries(data.players, function (n, callback) {
                            Attendence.findOne({
                                sport: data.sport
                            }).exec(function (err, attendanceData) {
                                if (err || _.isEmpty(attendanceData)) {
                                    callback(null, {
                                        error: "No data found!",
                                        success: data
                                    });
                                } else {
                                    console.log("attendanceData", attendanceData);
                                    var attendenceListIndividual = _.find(attendanceData.attendenceListIndividual, function (o) {
                                        if (o.opponentSingle.toString() === n.opponentSingle) {
                                            return o;
                                        }
                                    });
                                    console.log("attendenceListIndividual", attendenceListIndividual);
                                    attendenceListIndividual.selection = true;
                                    console.log("attendanceData.attendenceListIndividual", attendanceData.attendenceListIndividual);
                                    var matchObj = {
                                        $set: {
                                            attendenceListIndividual: attendanceData.attendenceListIndividual
                                        }
                                    };
                                    Attendence.update({
                                        sport: data.sport,
                                    }, matchObj).exec(
                                        function (err, match) {
                                            console.log("match", match);
                                            callback(null, match);
                                        });
                                }
                            });
                            console.log("n of team", n);
                        }, function (err) {
                            callback(null, "Updated Successfully");
                        });
                        // callback(null, final);
                    }
                },
            ],
            function (err, data2) {
                if (err) {
                    callback(null, []);
                } else if (data2) {
                    if (_.isEmpty(data2)) {
                        callback(null, data2);
                    } else {
                        callback(null, data2);
                    }
                }
            });
    },

    deletePlayerMatch: function (data, callback) {
        async.waterfall([
                function (callback) {
                    Match.findOne({
                        matchId: data.matchId
                    }).exec(function (err, matchData) {
                        if (err || _.isEmpty(matchData)) {
                            callback(null, {
                                error: "No data found!",
                                success: data
                            });
                        } else {
                            if (data.isTeam == true) {
                                var team = [];
                                for (var i = 0, l = matchData.opponentsTeam.length; i < l; i++) {
                                    if (matchData.opponentsTeam[i].toString() !== data.team) {
                                        team.push(matchData.opponentsTeam[i]);
                                    }
                                }
                                var matchObj = {
                                    $set: {
                                        opponentsTeam: team
                                    }
                                };
                                Match.update({
                                    matchId: data.matchId
                                }, matchObj).exec(
                                    function (err, match) {
                                        callback(null, match);
                                    });
                            } else {
                                var single = [];
                                for (var i = 0, l = matchData.opponentsSingle.length; i < l; i++) {
                                    if (matchData.opponentsSingle[i].toString() !== data.opponentSingle) {
                                        single.push(matchData.opponentsSingle[i]);
                                    }
                                }
                                var matchObj = {
                                    $set: {
                                        opponentsSingle: single
                                    }
                                };
                                Match.update({
                                    matchId: data.matchId
                                }, matchObj).exec(
                                    function (err, match) {
                                        callback(null, match);
                                    });
                            }
                        }
                    });
                },
                function (match, callback) {
                    Match.findOne({
                        matchId: data.matchId
                    }).deepPopulate("opponentsSingle.athleteId opponentsTeam.studentTeam.studentId").exec(function (err, matchData) {
                        if (err || _.isEmpty(matchData)) {
                            callback(null, {
                                error: "No data found!",
                                success: data
                            });
                        } else {
                            callback(null, matchData);
                        }
                    });
                },
                function (matchData, callback) {
                    Attendence.findOne({
                        sport: matchData.sport
                    }).exec(function (err, attendanceData) {
                        if (err || _.isEmpty(attendanceData)) {
                            callback(null, {
                                error: "No data found!",
                                success: data
                            });
                        } else {
                            if (data.isTeam == true) {
                                console.log("attendanceData", attendanceData);
                                var attendenceListTeam = _.find(attendanceData.attendenceListTeam, function (o) {
                                    if (o.team.toString() === data.team) {
                                        return o;
                                    }
                                });
                                attendenceListTeam.selection = false;
                                var matchObj = {
                                    $set: {
                                        attendenceListTeam: attendanceData.attendenceListTeam
                                    }
                                };
                            } else {
                                var attendenceListIndividual = _.find(attendanceData.attendenceListIndividual, function (o) {
                                    if (o.opponentSingle.toString() === data.opponentSingle) {
                                        return o;
                                    }
                                });
                                attendenceListIndividual.selection = false;
                                var matchObj = {
                                    $set: {
                                        attendenceListIndividual: attendanceData.attendenceListIndividual
                                    }
                                };
                            }
                            Attendence.update({
                                sport: matchData.sport,
                            }, matchObj).exec(
                                function (err, match) {
                                    callback(null, matchData);
                                });
                        }
                    });
                }
            ],
            function (err, data2) {
                if (err) {
                    callback(null, []);
                } else if (data2) {
                    if (_.isEmpty(data2)) {
                        callback(null, data2);
                    } else {
                        callback(null, data2);
                    }
                }
            });
    },

};
module.exports = _.assign(module.exports, exports, model);