## About the server Implmentation

The 0xcert server implementaion is a demonstartion of how to skip user intercation with contract signing and transfer(via metamask) to ease end user complexity.

The signing of transactions is done using our backend provider (0xcert compatible provider - bitski).
Later the ownership of the wallet and tokens can be transfered to rightful owner when they provide us thier Ethereum address.


### Filess provided
**Important Note:** *We have providedd only the required and necessary methods of the server implementation. We have neither provided the server nor the Api implementation. Please use **Express Js** or any other Node server to implment the required api's*

1. ```package.json``` as the required libraries needed and compatible version as and when implementing the demo
2. ```readme.md``` This readme file
3. ```scripts/all-scripts.js``` Methods to upload files to aws s3 bucket
4. ```scripts/scripts-0xcert.js``` 0xcerts methods to interact with 0xcert Api's -> AssetLedger [Create, Deploy], Assets [Create, View, Verify, Transfer, Destroy]. 

### Contributors :
**SparkPlus Technologies**,
- *A unit of **Sparkrex Pvt. Ltd.***
