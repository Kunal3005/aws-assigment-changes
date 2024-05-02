const xlsx = require('xlsx');
const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const ses = new aws.SES({region: 'us-east-2'});


exports.handler = async (event) => {
    const bucketName = 'excel-files';
    const fileKey = event.fileName;
    let file = await s3.getObject({Bucket: bucketName, Key: fileKey}).promise();
    let readFile = xlsx.readFile(file)
    let sheetName = readFile.SheetNames[0];
    const getData = xlsx.utils.sheet_to_json(readFile.Sheets[sheetName]);
    sendMail("Sample Subject", "Sample Body", getData.email);

    const response = {
        statusCode: 200,
        body: JSON.stringify({
            read: 'Mail Sent',
        }),
    };
    return response;
};


async function sendMail(subject, data, userEmail) {
    const emailParams = {
          Destination: {
            ToAddresses: [userEmail],
          },
          Message: {
            Body: {
              Text: { Data: data },
            },
            Subject: { Data: subject },
          },
          Source: "karmakarkunal99@gmail.com",
    };
        
    try {
          let key = await ses.sendEmail(params).promise();
          console.log("MAIL SENT SUCCESSFULLY!!");      
    } catch (e) {
          console.log("FAILURE IN SENDING MAIL!!", e);
        }  
    return;
  }