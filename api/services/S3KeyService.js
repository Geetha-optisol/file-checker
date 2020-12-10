let arnName = 'arn:aws:iam::092166348842:role/';
let AWS = require('aws-sdk/global');
let S3 = require('aws-sdk/clients/s3');

/**
 * Find s3 temporary credentials using STS method
 * @param {Object} reqObj - Request object
 * @param {Object} serviceCallback - service callback
 */
async function getS3Credentials(reqObj, serviceCallback) {
    const sts = new AWS.STS({ region: 'us-west-2' });
    S3KeyService.getEC2Rolename(AWS).then((rolename) => {
        let s3Params = {
            RoleArn: arnName + rolename,
            RoleSessionName: 'DEV_SESSION_S3',
            ExternalId: Math.floor((Math.random() * 10000000000000)).toString() + '',
            DurationSeconds: 900,
        };
        sts.assumeRole(s3Params, (err, data) => {
            if (err) {
                console.log("assumeRole error: ", err);
                serviceCallback({ status: false, result: [] });
            } else {
                let s3Object = { AccessKeyId: data.Credentials.AccessKeyId, secretAccessKey: data.Credentials.SecretAccessKey, sessionToken: data.Credentials.SessionToken };
                serviceCallback({ status: true, result: s3Object });
            }
        });
    }).catch((err) => {
        console.log(err);
        serviceCallback({ status: false, result: [] });
    });
}

/**
 * Get EC2 Rolename against the current user
 * @param {AWS} AWS - Aws service
 * @returns {Object} - Promise object
 */
async function getEC2Rolename(AWS) {
    let promise = new Promise((resolve, reject) => {
        let metadata = new AWS.MetadataService();
        metadata.request('/latest/meta-data/iam/security-credentials/', (err, rolename) => {
            if (err) { reject(err); }
            resolve(rolename);
        });
    });
    return promise;
}

async function uploadSdsFile(req, res) {
    try {
        let fileName = "SOPTemplateTest" + "_" + Math.floor((Math.random() * 10000000000000) + 1) + '.html';
        let content = "This is for the test purpose";
        let s3Name = 'sdstemplates/' + fileName;
        console.log("logger 1");
        S3KeyService.getS3Credentials(req, function (s3KeyResponse) {
            console.log("s3KeyResponse", s3KeyResponse);
            if (s3KeyResponse.status) {
                let s3client = new AWS.S3({
                    accessKeyId: s3KeyResponse.result.AccessKeyId,
                    secretAccessKey: s3KeyResponse.result.secretAccessKey,
                    sessionToken: s3KeyResponse.result.sessionToken,
                    params: {
                        Bucket: 'albert-assets',
                        Key: s3Name
                    }
                });
                s3client.upload({ ACL: 'private', Body: content, 'ContentType': 'text/html', 'ContentDisposition': 'inline' }, function (err, result) {
                    if (err) {
                        console.log("error 1: ", err);
                        res.status(404).json({ error_msg: "SDS upload error" });
                    } else {
                        res.status(200).json({ s3Name: fileName });
                    }
                });
            } else {
                console.log("error 2: s3KeyResponse is empty");
                res.status(404).json({ error_msg: 'SDS upload error' });
            }
        });
    } catch (exception) {
        console.log("exception", exception);
        res.status(404).json({ error_msg: 'final file genration error' });
    }
}

module.exports = {
    getEC2Rolename, getS3Credentials, uploadSdsFile
};
