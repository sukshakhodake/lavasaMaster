module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getAllIndividual: function (req, res) {
        if (req.body) {
            OldQualifyingRound.getAllPlayer(req.body, res.callback);
        } else {
            res.json({
                "data": "Body not Found",
                "value": false
            })
        }
    },

    saveKnockoutMatch: function (req, res) {
        if (req.body) {
            OldQualifyingRound.saveMatchIndividual(req.body, res.callback);
        } else {
            res.json({
                "data": "Body not Found",
                "value": false
            })
        }
    },


};
module.exports = _.assign(module.exports, controller);