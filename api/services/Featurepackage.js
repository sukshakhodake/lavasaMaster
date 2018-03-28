var schema = new Schema({
  featureName: String,
  featureDetails: [{
    packageName: {
      type: Schema.Types.ObjectId,
      ref: 'Package',
    },
    featureOrder: Number,
    featureType: String,
    featureCheck: Boolean,
    featureText: String
  }],
  featureUserType: String
});

schema.plugin(deepPopulate, {
  populate: {
    'featureDetails.packageName': {
      select: "_id name order"
    }
  }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Featurepackage', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'featureDetails.packageName', 'featureDetails.packageName'));
var model = {};
module.exports = _.assign(module.exports, exports, model);