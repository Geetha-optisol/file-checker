let AWS = require('aws-sdk/global');
let S3 = require('aws-sdk/clients/s3');
let async = require('async');
module.exports = {
    uploadFile: async function (req, res) {
        try {
            S3KeyService.uploadSdsFile(req, res);
        } catch (exception) {
            console.log("exception on controller", exception);
            res.status(sails.config.constants.badRequestCode).json({ error_msg: "Upload file error" });
        }
    }
}