var moment = require('moment');

var schema = new Schema({
    athlete: {
        type: Schema.Types.ObjectId,
        ref: 'Athelete',
        index: true
    },
    school: {
        type: Schema.Types.ObjectId,
        ref: 'Registration',
        index: true
    },
    coupon: {
        type: Schema.Types.ObjectId,
        ref: 'CouponCode',
        index: true
    },
    transaction: [{
        type: Schema.Types.ObjectId,
        ref: 'Transaction',
        index: true
    }],
    totalToPay: {
        type: Number,
        default: 0
    },
    totalPaid: {
        type: Number,
        default: 0
    },
    outstandingAmount: {
        type: Number,
        default: 0
    },
    PayuId: [{
        type: String
    }],
    accountType: String,
    paymentMode: String,
    receiptId: [{
        type: String,
    }],
    discount: {
        type: Number,
        default: 0
    },
    sgst: {
        type: Number,
        default: 0
    },
    cgst: {
        type: Number,
        default: 0
    },
    igst: {
        type: Number,
        default: 0
    },
    checkNo: [{
        type: String,
    }],
    remarks: String,
    upgrade: Boolean,
    upgradePaymentStatus: String,
    refundAmount: {
        type: Number,
        default: 0
    },

});

schema.plugin(deepPopulate, {
    populate: {
        "athlete": {
            select: '_id sfaId status year email mobile registrationFee firstName middleName surname school paymentStatus package atheleteSchoolName transactionID receiptId'
        },
        "athlete.school": {
            select: ''
        },
        "school": {
            select: '_id schoolName schoolType schoolCategory year paymentStatus status sfaID package receiptId email mobile gstNo'
        },
        "school.package": {
            select: ''
        },
        "transaction": {
            select: ''
        },
        "transaction.package": {
            select: ''
        },
        "coupon": {
            select: ''
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Accounts', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    getSearchAggregatePipeline: function (data) {
        var pipeline = [ // Stage 1
            {
                $lookup: {
                    "from": "atheletes",
                    "localField": "athlete",
                    "foreignField": "_id",
                    "as": "athlete"
                }
            },

            // Stage 2
            {
                $unwind: {
                    path: "$athlete",
                }
            },
            {
                $lookup: {
                    "from": "couponcodes",
                    "localField": "coupon",
                    "foreignField": "_id",
                    "as": "coupon"
                }
            },
            // Stage 2
            {
                $unwind: {
                    path: "$coupon",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $lookup: {
                    "from": "couponcodes",
                    "localField": "athlete.coupon",
                    "foreignField": "_id",
                    "as": "athlete.coupon"
                }
            },
            // Stage 2
            {
                $unwind: {
                    path: "$athlete.coupon",
                    preserveNullAndEmptyArrays: true
                }
            },



            // Stage 3
            {
                $lookup: {
                    "from": "transactions",
                    "localField": "transaction",
                    "foreignField": "_id",
                    "as": "transaction"
                }
            },
            {
                $match: {
                    transaction: {
                        $exists: true,
                        $not: {
                            $size: 0
                        }
                    }
                }
            },
            {
                $match: {
                    $nor: [{
                        $and: [{
                            paymentMode: {
                                $ne: "online PAYU"
                            }
                        }, {
                            paymentMode: {
                                $eq: "online PAYU"
                            }
                        }]
                    }, {
                        $and: [{
                            PayuId: {
                                $exists: true,
                                $size: 0
                            }
                        }, {
                            PayuId: {
                                $exists: true,
                                $not: {
                                    $size: 0
                                }
                            }
                        }]

                    }]

                }
            },
            {
                $sort: {
                    "createdAt": -1
                }
            },
        ];
        return pipeline;
    },

    getSearchAggregatePipelineAthlete: function (data) {
        var pipeline = [ // Stage 1
            {
                $lookup: {
                    "from": "atheletes",
                    "localField": "athlete",
                    "foreignField": "_id",
                    "as": "athlete"
                }
            },
            {
                $lookup: {
                    "from": "couponcodes",
                    "localField": "coupon",
                    "foreignField": "_id",
                    "as": "coupon"
                }
            },

            // Stage 2
            {
                $unwind: {
                    path: "$coupon",
                    preserveNullAndEmptyArrays: true
                }
            },
            // Stage 2
            {
                $unwind: {
                    path: "$athlete",
                }
            },
            {
                $lookup: {
                    "from": "couponcodes",
                    "localField": "athlete.coupon",
                    "foreignField": "_id",
                    "as": "athlete.coupon"
                }
            },
            // Stage 2
            {
                $unwind: {
                    path: "$athlete.coupon",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    "from": "transactions",
                    "localField": "transaction",
                    "foreignField": "_id",
                    "as": "transaction"
                }
            },
            // Stage 3
            {
                $match: {

                    $or: [{
                        "athlete.firstName": {
                            $regex: data.keyword,
                            $options: "i"
                        }
                    }, {
                        "athlete.middleName": {
                            $regex: data.keyword,
                            $options: "i"
                        }
                    }, {
                        "athlete.surname": {
                            $regex: data.keyword,
                            $options: "i"
                        }
                    }, {
                        "athlete.sfaId": {
                            $regex: data.keyword,
                            $options: "i"
                        }
                    }]

                }
            },
            {
                $sort: {
                    "createdAt": -1
                }
            }
        ];
        return pipeline;
    },

    getAggregatePipelineSchool: function (data) {
        var pipeline = [ // Stage 1
            {
                $lookup: {
                    "from": "registrations",
                    "localField": "school",
                    "foreignField": "_id",
                    "as": "school"
                }
            },
            {
                $lookup: {
                    "from": "couponcodes",
                    "localField": "coupon",
                    "foreignField": "_id",
                    "as": "coupon"
                }
            },

            // Stage 2
            {
                $unwind: {
                    path: "$coupon",
                    preserveNullAndEmptyArrays: true
                }
            },
            // Stage 2
            {
                $unwind: {
                    path: "$school",
                }
            },
            // Stage 3
            // Stage 3
            {
                $lookup: {
                    "from": "transactions",
                    "localField": "transaction",
                    "foreignField": "_id",
                    "as": "transaction"
                }
            },

            // Stage 4
            {
                $match: {

                    $or: [{
                            transaction: {
                                $gt: 1
                            }
                        },
                        {
                            "transaction.paymentMode": {
                                $ne: "online PAYU"
                            }
                        }, {
                            "transaction.paymentStatus": {
                                $ne: "Pending"
                            }
                        }
                    ]

                }
            },
            {
                $sort: {
                    "createdAt": -1
                }
            }
        ];
        return pipeline;
    },

    getFilterAggregatePipelineSchool: function (data) {
        var pipeline = [ // Stage 1
            {
                $lookup: {
                    "from": "registrations",
                    "localField": "school",
                    "foreignField": "_id",
                    "as": "school"
                }
            },
            {
                $unwind: {
                    path: "$athlete",
                }
            },
            // Stage 2
            {
                $lookup: {
                    "from": "couponcodes",
                    "localField": "coupon",
                    "foreignField": "_id",
                    "as": "coupon"
                }
            },

            // Stage 2
            {
                $unwind: {
                    path: "$coupon",
                }
            },

            {
                $lookup: {
                    "from": "transactions",
                    "localField": "transaction",
                    "foreignField": "_id",
                    "as": "transaction"
                }
            },
            // Stage 3
            {
                $match: {

                    $or: [{
                        "school.schoolName": {
                            $regex: data.keyword,
                            $options: "i"
                        }
                    }, {
                        "school.sfaID": {
                            $regex: data.keyword,
                            $options: "i"
                        }
                    }]

                }
            },
            {
                $sort: {
                    "createdAt": -1
                }
            }
        ];
        return pipeline;
    },

    getAthleteAccount: function (data, callback) {
        var Model = this;
        var Const = this(data);
        var maxRow = Config.maxRow;

        var page = 1;
        if (data.page) {
            page = data.page;
        }
        var field = data.field;
        var options = {
            field: data.field,
            filters: {
                keyword: {
                    fields: ['name'],
                    term: data.keyword
                }
            },
            sort: {
                desc: 'createdAt'
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };
        if (data.keyword == "") {
            var count = 0;
            var pipeLine = Accounts.getSearchAggregatePipeline(data);
            var newPipeLine = _.cloneDeep(pipeLine);
            Accounts.aggregate(pipeLine, function (err, matchData) {
                if (err) {
                    callback(err, null);
                } else {
                    newPipeLine.push({
                        $skip: options.start
                    }, {
                        $limit: options.count
                    });
                    Accounts.aggregate(newPipeLine, function (err, returnReq) {
                        if (err) {
                            console.log(err);
                            callback(err, "error in mongoose");
                        } else {
                            if (_.isEmpty(returnReq)) {
                                callback(null, []);
                            } else {
                                count = matchData.length;
                                console.log("count", count);
                                var data = {};
                                data.options = options;
                                data.results = returnReq;
                                data.total = count;
                                callback(null, data);
                            }
                        }
                    });
                }
            });
        } else {
            var pipeLine = Accounts.getSearchAggregatePipelineAthlete(data);
            var newPipeLine = _.cloneDeep(pipeLine);
            Accounts.aggregate(pipeLine, function (err, matchData) {
                if (err) {
                    callback(err, null);
                } else {
                    newPipeLine.push({
                        $skip: options.start
                    }, {
                        $limit: options.count
                    });
                    Accounts.aggregate(newPipeLine, function (err, returnReq) {
                        if (err) {
                            console.log(err);
                            callback(err, "error in mongoose");
                        } else {
                            if (_.isEmpty(returnReq)) {
                                callback(null, []);
                            } else {
                                count = matchData.length;
                                console.log("count", count);
                                var data = {};
                                data.options = options;
                                data.results = returnReq;
                                data.total = count;
                                callback(null, data);
                            }
                        }
                    });
                }
            });

        }
    },

    getSchoolAccount: function (data, callback) {

        var Model = this;
        var Const = this(data);
        var maxRow = Config.maxRow;

        var page = 1;
        if (data.page) {
            page = data.page;
        }
        var field = data.field;
        var options = {
            field: data.field,
            filters: {
                keyword: {
                    fields: ['name'],
                    term: data.keyword
                }
            },
            sort: {
                desc: 'createdAt'
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };
        if (data.keyword == "") {
            var count = 0;
            var pipeLine = Accounts.getAggregatePipelineSchool(data);
            var newPipeLine = _.cloneDeep(pipeLine);
            Accounts.aggregate(pipeLine, function (err, matchData) {
                if (err) {
                    callback(err, null);
                } else {
                    newPipeLine.push({
                        $skip: options.start
                    }, {
                        $limit: options.count
                    });
                    Accounts.aggregate(newPipeLine, function (err, returnReq) {
                        if (err) {
                            console.log(err);
                            callback(err, "error in mongoose");
                        } else {
                            if (_.isEmpty(returnReq)) {
                                callback(null, []);
                            } else {
                                count = matchData.length;
                                // console.log("count", count);
                                var data = {};
                                data.options = options;
                                data.results = returnReq;
                                data.total = count;
                                callback(null, data);
                            }
                        }
                    });
                }
            });
        } else {
            var count = 0;
            var pipeLine = Accounts.getFilterAggregatePipelineSchool(data);
            var newPipeLine = _.cloneDeep(pipeLine);
            Accounts.aggregate(pipeLine, function (err, matchData) {
                if (err) {
                    callback(err, null);
                } else {
                    newPipeLine.push({
                        $skip: options.start
                    }, {
                        $limit: options.count
                    });
                    Accounts.aggregate(newPipeLine, function (err, returnReq) {
                        if (err) {
                            console.log(err);
                            callback(err, "error in mongoose");
                        } else {
                            if (_.isEmpty(returnReq)) {
                                callback(null, []);
                            } else {
                                count = matchData.length;
                                console.log("count", count);
                                var data = {};
                                data.options = options;
                                data.results = returnReq;
                                data.total = count;
                                callback(null, data);
                            }
                        }
                    });
                }
            });
        }
    },

    getAccount: function (data, callback) {
        Accounts.findOne({
            _id: data._id
        }).lean().deepPopulate('athlete school athlete.school transaction transaction.package coupon').exec(
            function (err, found) {
                if (err) {
                    callback(err, null);
                } else if (_.isEmpty(found)) {
                    callback("Empty Data", null);
                } else {
                    found.display = {};
                    found.display.paymentMode = found.paymentMode;
                    found.display.payuId = found.PayuId;
                    found.display.AmountPaid = found.totalPaid;
                    found.display.AmountToPay = found.totalToPay;
                    found.display.outstandingAmount = found.outstandingAmount;
                    found.display.igst = found.igst;
                    found.display.sgst = found.sgst;
                    found.display.cgst = found.cgst;
                    found.display.refundAmount = found.refundAmount;
                    found.display.discount = found.discount;
                    found.display.receiptId = found.receiptId;
                    if (found.remarks) {
                        found.display.remarks = found.remarks;
                    }
                    if (found.checkNo) {
                        found.display.checkNo = found.checkNo;
                    }
                    if (found.school) {
                        found.display.verified = found.school.status;
                    } else {
                        found.display.verified = found.athlete.status;
                    }
                    var i = 1;
                    _.each(found.transaction, function (n) {
                        found.display["package" + i] = {};
                        found.display["package" + i].name = n.package.name;
                        found.display["package" + i].date = n.createdAt;
                        found.display["package" + i].dateOfTransaction = n.dateOfTransaction;
                        found.display["package" + i].user = n.package.packageUser;
                        found.display["package" + i].amount = n.package.finalPrice;
                        i++;
                    });

                    callback(null, found);
                }
            });
    },

    getStatus: function (data, callback) {
        Accounts.findOne({
            $or: [{
                athlete: data._id
            }, {
                school: data._id
            }]
        }, 'outstandingAmount upgradePaymentStatus refundAmount totalPaid totalToPay igst cgst sgst athlete school transaction').lean().deepPopulate("athlete school transaction").exec(
            function (err, found) {
                if (err) {
                    callback(err, null);
                } else if (_.isEmpty(found)) {
                    callback("Empty Data", null);
                } else {
                    callback(null, found);
                }
            });
    },

    upgradeAccount: function (data, callback) {
        // console.log("data", data);
        async.waterfall([
                function (callback) {
                    if (data.athlete) {
                        Accounts.removeTransactionAndUpdateAthlete(data, function (err, vData) {
                            if (err || _.isEmpty(vData)) {
                                callback(null, {
                                    error: "no data found",
                                    data: found
                                });
                            } else {
                                callback(null, vData);
                            }
                        });
                    } else {
                        Accounts.removeTransactionAndUpdateSchool(data, function (err, vData) {
                            if (err || _.isEmpty(vData)) {
                                callback(null, {
                                    error: "no data found",
                                    data: found
                                });
                            } else {
                                callback(null, vData);
                            }
                        });
                    }
                },
                function (found, callback) {
                    var param = {};
                    if (data.athlete) {
                        param.athlete = data.athlete;
                        param.school = undefined;
                    } else {
                        param.school = data.school;
                        param.athlete = undefined;
                    }
                    param.package = data.package;
                    param.outstandingAmount = data.amountPaid;
                    param.paymentMode = data.registrationFee;
                    param.cgstAmount = data.cgstAmt;
                    param.sgstAmount = data.sgstAmt;
                    param.igstAmount = data.igstAmt;
                    param.paymentStatus = "Pending";
                    Transaction.saveData(param, function (err, transactData) {
                        if (err || _.isEmpty(transactData)) {
                            callback(null, {
                                error: "no data found",
                                data: data
                            });
                        } else {
                            callback(null, transactData);
                        }
                    });

                },
                function (transactData, callback) {
                    console.log("transactData", transactData, "data", data);
                    if (data.athlete) {
                        Accounts.findOne({
                            athlete: data.athlete
                        }).lean().exec(function (err, accountsData) {
                            if (err) {
                                callback(err, null);
                            } else if (_.isEmpty(accountsData)) {
                                callback(null, accountsData);
                            } else {
                                var check = false;
                                _.each(accountsData.transaction, function (n) {
                                    if (n.equals(transactData._id)) {
                                        check = true;
                                    }
                                })
                                var transaction = [];
                                if (check == false) {
                                    transaction.push(transactData._id);
                                }
                                transaction = _.concat(accountsData.transaction, transaction);
                                var matchObj = {
                                    $set: {
                                        sgst: data.sgstAmt,
                                        cgst: data.cgstAmt,
                                        igst: data.igstAmt,
                                        outstandingAmount: data.amountPaid,
                                        transaction: transaction,
                                        upgradePaymentStatus: "Pending",
                                        upgrade: true
                                    }
                                };
                                Accounts.update({
                                    athlete: data.athlete
                                }, matchObj).exec(
                                    function (err, data3) {
                                        if (err) {
                                            callback(err, null);
                                        } else if (data3) {
                                            callback(null, accountsData);
                                        }
                                    });
                            }
                        });
                    } else {
                        console.log("inside");
                        Accounts.findOne({
                            school: transactData.school
                        }).lean().exec(function (err, accountsData) {
                            if (err || _.isEmpty(accountsData)) {
                                callback(null, {
                                    error: "no data",
                                    data: transactData
                                });
                            } else {
                                var check = false;
                                _.each(accountsData.transaction, function (n) {
                                    if (n.equals(transactData._id)) {
                                        check = true;
                                    }
                                })
                                var transaction = [];
                                if (check == false) {
                                    transaction.push(transactData._id);
                                }
                                transaction = _.concat(transaction, accountsData.transaction);

                                var matchObj = {
                                    $set: {
                                        sgst: data.sgstAmt,
                                        cgst: data.cgstAmt,
                                        igst: data.igstAmt,
                                        outstandingAmount: data.amountPaid,
                                        transaction: transaction,
                                        upgradePaymentStatus: "Pending",
                                        upgrade: true
                                    }
                                };
                                Accounts.update({
                                    school: data.school
                                }, matchObj).exec(
                                    function (err, data3) {
                                        if (err) {
                                            callback(err, null);
                                        } else if (data3) {
                                            callback(null, accountsData);
                                        }
                                    });
                            }
                        });
                    }
                },
                function (accountsData, callback) {
                    if (data.athlete && data.registrationFee == "cash") {
                        var matchObj = {
                            $set: {
                                package: data.package,
                            }
                        };
                        Athelete.update({
                            _id: data.athlete
                        }, matchObj).exec(
                            function (err, data3) {
                                if (err) {
                                    console.log(err);
                                    callback(err, null);
                                } else if (data3) {
                                    callback(null, data3)
                                }
                            });
                    } else if (data.school && data.registrationFee == "cash") {
                        var matchObj = {
                            $set: {
                                package: data.package,
                            }
                        };
                        Registration.update({
                            _id: data.school
                        }, matchObj).exec(
                            function (err, data3) {
                                if (err) {
                                    console.log(err);
                                    callback(err, null);
                                } else if (data3) {
                                    callback(null, data3);
                                }
                            });
                    } else {
                        callback(null, accountsData);
                    }
                },
                function (accountsData, callback) {
                    if (data.athlete && data.registrationFee == "cash") {
                        var found = {};
                        found._id = data.athlete;
                        console.log("towards mails", found);
                        Accounts.updateAthleteMailAndSms(found, function (err, mailData) {
                            if (err) {
                                callback(err, null);
                            } else {
                                callback(null, found);
                            }
                        });
                    } else if (data.school && data.registrationFee == "cash") {
                        var found = {};
                        found._id = data.school;
                        Accounts.updateSchoolMailAndSms(found, function (err, mailData) {
                            if (err) {
                                callback(err, null);
                            } else {
                                callback(null, found);
                            }
                        });
                    } else {
                        callback(null, data);
                    }
                }
            ],
            function (err, complete) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, complete);
                }
            });
    },

    updateAthletePaymentStatus: function (data, callback) {
        async.waterfall([
                function (callback) {
                    Athelete.findOne({ //finds one with refrence to id
                        firstName: data.firstName,
                        surname: data.surname,
                        email: data.email,
                    }).lean().exec(function (err, found) {
                        if (err) {
                            callback(err, null);
                        } else if (_.isEmpty(found)) {
                            console.log("empty in Athelete found");
                            callback(null, "Data is empty");
                        } else {
                            async.waterfall([
                                    function (callback) {
                                        Accounts.findOne({
                                            athlete: found._id
                                        }).lean().exec(function (err, accountsData) {
                                            if (err || _.isEmpty(accountsData)) {
                                                callback(null, {
                                                    error: "no data found",
                                                    data: found
                                                });
                                            } else {
                                                found.accounts = accountsData;
                                                callback(null, found);
                                            }
                                        });
                                    },
                                    function (found, callback) {
                                        if (data.success == true) {
                                            data.athlete = true;
                                            Transaction.saveUpdateTransaction(data, found, function (err, vData) {
                                                if (err || _.isEmpty(vData)) {
                                                    callback(null, {
                                                        error: "no data found",
                                                        data: found
                                                    });
                                                } else {
                                                    console.log("vData", vData.package);
                                                    found.packageNew = vData.package;
                                                    callback(null, found);
                                                }
                                            });
                                        } else {
                                            data.athlete = true;
                                            Transaction.deleteUpdateTransaction(data, found, function (err, vData) {
                                                if (err || _.isEmpty(vData)) {
                                                    callback(null, {
                                                        error: "no data found",
                                                        data: found
                                                    });
                                                } else {
                                                    console.log("vData", vData.package);
                                                    found.packageNew = vData.package;
                                                    callback(null, found);
                                                }
                                            });
                                        }
                                    },
                                ],
                                function (err, complete) {
                                    if (err) {
                                        callback(err, callback);
                                    } else {
                                        callback(null, complete);
                                    }
                                });
                        }
                    });
                },
                function (found, callback) {
                    if (found.error) {
                        callback(null, found);
                    } else {
                        console.log("found in update", found);

                        var matchObj = {
                            $set: {
                                package: found.packageNew,
                                paymentStatus: "Paid"
                            }
                        };
                        Athelete.update({
                            _id: found._id
                        }, matchObj).exec(
                            function (err, data3) {
                                if (err) {
                                    console.log(err);
                                    callback(err, null);
                                } else if (data3) {
                                    callback(null, found);
                                }
                            });
                    }
                },
                function (found, callback) {
                    Accounts.updateAthleteMailAndSms(found, function (err, mailData) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, found);
                        }
                    });
                },
                function (found, callback) {
                    Accounts.upgradeInvoiceAthlete(found, function (err, mailData) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, mailData);
                        }
                    });
                }
            ],
            function (err, data2) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else {
                    callback(null, data2);
                }

            });
    },

    updateSchoolPaymentStatus: function (data, callback) {
        async.waterfall([
                function (callback) {
                    ConfigProperty.find().lean().exec(function (err, property) {
                        if (err) {
                            callback(err, null);
                        } else {
                            if (_.isEmpty(property)) {
                                callback(null, []);
                            } else {
                                callback(null, property);
                            }
                        }
                    });
                },
                function (property, callback) {
                    console.log("inside update", data);
                    Registration.findOne({ //finds one with refrence to id
                        schoolName: data.schoolName
                    }).exec(function (err, found) {
                        if (err) {
                            callback(err, null);
                        } else if (_.isEmpty(found)) {
                            callback(null, "Data is empty");
                        } else {
                            console.log('found', found);
                            async.waterfall([
                                    function (callback) {
                                        Accounts.findOne({
                                            school: found._id
                                        }).lean().exec(function (err, accountsData) {
                                            if (err || _.isEmpty(accountsData)) {
                                                callback(null, {
                                                    error: "no data found",
                                                    data: found
                                                });
                                            } else {
                                                found.accounts = accountsData;
                                                callback(null, found);
                                            }
                                        });
                                    },
                                    function (found, callback) {
                                        if (data.success == true) {
                                            data.school = true;
                                            console.log('data!!!!!!!', data, 'found!!!!!!!', found);
                                            Transaction.saveUpdateTransaction(data, found, function (err, vData) {
                                                if (err || _.isEmpty(vData)) {
                                                    callback(null, {
                                                        error: "no data found",
                                                        data: found
                                                    });
                                                } else {
                                                    found.packageNew = vData.package;
                                                    callback(null, found);
                                                }
                                            });
                                        } else {
                                            data.school = true;
                                            Transaction.deleteUpdateTransaction(data, found, function (err, vData) {
                                                if (err || _.isEmpty(vData)) {
                                                    callback(null, {
                                                        error: "no data found",
                                                        data: found
                                                    });
                                                } else {
                                                    console.log("vData", vData.package);
                                                    found.packageNew = vData.package;
                                                    callback(null, found);
                                                }
                                            });
                                        }
                                    },
                                    function (found, callback) {
                                        if (found.error) {
                                            callback(null, found);
                                        } else {
                                            var matchObj = {
                                                $set: {
                                                    package: found.packageNew,
                                                    paymentStatus: "Paid"
                                                }
                                            };
                                            console.log("found in update", found);
                                            Registration.update({
                                                _id: found._id
                                            }, matchObj).exec(
                                                function (err, data3) {
                                                    callback(err, data3);
                                                    if (err) {
                                                        callback(err, null);
                                                    } else {
                                                        callback(null, found);
                                                    }
                                                });
                                        }
                                    },
                                    function (found, callback) {
                                        Accounts.updateSchoolMailAndSms(found, function (err, mailData) {
                                            if (err) {
                                                callback(err, null);
                                            } else {
                                                callback(null, mailData);
                                            }
                                        });
                                    }
                                ],
                                function (err, complete) {
                                    if (err) {
                                        callback(err, callback);
                                    } else {
                                        callback(null, complete);
                                    }
                                });
                        }
                    });
                }
            ],
            function (err, data2) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else {
                    callback(null, data2);
                }

            });
    },

    generateAthleteExcel: function (data, res) {
        async.waterfall([
                function (callback) {
                    var pipeLine = Accounts.getSearchAggregatePipeline(data);
                    Accounts.aggregate(pipeLine, function (err, found) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, found);
                        }
                    });
                },
                function (found, callback) {
                    async.concatSeries(found, function (mainData, callback) {
                            console.log("mainData", mainData);
                            var obj = {};
                            var currentPackName;
                            var packPrice;
                            var cgstPercent;
                            var sgstPercent;
                            var igstPercent;
                            var finalPrice = 0;
                            if (mainData.athlete) {
                                if (mainData.athlete.sfaId) {
                                    obj["SFA ID"] = mainData.athlete.sfaId;
                                } else {
                                    obj["SFA ID"] = " ";
                                }
                                if (mainData.athlete.middleName) {
                                    obj["ATHLETE NAME"] = mainData.athlete.firstName + " " + mainData.athlete.middleName + " " + mainData.athlete.surname;
                                } else {
                                    obj["ATHLETE NAME"] = mainData.athlete.firstName + " " + mainData.athlete.surname;
                                }
                                if (mainData.athlete.atheleteSchoolName) {
                                    obj["ATHLETE SCHOOL NAME"] = mainData.athlete.atheleteSchoolName;
                                } else if (mainData.athlete.school) {
                                    obj["ATHLETE SCHOOL NAME"] = mainData.athlete.school.name;
                                } else {
                                    obj["ATHLETE SCHOOL NAME"] = "";
                                }

                                currentPackName = mainData.athlete.package.name;
                                packPrice = mainData.athlete.package.finalPrice;
                                cgstPercent = mainData.athlete.package.cgstPercent;
                                sgstPercent = mainData.athlete.package.sgstPercent;
                                igstPercent = mainData.athlete.package.igstPercent;
                                finalPrice = mainData.athlete.package.finalPrice;


                            } else {
                                obj["SFA ID"] = " ";
                                obj["ATHLETE NAME"] = "";
                                obj["ATHLETE SCHOOL NAME"] = "";
                            }

                            var i = 0;
                            var paymentMode;
                            var payu;
                            var totalPaid = 0;;

                            _.each(mainData.transaction, function (n) {
                                if (i == 0) {
                                    obj["SELECTED PACKAGES"] = n.package.name;
                                    paymentMode = n.paymentMode;
                                    if (n.PayuId) {
                                        payu = n.PayuId;
                                    } else {
                                        payu = "NA";
                                    }
                                } else {
                                    obj["SELECTED PACKAGES"] = obj["SELECTED PACKAGES"] + "," + n.package.name;
                                    paymentMode = paymentMode + "," + n.paymentMode;
                                    if (n.PayuId) {
                                        payu = payu + "," + n.PayuId;
                                    } else {
                                        payu = payu + "," + "NA";
                                    }
                                }
                                totalPaid = totalPaid + n.amountPaid;

                                i++;
                            });

                            obj["CURRENT PACKAGE"] = currentPackName;
                            obj["CURRENT PACKAGE AMOUNT"] = finalPrice;
                            if (cgstPercent) {
                                obj["CGST PERCENT"] = mainData.athlete.package.cgstPercent;
                            } else {
                                obj["CGST PERCENT"] = 0;
                            }
                            if (mainData.cgst != null) {
                                obj["CGST AMOUNT"] = mainData.cgst;
                            } else {
                                obj["CGST AMOUNT"] = 0;
                            }
                            if (sgstPercent) {
                                obj["SGST PERCENT"] = mainData.athlete.package.sgstPercent;
                            } else {
                                obj["SGST PERCENT"] = 0;
                            }
                            if (mainData.sgst != null) {
                                obj["SGST AMOUNT"] = mainData.sgst;
                            } else {
                                obj["SGST AMOUNT"] = 0;
                            }
                            if (igstPercent) {
                                obj["IGST PERCENT"] = igstPercent;
                            } else {
                                obj["IGST PERCENT"] = 0;
                            }
                            if (mainData.igst != null) {
                                obj["IGST AMOUNT"] = mainData.igst;
                            } else {
                                obj["IGST AMOUNT"] = 0;
                            }
                            obj["DISCOUNT"] = mainData.discount;
                            if (obj["IGST AMOUNT"] > 0) {
                                obj["TOTAL TO PAY"] = (finalPrice + obj["IGST AMOUNT"]) - mainData.discount;
                            } else {
                                obj["TOTAL TO PAY"] = (finalPrice + obj["CGST AMOUNT"] + obj["SGST AMOUNT"]) - mainData.discount;
                            }
                            obj["TOTAL PAID"] = totalPaid;
                            obj["OUTSTANDING AMOUNT"] = mainData.outstandingAmount;
                            if (mainData.upgrade == true) {
                                obj["UPGRADED"] = "YES";
                            } else {
                                obj["UPGRADED"] = "NO";
                            }
                            if (mainData.transaction) {
                                var len = mainData.transaction.length;
                                if (len > 0) {
                                    len--;
                                    obj["LAST PAYMENT DATE"] = mainData.transaction[len].dateOfTransaction;
                                } else {
                                    obj["LAST PAYMENT DATE"] = "";
                                }
                            } else {
                                obj["LAST PAYMENT DATE"] = "";
                            }
                            obj["PAYMENT MODE"] = paymentMode;

                            obj["PAYU ID"] = payu;
                            var j = 0;
                            if (!_.isEmpty(mainData.receiptId)) {
                                _.each(mainData.receiptId, function (n) {
                                    if (j == 0) {
                                        obj["RECEIPT NO"] = n;
                                    } else {
                                        obj["RECEIPT NO"] = obj["RECEIPT NO"] + "," + n;
                                    }
                                    j++;
                                });
                            } else {
                                obj["RECEIPT NO"] = "";
                            }
                            var k = 0;
                            if (!_.isEmpty(mainData.checkNo)) {
                                _.each(mainData.checkNo, function (n) {
                                    if (k == 0) {
                                        obj["CHECK NO"] = n;
                                    } else {
                                        obj["CHECK NO"] = obj["CHECK NO"] + "," + n;
                                    }
                                    k++;
                                });
                            } else {
                                obj["CHECK NO"] = "";
                            }

                            callback(null, obj);
                        },
                        function (err, singleData) {
                            // Config.generateExcel("KnockoutIndividual", singleData, res);
                            callback(null, singleData);
                        });
                }
            ],
            function (err, complete) {
                if (err) {
                    callback(err, null);
                } else {
                    // callback(null, complete);
                    Config.generateExcel("KnockoutIndividual", complete, res);
                }
            })
    },

    generateSchoolExcel: function (data, res) {
        async.waterfall([
            function (callback) {
                var pipeLine = Accounts.getAggregatePipelineSchool(data);
                Accounts.aggregate(pipeLine, function (err, found) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, found);
                    }
                });
            },
            function (found, callback) {
                async.concatSeries(found, function (mainData, callback) {
                        console.log("mainData", mainData);
                        var obj = {};
                        var currentPackName = "";
                        var packPrice = 0;
                        var cgstPercent = 0;
                        var sgstPercent = 0;
                        var igstPercent = 0;
                        var finalPrice = 0;
                        if (mainData.school) {
                            obj["SFA ID"] = mainData.school.sfaID;
                            obj["SCHOOL NAME"] = mainData.school.schoolName;
                            if (mainData.school.package) {
                                currentPackName = mainData.school.package.name;
                                packPrice = mainData.school.package.finalPrice;
                                cgstPercent = mainData.school.package.cgstPercent;
                                sgstPercent = mainData.school.package.sgstPercent;
                                igstPercent = mainData.school.package.igstPercent;
                                finalPrice = mainData.school.package.finalPrice;
                            }

                        } else {
                            obj["SFA ID"] = "";
                            obj["SCHOOL NAME"] = "";
                        }
                        var i = 0;
                        var paymentMode;
                        var payu;
                        var totalPaid = 0;

                        _.each(mainData.transaction, function (n) {
                            if (i == 0) {
                                paymentMode = n.paymentMode;
                                if (n.PayuId) {
                                    payu = n.PayuId;
                                } else {
                                    payu = "NA"
                                }
                            } else {
                                paymentMode = paymentMode + "," + n.paymentMode;
                                if (n.PayuId) {
                                    payu = payu + "," + n.PayuId;
                                } else {
                                    payu = payu + "," + "NA";
                                }
                            }
                            totalPaid = totalPaid + n.amountPaid;
                            i++;
                        });

                        obj["PACKAGE"] = currentPackName;
                        obj["PACKAGE AMOUNT"] = finalPrice;
                        if (cgstPercent) {
                            obj["CGST PERCENT"] = cgstPercent;
                        } else {
                            obj["CGST PERCENT"] = 0;
                        }
                        if (mainData.cgst != null) {
                            obj["CGST AMOUNT"] = mainData.cgst;
                        } else {
                            obj["CGST AMOUNT"] = 0;
                        }
                        if (sgstPercent != null) {
                            obj["SGST PERCENT"] = mainData.sgstPercent;
                        } else {
                            obj["SGST PERCENT"] = 0;
                        }
                        if (mainData.sgst != null) {
                            obj["SGST AMOUNT"] = mainData.sgst;
                        } else {
                            obj["SGST AMOUNT"] = 0;
                        }
                        if (igstPercent != null) {
                            obj["IGST PERCENT"] = igstPercent;
                        } else {
                            obj["IGST PERCENT"] = 0;
                        }
                        if (mainData.igst != null) {
                            obj["IGST AMOUNT"] = mainData.igst;
                        } else {
                            obj["IGST AMOUNT"] = 0;
                        }
                        obj["DISCOUNT"] = mainData.discount;
                        if (obj["IGST AMOUNT"] > 0) {
                            obj["TOTAL TO PAY"] = (finalPrice + obj["IGST AMOUNT"]) - mainData.discount;
                        } else {
                            obj["TOTAL TO PAY"] = (finalPrice + obj["CGST AMOUNT"] + obj["SGST AMOUNT"]) - mainData.discount;
                        }
                        obj["TOTAL PAID"] = totalPaid;
                        obj["OUTSTANDING AMOUNT"] = mainData.outstandingAmount;
                        if (mainData.upgrade == true) {
                            obj["UPGRADED"] = "YES";
                        } else {
                            obj["UPGRADED"] = "NO";
                        }
                        if (mainData.transaction) {
                            var len = mainData.transaction.length;
                            if (len > 0) {
                                len--;
                                obj["LAST PAYMENT DATE"] = mainData.transaction[len].dateOfTransaction;
                            } else {
                                obj["LAST PAYMENT DATE"] = "";
                            }
                        } else {
                            obj["LAST PAYMENT DATE"] = "";
                        }
                        obj["PAYMENT MODE"] = paymentMode;

                        obj["PAYU ID"] = payu;
                        var j = 0;
                        if (!_.isEmpty(mainData.receiptId)) {
                            _.each(mainData.receiptId, function (n) {
                                if (j == 0) {
                                    obj["RECEIPT NO"] = n;
                                } else {
                                    obj["RECEIPT NO"] = obj["RECEIPT NO"] + "," + n
                                }
                                j++;
                            });
                        } else {
                            obj["RECEIPT NO"] = "";
                        }
                        var k = 0;
                        if (!_.isEmpty(mainData.checkNo)) {
                            _.each(mainData.checkNo, function (n) {
                                if (k == 0) {
                                    obj["CHECK NO"] = n;
                                } else {
                                    obj["CHECK NO"] = obj["CHECK NO"] + "," + n
                                }
                                k++;
                            });
                        } else {
                            obj["CHECK NO"] = "";
                        }
                        callback(null, obj);
                    },
                    function (err, singleData) {
                        // Config.generateExcel("KnockoutIndividual", singleData, res);
                        callback(null, singleData);
                    });
            }
        ], function (err, complete) {
            if (err) {
                callback(err, null);
            } else {
                // callback(null, complete);
                Config.generateExcel("KnockoutIndividual", complete, res);
            }
        })
    },

    updateSchoolMailAndSms: function (found, callback) {
        async.waterfall([
                function (callback) {
                    ConfigProperty.find().lean().exec(function (err, property) {
                        if (err) {
                            callback(err, null);
                        } else {
                            if (_.isEmpty(property)) {
                                callback(null, []);
                            } else {
                                callback(null, property);
                            }
                        }
                    });
                },
                function (property, callback) {
                    Registration.findOne({
                        _id: found._id
                    }).lean().deepPopulate("package").exec(
                        function (err, schoolData) {
                            if (err) {
                                console.log(err);
                                callback(err, null);
                            } else if (schoolData) {
                                callback(null, property, schoolData);
                            }
                        });
                },
                function (property, schoolData, callback) {
                    var packageId = {};
                    packageId._id = schoolData.package._id;
                    Featurepackage.featureDetailByPackage(packageId, function (err, features) {
                        if (err) {
                            callback(err, null);
                        } else {
                            if (_.isEmpty(features)) {
                                callback(null, []);
                            } else {
                                var finalData = {};
                                finalData.property = property;
                                finalData.schoolData = schoolData;
                                finalData.features = features;
                                callback(null, finalData);
                            }
                        }
                    });
                },
                function (finalData, callback) {
                    var property = finalData.property;
                    var schoolData = finalData.schoolData;
                    var features = finalData.features;
                    async.parallel([
                            function (callback) {
                                var emailData = {};
                                // emailData.from = "info@sfanow.in";
                                emailData.from = property[0].infoId;
                                emailData.email = schoolData.email;
                                emailData.infoId = property[0].infoId;
                                emailData.infoNo = property[0].infoNo;
                                emailData.infoNoArr = property[0].infoNoArr;
                                emailData.merchandisePrice = property[0].merchandisePrice;
                                emailData.smaaashPrice = property[0].smaaashPrice;
                                emailData.cityAddress = property[0].cityAddress;
                                emailData.ddFavour = property[0].ddFavour;
                                emailData.city = property[0].sfaCity;
                                emailData.year = property[0].year;
                                emailData.eventYear = property[0].eventYear;
                                emailData.type = property[0].institutionType;
                                emailData.packageName = schoolData.package.name;
                                emailData.packageOrder = schoolData.package.order;
                                emailData.featureDetail = features;
                                emailData.flag = emailData.type;
                                emailData.filename = "e-player-school/upgrade.ejs";
                                emailData.subject = "SFA: Thank you for upgrading your package for SFA " + emailData.city + " " + emailData.eventYear;
                                // console.log("emaildata", emailData);
                                Config.email(emailData, function (err, emailRespo) {
                                    if (err) {
                                        console.log(err);
                                        callback(null, err);
                                    } else if (emailRespo) {
                                        callback(null, emailRespo);
                                    } else {
                                        callback(null, "Invalid data");
                                    }
                                });
                            },
                            function (callback) {
                                var smsData = {};
                                smsData.mobile = schoolData.mobile;
                                smsData.content = "Thank you for upgrading your package for SFA " + property[0].sfaCity + " " + property[0].eventYear + ". For further details please check your registered email ID.";
                                // console.log("smsdata", smsData);
                                Config.sendSms(smsData, function (err, smsRespo) {
                                    if (err) {
                                        console.log(err);
                                        callback(err, null);
                                    } else if (smsRespo) {
                                        console.log(smsRespo, "sms sent");
                                        callback(null, smsRespo);
                                    } else {
                                        callback(null, "Invalid data");
                                    }
                                });
                            }
                        ],
                        function (err, final) {
                            if (err) {
                                callback(err, null);
                            } else {
                                callback(null, final);
                            }

                        });
                }
            ],
            function (err, data2) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else {
                    callback(null, data2);
                }

            });
    },

    updateAthleteMailAndSms: function (found, callback) {
        console.log("went inside mail athlete");
        async.waterfall([
                function (callback) {
                    ConfigProperty.find().lean().exec(function (err, property) {
                        if (err) {
                            callback(err, null);
                        } else {
                            if (_.isEmpty(property)) {
                                callback(null, []);
                            } else {
                                callback(null, property);
                            }
                        }
                    });
                },
                function (property, callback) {
                    Athelete.findOne({
                        _id: found._id
                    }).lean().deepPopulate("package").exec(
                        function (err, athleteData) {
                            if (err) {
                                console.log(err);
                                callback(err, null);
                            } else if (athleteData) {
                                console.log("athleteData", athleteData);
                                callback(null, property, athleteData);
                            }
                        });
                },
                function (property, athleteData, callback) {
                    var packageId = {};
                    packageId._id = athleteData.package._id;
                    Featurepackage.featureDetailByPackage(packageId, function (err, features) {
                        if (err) {
                            callback(err, null);
                        } else {
                            if (_.isEmpty(features)) {
                                callback(null, []);
                            } else {
                                var finalData = {};
                                finalData.property = property;
                                finalData.athleteData = athleteData;
                                finalData.features = features;
                                callback(null, finalData);
                            }
                        }
                    });
                },
                function (finalData, callback) {
                    var property = finalData.property;
                    var athleteData = finalData.athleteData;
                    var features = finalData.features;
                    async.parallel([
                            function (callback) {
                                var emailData = {};
                                // emailData.from = "info@sfanow.in";
                                emailData.from = property[0].infoId;
                                emailData.email = athleteData.email;
                                emailData.infoId = property[0].infoId;
                                emailData.infoNo = property[0].infoNo;
                                emailData.infoNoArr = property[0].infoNoArr;
                                emailData.merchandisePrice = property[0].merchandisePrice;
                                emailData.smaaashPrice = property[0].smaaashPrice;
                                emailData.cityAddress = property[0].cityAddress;
                                emailData.ddFavour = property[0].ddFavour;
                                emailData.city = property[0].sfaCity;
                                emailData.year = property[0].year;
                                emailData.eventYear = property[0].eventYear;
                                emailData.type = property[0].institutionType;
                                emailData.packageName = athleteData.package.name;
                                emailData.packageOrder = athleteData.package.order;
                                emailData.featureDetail = features;
                                emailData.flag = emailData.type;
                                emailData.filename = "e-player-school/upgrade.ejs";
                                emailData.subject = "SFA: Thank you for upgrading your package for SFA " + emailData.city + " " + emailData.eventYear;
                                // console.log("emaildata", emailData);
                                Config.email(emailData, function (err, emailRespo) {
                                    if (err) {
                                        console.log(err);
                                        callback(null, err);
                                    } else if (emailRespo) {
                                        callback(null, emailRespo);
                                    } else {
                                        callback(null, "Invalid data");
                                    }
                                });
                            },
                            function (callback) {
                                var smsData = {};
                                smsData.mobile = athleteData.mobile;
                                smsData.content = "Thank you for upgrading your package for SFA " + property[0].sfaCity + " " + property[0].eventYear + ". For further details please check your registered email ID.";
                                // console.log("smsdata", smsData);
                                Config.sendSms(smsData, function (err, smsRespo) {
                                    if (err) {
                                        console.log(err);
                                        callback(err, null);
                                    } else if (smsRespo) {
                                        console.log(smsRespo, "sms sent");
                                        callback(null, smsRespo);
                                    } else {
                                        callback(null, "Invalid data");
                                    }
                                });
                            }
                        ],
                        function (err, final) {
                            if (err) {
                                callback(err, null);
                            } else {
                                callback(null, final);
                            }

                        });
                }
            ],
            function (err, data2) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else {
                    callback(null, data2);
                }

            });
    },

    upgradeInvoiceAthlete: function (data, callback) {
        async.waterfall([
            function (callback) {
                ConfigProperty.find().lean().exec(function (err, property) {
                    if (err) {
                        callback(err, null);
                    } else {
                        if (_.isEmpty(property)) {
                            callback(null, []);
                        } else {
                            callback(null, property);
                        }
                    }
                });
            },
            function (property, callback) {
                Accounts.findOne({
                        athlete: data._id
                    }).lean()
                    .deepPopulate("athlete athlete.school athlete.package transaction transaction.package")
                    .exec(function (err, accountsData) {
                        if (err || _.isEmpty(accountsData)) {
                            callback(null, {
                                error: "no accounts found",
                                data: data
                            });
                        } else {
                            var final = {};
                            final.accounts = accountsData;
                            final.property = property[0];
                            callback(null, final);
                        }
                    });
            },
            function (final, callback) {
                var len = final.accounts.transaction.length;
                var temp = len;
                len--;
                var emailData = {};
                emailData.city = final.property.sfaCity;
                emailData.type = final.property.institutionType;
                emailData.infoNo = final.property.infoNo;
                emailData.infoNoArr = final.property.infoNoArr;
                emailData.infoId = final.property.infoId;
                emailData.ddFavour = final.property.ddFavour;
                emailData.cityAddress = final.property.cityAddress;
                if (final.accounts.upgrade) {
                    emailData.upgrade = final.accounts.upgrade;
                } else {
                    emailData.upgrade = false;
                }
                emailData.packageName = final.accounts.transaction[len].package.name;
                var dateTime = moment().utc(final.accounts.transaction[len].dateOfTransaction).format("DD-MM-YYYY");
                emailData.registrationDate = dateTime;
                // emailData.registrationDate = final.accounts.transaction[len].dateOfTransaction;
                emailData.amountWithoutTax = final.accounts.transaction[len].package.finalPrice;
                emailData.cgstPercent = final.accounts.transaction[len].package.cgstPercent;
                emailData.sgstPercent = final.accounts.transaction[len].package.sgstPercent;
                emailData.igstPercent = final.accounts.transaction[len].package.igstPercent;
                emailData.cgstAmount = final.accounts.transaction[len].cgstAmount;
                emailData.sgstAmount = final.accounts.transaction[len].sgstAmount;
                emailData.igstAmount = final.accounts.transaction[len].igstAmount;
                emailData.eventYear = final.property.eventYear;
                if (temp > 1) {
                    temp = temp - 2;
                } else {
                    temp = 0;
                }
                emailData.prevPaidAmount = final.accounts.transaction[temp].amountPaid;
                emailData.discount = final.accounts.discount;
                emailData.firstName = final.accounts.athlete.firstName;
                emailData.receiptNo = final.accounts.transaction[len].receiptId[0];
                emailData.surname = final.accounts.athlete.surname;
                emailData.paymentMode = final.accounts.transaction[len].paymentMode;
                emailData.athleteAmount = final.accounts.transaction[len].amountPaid;
                if (final.accounts.transaction[len].PayuId) {
                    emailData.transactionId = final.accounts.transaction[len].PayuId;
                }
                emailData.amountToWords = Accounts.amountToWords(final.accounts.transaction[len].amountPaid);
                emailData.from = final.property.infoId;
                emailData.email1 = [{
                    email: final.accounts.athlete.email
                }];
                emailData.bcc1 = [{
                    email: "payments@sfanow.in"
                }, {
                    email: "admin@sfanow.in"
                }];
                emailData.filename = "e-player/receipt.ejs";
                emailData.subject = "SFA: Your Payment Receipt as an Athlete for SFA " + emailData.city + " " + emailData.eventYear + ".";
                console.log("emaildata", emailData);
                Config.emailTo(emailData, function (err, emailRespo) {
                    if (err) {
                        console.log(err);
                        callback(null, err);
                    } else {
                        callback(null, emailRespo);
                    }
                });

            },

        ], function (err, complete) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, complete);
            }
        })
    },

    amountToWords: function (num) {
        var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
        var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

        if ((num = num.toString()).length > 9) return 'overflow';
        n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return;
        var str = '';
        str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
        str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
        str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
        str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
        str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
        return str;
    },

    removeTransactionAndUpdateAthlete: function (data, callback) {
        async.waterfall([
                function (callback) {
                    Accounts.findOne({
                        athlete: data.athlete
                    }).lean().exec(function (err, found) {
                        if (err || _.isEmpty(found)) {
                            callback(null, {
                                error: "no accounts data found",
                                data: data
                            });
                        } else {
                            callback(null, found);
                        }
                    });
                },
                function (found, callback) {
                    if (found.error) {
                        callback(null, found);
                    } else {
                        if (data.transactionId) {
                            Transaction.findOne({
                                _id: data.transactionId
                            }).lean().sort({
                                createdAt: -1
                            }).exec(function (err, transactData) {
                                if (err || _.isEmpty(transactData)) {
                                    callback(null, {
                                        error: "no data found",
                                        data: transactData
                                    });
                                } else {
                                    if (transactData.paymentMode == "online PAYU" && transactData.paymentStatus == "Pending") {
                                        console.log("transactData", transactData);
                                        Transaction.remove({
                                            _id: data.transactionId
                                        }).exec(function (err, transactData) {
                                            if (err || _.isEmpty(transactData)) {
                                                callback(null, {
                                                    error: "no data found",
                                                    data: found
                                                });
                                            } else {
                                                callback(null, found);
                                            }
                                        });
                                    } else {
                                        callback(null, found);
                                    }
                                }
                            });
                        } else {
                            var len = found.transaction.length;
                            len--;
                            console.log("len", len);
                            console.log("found", found);
                            Transaction.findOne({
                                _id: found.transaction[len]
                            }).lean().sort({
                                createdAt: -1
                            }).exec(function (err, transactData) {
                                if (err || _.isEmpty(transactData)) {
                                    callback(null, {
                                        error: "no data found",
                                        data: transactData
                                    });
                                } else {
                                    if (transactData.paymentMode == "online PAYU" && transactData.paymentStatus == "Pending") {
                                        console.log("transactData", transactData);
                                        Transaction.remove({
                                            _id: found.transaction[len]
                                        }).exec(function (err, transactData) {
                                            if (err || _.isEmpty(transactData)) {
                                                callback(null, {
                                                    error: "no data found",
                                                    data: found
                                                });
                                            } else {
                                                found.paymentType = transactData.paymentMode;
                                                found.paymentStatus = transactData.paymentStatus;
                                                found.remove = true;
                                                callback(null, found);
                                            }
                                        });
                                    } else {
                                        found.paymentType = transactData.paymentMode;
                                        found.paymentStatus = transactData.paymentStatus;
                                        found.remove = false;
                                        callback(null, found);
                                    }
                                }
                            });
                        }
                    }
                },
                function (found, callback) {
                    if (found.error) {
                        callback(null, found);
                    } else {
                        if (data.transactionId) {
                            var len = found.transaction.length;
                            len = len - 2;
                            console.log("len", len);
                            var transaction = [];
                            var i = 0;
                            while (i <= len) {
                                transaction.push(found.transaction[i]);
                                i++;
                            }

                            if (transaction.length == 1) {
                                var upgrade = false
                            } else {
                                var upgrade = true;
                            }
                            Transaction.findOne({
                                _id: found.transaction[len]
                            }).lean().sort({
                                createdAt: -1
                            }).exec(function (err, transactData) {
                                if (err || _.isEmpty(transactData)) {
                                    callback(null, {
                                        error: "no data found",
                                        data: transactData
                                    });
                                } else {
                                    var matchObj = {
                                        $set: {
                                            outstandingAmount: transactData.outstandingAmount,
                                            totalPaid: transactData.amountPaid,
                                            cgst: transactData.cgstAmount,
                                            sgst: transactData.sgstAmount,
                                            igst: transactData.igstAmount,
                                            transaction: transaction,
                                            upgrade: upgrade
                                        }
                                    };
                                    console.log("matchObj", matchObj);

                                    Accounts.update({
                                        athlete: data.athlete
                                    }, matchObj).exec(
                                        function (err, data3) {
                                            if (err) {
                                                callback(err, null);
                                            } else if (data3) {
                                                if (transactData.paymentMode != "online PAYU" && transactData.paymentStatus != "Pending") {
                                                    var matchObj = {
                                                        $set: {
                                                            package: transactData.package,
                                                        }
                                                    };
                                                    Athelete.update({
                                                        _id: data.athlete,

                                                    }, matchObj).exec(
                                                        function (err, data3) {
                                                            if (err) {
                                                                console.log(err);
                                                                callback(err, null);
                                                            } else if (data3) {
                                                                callback(null, data3);
                                                            }
                                                        });
                                                } else {
                                                    callback(null, transactData);
                                                }
                                            }
                                        });
                                }
                            });
                        } else if (found.paymentType == "online PAYU" && found.paymentStatus == "Pending") {
                            var len = found.transaction.length;
                            len = len - 2;
                            console.log("len", len);
                            var transaction = [];

                            var i = 0;
                            while (i <= len) {
                                transaction.push(found.transaction[i]);
                                i++;
                            }

                            if (transaction.length == 1) {
                                var upgrade = false
                            } else {
                                var upgrade = true;
                            }
                            Transaction.findOne({
                                _id: found.transaction[len]
                            }).lean().sort({
                                createdAt: -1
                            }).exec(function (err, transactData) {
                                console.log("transactData after delete", transactData);
                                if (err || _.isEmpty(transactData)) {
                                    callback(null, {
                                        error: "no data found",
                                        data: transactData
                                    });
                                } else {
                                    var matchObj = {
                                        $set: {
                                            outstandingAmount: transactData.outstandingAmount,
                                            totalPaid: transactData.amountPaid,
                                            cgst: transactData.cgstAmount,
                                            sgst: transactData.sgstAmount,
                                            igst: transactData.igstAmount,
                                            transaction: transaction,
                                            upgrade: upgrade,
                                        }
                                    };
                                    console.log("matchObj", matchObj);
                                    Accounts.update({
                                        athlete: data.athlete
                                    }, matchObj).exec(
                                        function (err, data3) {
                                            if (err) {
                                                callback(err, null);
                                            } else if (data3) {
                                                var matchObj = {
                                                    $set: {
                                                        package: transactData.package,
                                                    }
                                                };
                                                Athelete.update({
                                                    _id: data.athlete
                                                }, matchObj).exec(
                                                    function (err, data3) {
                                                        if (err) {
                                                            console.log(err);
                                                            callback(err, null);
                                                        } else if (data3) {
                                                            callback(null, data3);
                                                        }
                                                    });
                                            }
                                        });
                                }
                            });
                        } else {
                            var len = found.transaction.length;
                            len = len - 1;
                            console.log("len", len);
                            var transaction = [];

                            if (found.remove == true) {
                                var i = 0;
                                while (i <= len) {
                                    transaction.push(found.transaction[i]);
                                    i++;
                                }
                            } else {
                                transaction = found.transaction;
                            }
                            if (transaction.length == 1) {
                                var upgrade = false
                            } else {
                                var upgrade = true;
                            }
                            Transaction.findOne({
                                _id: found.transaction[len]
                            }).lean().sort({
                                createdAt: -1
                            }).exec(function (err, transactData) {
                                console.log("transactData after delete", transactData);
                                if (err || _.isEmpty(transactData)) {
                                    callback(null, {
                                        error: "no data found",
                                        data: transactData
                                    });
                                } else {
                                    var matchObj = {
                                        $set: {
                                            outstandingAmount: transactData.outstandingAmount,
                                            totalPaid: transactData.amountPaid,
                                            cgst: transactData.cgstAmount,
                                            sgst: transactData.sgstAmount,
                                            igst: transactData.igstAmount,
                                            transaction: transaction,
                                            upgrade: upgrade,
                                        }
                                    };
                                    console.log("matchObj", matchObj);
                                    Accounts.update({
                                        athlete: data.athlete
                                    }, matchObj).exec(
                                        function (err, data3) {
                                            if (err) {
                                                callback(err, null);
                                            } else if (data3) {
                                                var matchObj = {
                                                    $set: {
                                                        package: transactData.package,
                                                    }
                                                };
                                                Athelete.update({
                                                    _id: data.athlete
                                                }, matchObj).exec(
                                                    function (err, data3) {
                                                        if (err) {
                                                            console.log(err);
                                                            callback(err, null);
                                                        } else if (data3) {
                                                            callback(null, data3);
                                                        }
                                                    });
                                            }
                                        });
                                }
                            });
                        }
                    }
                }
            ],
            function (err, complete) {
                if (err) {
                    callback(err, callback);
                } else {
                    callback(null, complete);
                }
            });
    },

    removeTransactionAndUpdateSchool: function (data, callback) {
        async.waterfall([
                function (callback) {
                    Accounts.findOne({
                        school: data.school
                    }).lean().exec(function (err, found) {
                        if (err || _.isEmpty(found)) {
                            callback(null, {
                                error: "no accounts data found",
                                data: data
                            });
                        } else {
                            callback(null, found);
                        }
                    });
                },
                function (found, callback) {
                    if (found.error) {
                        callback(null, found);
                    } else {
                        if (data.transactionId) {
                            Transaction.findOne({
                                _id: data.transactionId
                            }).lean().sort({
                                createdAt: -1
                            }).exec(function (err, transactData) {
                                if (err || _.isEmpty(transactData)) {
                                    callback(null, {
                                        error: "no data found",
                                        data: transactData
                                    });
                                } else {
                                    if (transactData.paymentMode == "online PAYU" && transactData.paymentStatus == "Pending") {
                                        console.log("transactData", transactData);
                                        Transaction.remove({
                                            _id: data.transactionId
                                        }).exec(function (err, transactData) {
                                            if (err || _.isEmpty(transactData)) {
                                                callback(null, {
                                                    error: "no data found",
                                                    data: found
                                                });
                                            } else {
                                                callback(null, found);
                                            }
                                        });
                                    } else {
                                        callback(null, found);
                                    }
                                }
                            });
                        } else {
                            var len = found.transaction.length;
                            len--;
                            console.log("len", len);
                            console.log("found", found);
                            Transaction.findOne({
                                _id: found.transaction[len]
                            }).lean().sort({
                                createdAt: -1
                            }).exec(function (err, transactData) {
                                if (err || _.isEmpty(transactData)) {
                                    callback(null, {
                                        error: "no data found",
                                        data: transactData
                                    });
                                } else {
                                    if (transactData.paymentMode == "online PAYU" && transactData.paymentStatus == "Pending") {
                                        console.log("transactData", transactData);
                                        Transaction.remove({
                                            _id: found.transaction[len]
                                        }).exec(function (err, transactData) {
                                            if (err || _.isEmpty(transactData)) {
                                                callback(null, {
                                                    error: "no data found",
                                                    data: found
                                                });
                                            } else {
                                                found.paymentType = transactData.paymentMode;
                                                found.paymentStatus = transactData.paymentStatus;
                                                found.remove = true;
                                                callback(null, found);
                                            }
                                        });
                                    } else {
                                        found.paymentType = transactData.paymentMode;
                                        found.paymentStatus = transactData.paymentStatus;
                                        found.remove = false;
                                        callback(null, found);
                                    }
                                }
                            });
                        }
                    }
                },
                function (found, callback) {
                    if (found.error) {
                        callback(null, found);
                    } else {
                        if (data.transactionId) {
                            var len = found.transaction.length;
                            len = len - 2;
                            console.log("len", len);
                            var transaction = [];
                            var i = 0;
                            while (i <= len) {
                                transaction.push(found.transaction[i]);
                                i++;
                            }

                            if (transaction.length == 1) {
                                var upgrade = false
                            } else {
                                var upgrade = true;
                            }
                            Transaction.findOne({
                                _id: found.transaction[len]
                            }).lean().sort({
                                createdAt: -1
                            }).exec(function (err, transactData) {
                                if (err || _.isEmpty(transactData)) {
                                    callback(null, {
                                        error: "no data found",
                                        data: transactData
                                    });
                                } else {
                                    var matchObj = {
                                        $set: {
                                            outstandingAmount: transactData.outstandingAmount,
                                            totalPaid: transactData.amountPaid,
                                            cgst: transactData.cgstAmount,
                                            sgst: transactData.sgstAmount,
                                            igst: transactData.igstAmount,
                                            transaction: transaction,
                                            upgrade: upgrade
                                        }
                                    };
                                    console.log("matchObj", matchObj);

                                    Accounts.update({
                                        school: data.school
                                    }, matchObj).exec(
                                        function (err, data3) {
                                            if (err) {
                                                callback(err, null);
                                            } else if (data3) {
                                                if (transactData.paymentMode != "online PAYU" && transactData.paymentStatus != "Pending") {
                                                    var matchObj = {
                                                        $set: {
                                                            package: transactData.package,
                                                        }
                                                    };
                                                    Registration.update({
                                                        _id: data.school,
                                                    }, matchObj).exec(
                                                        function (err, data3) {
                                                            if (err) {
                                                                console.log(err);
                                                                callback(err, null);
                                                            } else if (data3) {
                                                                callback(null, data3);
                                                            }
                                                        });
                                                } else {
                                                    callback(null, transactData);
                                                }
                                            }
                                        });
                                }
                            });
                        } else if (found.paymentType == "online PAYU" && found.paymentStatus == "Pending") {
                            var len = found.transaction.length;
                            len = len - 2;
                            console.log("len", len);
                            var transaction = [];

                            var i = 0;
                            while (i <= len) {
                                transaction.push(found.transaction[i]);
                                i++;
                            }

                            if (transaction.length == 1) {
                                var upgrade = false
                            } else {
                                var upgrade = true;
                            }
                            Transaction.findOne({
                                _id: found.transaction[len]
                            }).lean().sort({
                                createdAt: -1
                            }).exec(function (err, transactData) {
                                console.log("transactData after delete", transactData);
                                if (err || _.isEmpty(transactData)) {
                                    callback(null, {
                                        error: "no data found",
                                        data: transactData
                                    });
                                } else {
                                    var matchObj = {
                                        $set: {
                                            outstandingAmount: transactData.outstandingAmount,
                                            totalPaid: transactData.amountPaid,
                                            cgst: transactData.cgstAmount,
                                            sgst: transactData.sgstAmount,
                                            igst: transactData.igstAmount,
                                            transaction: transaction,
                                            upgrade: upgrade,
                                        }
                                    };
                                    console.log("matchObj", matchObj);
                                    Accounts.update({
                                        school: data.school
                                    }, matchObj).exec(
                                        function (err, data3) {
                                            if (err) {
                                                callback(err, null);
                                            } else if (data3) {
                                                var matchObj = {
                                                    $set: {
                                                        package: transactData.package,
                                                    }
                                                };
                                                Athelete.update({
                                                    _id: data.school
                                                }, matchObj).exec(
                                                    function (err, data3) {
                                                        if (err) {
                                                            console.log(err);
                                                            callback(err, null);
                                                        } else if (data3) {
                                                            callback(null, data3);
                                                        }
                                                    });
                                            }
                                        });
                                }
                            });
                        } else {
                            var len = found.transaction.length;
                            len = len - 1;
                            console.log("len", len);
                            var transaction = [];

                            if (found.remove == true) {
                                var i = 0;
                                while (i <= len) {
                                    transaction.push(found.transaction[i]);
                                    i++;
                                }
                            } else {
                                transaction = found.transaction;
                            }
                            if (transaction.length == 1) {
                                var upgrade = false
                            } else {
                                var upgrade = true;
                            }
                            Transaction.findOne({
                                _id: found.transaction[len]
                            }).lean().sort({
                                createdAt: -1
                            }).exec(function (err, transactData) {
                                console.log("transactData after delete", transactData);
                                if (err || _.isEmpty(transactData)) {
                                    callback(null, {
                                        error: "no data found",
                                        data: transactData
                                    });
                                } else {
                                    var matchObj = {
                                        $set: {
                                            outstandingAmount: transactData.outstandingAmount,
                                            totalPaid: transactData.amountPaid,
                                            cgst: transactData.cgstAmount,
                                            sgst: transactData.sgstAmount,
                                            igst: transactData.igstAmount,
                                            transaction: transaction,
                                            upgrade: upgrade,
                                        }
                                    };
                                    console.log("matchObj", matchObj);
                                    Accounts.update({
                                        school: data.school
                                    }, matchObj).exec(
                                        function (err, data3) {
                                            if (err) {
                                                callback(err, null);
                                            } else if (data3) {
                                                var matchObj = {
                                                    $set: {
                                                        package: transactData.package,
                                                    }
                                                };
                                                Athelete.update({
                                                    _id: data.school
                                                }, matchObj).exec(
                                                    function (err, data3) {
                                                        if (err) {
                                                            console.log(err);
                                                            callback(err, null);
                                                        } else if (data3) {
                                                            callback(null, data3);
                                                        }
                                                    });
                                            }
                                        });
                                }
                            });
                        }
                    }
                }
            ],
            function (err, complete) {
                if (err) {
                    callback(err, callback);
                } else {
                    callback(null, complete);
                }
            });
    },

};
module.exports = _.assign(module.exports, exports, model);