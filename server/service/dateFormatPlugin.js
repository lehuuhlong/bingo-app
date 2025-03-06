const moment = require('moment-timezone');

module.exports = function (schema) {
  schema.set('toJSON', {
    transform: function (doc, ret) {
      if (ret.createdAt) {
        ret.createdAt = moment(ret.createdAt).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
      }
      if (ret.updatedAt) {
        ret.updatedAt = moment(ret.updatedAt).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
      }
      return ret;
    },
  });
};
