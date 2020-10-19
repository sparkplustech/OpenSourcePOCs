const { join, extname } = require('path');
const { readFileSync } = require('fs');
const multiparty = require('multiparty');
let AWS = require('aws-sdk');

/**
values for aws id and secret are stored in .env file. 
You can skip it and add the values as string
*/
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID, 
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY,

const s3 = new AWS.S3();

s3.config.update({
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  accessKeyId: AWS_ACCESS_KEY_ID,
});
module.exports = {

  /**
   * Helper method which takes the request object 
   * and returns a promise with the AWS S3 object details.
   */
  uploadFileToS3: async (file, storePath, options = {}) => {
    // turn the file into a buffer for uploading
    const buffer = readFileSync(file.path);
    // generate a new random file name
    const fileName = options.name || String(Date.now());
    // the extension of your file
    const extension = extname(file.path);
    // return a promise
    return new Promise((resolve, reject) => {
      return s3.upload({
        Bucket: 'thesparkone',
        ACL: 'public-read',
        Key: join(storePath, `${fileName}${extension}`),
        Body: buffer,
      }, (err, result) => {
        if (err) reject(err);
        else resolve(result); // return the values of the successful AWS S3 request
      });
    });
  },

  /**
   * Helper method which takes the request Json object 
   * and returns a promise with the AWS S3 object details.
   */
  uploadJsonToFile: async (data, options = { path, fileName, extension, contentType }) => {
    console.log('dtat from uploadjsonfile => ',data);
    let ext = options.extension || '.json';
    let type = options.contentType || 'application/json';
    console.log(join(options.path, `${options.fileName}${ext}`) );
   // return a promise
    return new Promise((resolve, reject) => {
      return s3.upload({
        Bucket: 'thesparkone',
        ACL: 'public-read',
        Key: join(options.path, `${options.fileName}${ext}`),
        Body: data,
        ContentType: type
      }, (err, result) => {
        if (err){ console.log(err); return reject(err); }
        else {console.log(result); resolve(result); } // return the values of the successful AWS S3 request
      });
    });
  },

  s3: s3,

}
