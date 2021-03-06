module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getAllBySponsorPageId: function (req, res) {
        if (req.body) {
            console.log(req.body);
            SponsorCard.getAllBySponsorPageId(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    }
};
module.exports = _.assign(module.exports, controller);