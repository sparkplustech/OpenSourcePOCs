let Cert = require('@0xcert/cert');
let schema0x = require('@0xcert/conventions')
let AssetLedger = require('@0xcert/ethereum-asset-ledger');
let HttpProvider = require('@0xcert/ethereum-http-provider');
let sha = require('@0xcert/utils');
let HDWalletProvider = require('truffle-hdwallet-provider');
let bitski = require('@0xcert/ethereum-bitski-backend-provider');
let scripts = require('../../server/boot/all-scripts');
const fs = require('fs');
const request = require('request');

const config = require('../../server/config.json');
const defaultLedger = '0x30D429FCbe6f964FD031b69bB1314867989F4f55';
let ledgerId = '';

const certificate = (schema) => {
    return new Cert.Cert({
        //schema: schema88
        //schema
        schema: (schema || postSchema) //if schema not provided use default PostSchema
    });
}
//schema0x.schemaErc721
//schema0x.schema88

let postSchema = {
    type: 'object',
    properties: {
        'name': { type: 'string' },
        'description': { type: 'string' },
        'image': { type: 'string' },
        //'date': { type: 'string' },
        //'owner': { type: 'string' }
    },
}

let providerETH = new bitski.BitskiProvider({
    clientId: '60c38c59-b031-4ae5-a4fe-d2b62207f2c0',
    credentialsId: '4a5c9088-e948-4cf3-ba42-c868e8d5ecac',
    credentialsSecret: '154jU-RqhnwiyGDGALdhnhQLxm_1waisS5vFjqnkdm2C7_uxxa8LPNjqAqUYhrK_lD',
    networkName: 'rinkeby',
    accountId: '0xF4441A0d38Aa1355E1AB41013D788258EB03f2ae'
})

let _0xcert = {
    // async ethProvider() {
    //     return new HttpProvider.HttpProvider({
    //         url: `https://ropsten.infura.io/v3/393292a2dd12472080cbbfcf33cd48b1`, //${process.env['INFURA_API_KEY']}`,
    //         accountId: '0x0106b75FF4b51D5c0F02620c34cf83C2206b4012', //process.env['ETH_PUBLIC_ACCOUNT'], // process.env.ETH_PUBLIC_ACCOUNT,
    //         requiredConfirmations: 1,
    //     });
    //     // return new HDWalletProvider('swift shove position cliff bag creek obscure still ask range review dry', 
    //     //     'https://ropsten.infura.io/v3/393292a2dd12472080cbbfcf33cd48b1');
    //     //    // 'https://rinkeby.infura.io/v3/1de3a6fc9eee4d9e92d4e058eada5e8a');
    // },

    // To set the ledger as a state object
    async getAssetLedger(ledgerAddress) {
        const ledger = await AssetLedger.AssetLedger.getInstance(providerETH, ledgerAddress);
        return ledger;
    },

    /* The asset ledger is mandatory to create new assets since they need a place to be stored, they can't exist without a ledger
    eg ledger address -> 0x30D429FCbe6f964FD031b69bB1314867989F4f55
    */
    async deployLedger(ledgerName, symbolName, schemaHash) {
        let deployedLedger = {}
        //let schema1 = (schema || postSchema);
        const cert = certificate(); // schema0x.schemaErc721);
        const hash = await sha.sha(256, JSON.stringify(cert.schema));
        const schemaId = (schemaHash || `0x${hash}`);
        console.log(hash, schemaId);
        var url = `http://${config.host}:${config.port}/assets/`
        console.log('url ', url);
        //console.log(await providerETH.getNetworkVersion());
        //console.log(await providerETH.getAvailableAccounts());

        // //The required keys are name, symbol, uriBase and schemaId
        const ledgerProperties = {
            name: ledgerName, //user.id,
            symbol: symbolName,
            uriBase: url, //'localhost:8080/', // This is a demonstration, you have to setup a server for generating tokens to this URI
            schemaId: schemaId,
            // '0xa4cf0407b223849773430feaf0949827373c40feb3258d82dd605ed41c5e9a2c', // This is the ID from schema88 available at the top of the github https://github.com/0xcert/framework/blob/master/conventions/88-crypto-collectible-schema.md
            capabilities: [
                AssetLedger.AssetLedgerCapability.DESTROY_ASSET,
                AssetLedger.AssetLedgerCapability.UPDATE_ASSET,
                AssetLedger.AssetLedgerCapability.TOGGLE_TRANSFERS,
                AssetLedger.AssetLedgerCapability.REVOKE_ASSET
            ]
        }
        try {
            deployedLedger = await AssetLedger.AssetLedger.deploy(providerETH, ledgerProperties).then(mutation => {
                console.log('Deploying new asset ledger, it may take a few minutes.');
                return mutation.complete();
            })
            console.log('Ledger', deployedLedger)
        } catch (e) {
            console.log('Error', e)
        }
        if (deployedLedger.isCompleted()) {
            console.log('Ledger address', deployedLedger.receiverId);
            return deployedLedger;
            //return deployedLedger.receiverId;
        }
        throw new error;
    },

    // To get user ERC721 token balance
    async getUserBalance(ledgerId) {
        const assetLedger = await this.getAssetLedger(ledgerId);
        const balance = await assetLedger.getBalance(providerETH.accountId)//web3.eth.accounts[0]);
        //console.log('balance', balance);
        return balance;
    },

    async deployAsset(ledgerId, data = { id, name, description, image, owner }, schema) {
        //console.log(await sha.toInteger('0x05'));
        console.log(data)
        let cert = certificate();
        let ledger = await this.getAssetLedger(ledgerId);
        if (ledger.id === undefined || ledger.id === null) {
            throw new Error('Cannot create token without a deployed Ledger.');
        }
        let assetId = 0;
        console.log(typeof data.id);
        if (data.id === undefined || data.id === null || data.id === '')
            assetId = Date.now();
        else
            assetId = parseInt(data.id);

        //await ledger.getBalance(); //null
        console.log('id ', assetId) //parseInt(id) +1) //nan
        let acntId = await ledger.getAssetAccount(assetId);
        console.log(acntId.indexOf('0x0000000000000000000000000000000000000000')); //if -1 - post tokenised, throw error
        if (acntId.indexOf('0x0000000000000000000000000000000000000000') === -1) {
            throw new Error('Post already tokenised');
        }

        //console.log('get balance ', await ledger.getBalance(providerETH.accountId));// web3.eth.accounts[0]));
        //console.log(await ledger.getAsset(parseInt(data.id))); //assetid req
        //console.log(await ledger.getAsset(05)); //assetid req
        //console.log(await ledger.getAssetIdAt(0)); //assetid req
        //console.log(await ledger.getAssetAccount(1)); //assetid req
        //console.log(await ledger.getAbilities('0x535e13Bc461AED829828D62bFd4fd293bf45A9a0'));
        const asset = await this.generateAssetToken(ledgerId, data);
        console.log("asset in deployasset await", asset);
        const imprint1 = await cert.imprint(asset);
        console.log('New imprint', imprint1);
        const proofs = await cert.notarize(asset);
        console.log(proofs);
        const mutation = await ledger.createAsset({
            id: assetId,
            //parseInt(data.id),
            imprint: imprint1, // You must generate a new imprint for each asset
            receiverId: providerETH.accountId //this.ethProvider().then(res => {return res.accountId}),// web3.eth.accounts[0]
        }).then(mutation => {
            console.log('Deployed!');
            console.log(mutation);
            return mutation.complete();
        }).catch(e => {
            console.log('Error', e);
            throw new Error('Something went wrong while creating asset.');
        });

        console.log('mutation.complete', mutation);
        if (mutation.isCompleted()) {
            console.log('Certificate successfully created');
            mutation.tokenId = assetId;
            const paths = [['name'], ['description'], ['date'], ['owner'], ['image']];// ['image']  //error if values are empty
            const storePath = `/ledger/${ledgerId}/token/${assetId}/`;
            let req;

            /** START => Evidence Json Creation */
            const evidence = await cert.disclose(asset, paths);
            console.log('Disclose Evidence/Minimum Proofs(3rd party) => ', evidence);
            let evidenceFile = await this.createEvidenceFile(req = { path: storePath, data: evidence, assetId: assetId });
            console.log("Evidence server res", evidenceFile);
            mutation.evidence = evidenceFile.url;
            /** END => Evidence Json Creation */

            /** START => Metadata Json Creation */
            const metadata = await cert.expose(asset, paths);
            let newMetadata = {
                "$evidence": evidenceFile.url,
                "$schema": "http://json-schema.org/draft-07/schema",
                ...metadata
            }
            console.log('newMeta -> ', newMetadata);
            // metadata["$evidence"] = evidenceFile.url;
            // metadata["$schema"] = "http://json-schema.org/draft-07/schema";
            console.log('Expose metadata => ', metadata);
            let metadataFile = await this.createMetaFile(req = { path: storePath, data: newMetadata, assetId: assetId });
            console.log("Metadata server res", metadataFile);
            mutation.metadata = metadataFile.url; //add url to mutation objcet
            /** END => Metadata Json Creation */
            newMetadata["$assetId"] = assetId;
            mutation.metadataObject = newMetadata;
        }
        console.log(await mutation.tokenId);
        return mutation;
    },

    // To configure new ERC721 assets
    async generateAssetToken(ledgerId, data = { name, description, image, owner }, schema) {
        console.log(data);
        const cert = certificate(schema);

        const asset = {
            name: (data.name || 'SparkOne Token'),
            description: data.description,
            image: data.image,
            owner: data.owner,
            date: new Date(),

            /* additional attr */
            //postSubtitle: post.postSubtitle,
            //postTags: JSON.stringify(post.postTags || []),
            //userId :JSON.stringify(post.userId || post.createdBy),
        }
        console.log("asset in generateasset ==> ", asset);
        const imprint = await cert.imprint(asset);
        console.log('Imprint', imprint)
        const proofs = await cert.notarize(asset);
        console.log('Proofs ==> ', JSON.stringify(proofs));
        //this.exportToJsonFile(proofs, 'proof_'+imprint)
        const paths = [['name'], ['description'], ['date'], ['owner']];// ['image']  //error if values are empty

        /** START => Evidence Json Creation */
        const evidence = await cert.disclose(asset, paths);
        console.log('Disclose Evidence/Minimum Proofs(3rd party) => ', evidence);
        /** END => Evidence Json Creation */

        /** START => Metadata Json Creation */
        const metadata = await cert.expose(asset, paths);
        console.log('Expose metadata => ', metadata);
        let evidence2 = {
            "$schema": "http://json-schema.org/draft-07/schema",
            data: evidence,
        }
        console.log(JSON.stringify(evidence2));
        const imprint_verify = await cert.calculate(metadata, evidence2.data);
        console.log('verify => ', imprint_verify);
        return asset; //{asset: asset, evidence : evidence, metadata :metadata} ;
    },

    async getLedgerCertificates(ledgerId) {
        let ledger = await this.getAssetLedger(ledgerId);
        if (!ledger)
            throw new Error('Ledger not available.');

        const result = await ledger.getInfo();
        console.log(JSON.stringify(result));
        //console.log(await ledger.provider.accountId);
        let arr = [];
        //let totalAssets = await ledger.getBalance(providerETH.accountId);
        const min = Math.max(1, parseInt(result.supply) - 5); console.log(min);
        console.log('minimum ', min)
        //if(min === 1) min =0

        //last 5 certificates
        for (let i = parseInt(result.supply) - 1; i >= min - 1; i--) {
            if (i === -1) break;
            console.log('i -> ', i, '');
            const assetIdHex = await ledger.getAssetIdAt(i);  //get assetId from index
            const assetId = await sha.toInteger(assetIdHex);
            const asset = await ledger.getAsset(assetId);
            console.log(await ledger.getAssetAccount(assetId));
            console.log('asset ', asset);
            const owner = await ledger.getAssetAccount(assetId);
            //ledger.
            arr.push({
                assetId: asset.id,
                cert: asset.uri,
                imprint: asset.imprint,
                issued: owner
            });
        }
        console.log(arr);
        return arr;
    },

    async createMetaFile(req = { path, data, assetId }) {
        console.log('from createmetafile  => ', req);
        //let jsondata = req.data;
        //let assetid = (jsondata.assetid).toString();
        //assetid = assetid.padStart(6, "0");
        //console.log('9876543210'.padStart(8, "0"));
        //name =  name.trim().replace(/ /g,"_"); 
        //let store_location = './certificates/' + filename + '.json';

        let options = {
            path: req.path,
            fileName: 'metadata' //`${JSON.stringify(req.assetId)}_metadata`,
        }
        //upload evidence file to any file storage server and get link
        const { Location, ETag, Bucket, Key } = await scripts.uploadJsonToFile(JSON.stringify(req.data), options);
        if (Location === undefined) {
            return { status: false, url: Location };
        }
        return { status: true, url: Location };
    },

    async createEvidenceFile(req = { path, data, assetId }) {
        console.log('from createevidencefile => ', req);
        let options = {
            path: req.path,
            fileName: 'evidence' //`${JSON.stringify(req.assetId)}_evidence`,
        }
        let evidence = {
            "$schema": "http://json-schema.org/draft-07/schema",
            "data": req.data
        }
        //upload evidence file to any file storage server and get link
        const { Location, ETag, Bucket, Key } = await scripts.uploadJsonToFile(JSON.stringify(evidence), options);
        if (Location === undefined) {
            return { status: false, url: Location };
        }
        return { status: true, url: Location };
    },

    async transferAsset(data = { ledgerId, assetId, receiverId }) {
        console.log('data from transfer -> ', data);
        let ledger = await this.getAssetLedger(data.ledgerId);
        if (!ledger)
            throw new Error('Ledger not available.');
        const mutation = await ledger.transferAsset({
            receiverId: data.receiverId,
            id: data.assetId,
        })
            .then(mutation => {
                console.log('mutaion from transfer -> ', mutation);
                console.log('mutaion.comple -> ', mutation.complete());
                return mutation.complete();
            })
            .catch(err => {
                console.log(err);
                throw new Error('Asset Transfer Failed.');
            });
        if (mutation.isCompleted()) {
            let assetAcnt = await ledger.getAssetAccount(data.assetId);
            mutation.assetAccount = assetAcnt;
            return mutation;
        }
    },

    async destroyAsset(data = { ledgerId, assetId }) {
        console.log('data from destroy -> ', data);
        let ledger = await this.getAssetLedger(data.ledgerId);
        if (!ledger)
            throw new Error('Ledger not available.');
        const mutation = await ledger.destroyAsset(data.assetId)
            .then(mutation => {
                console.log('mutaion from transfer -> ', mutation);
                console.log('mutaion.comple -> ', mutation.complete());
                return mutation.complete();
            })
            .catch(err => {
                console.log(err);
                throw new Error('Asset Destruction Failed.');
            });
        if (mutation.isCompleted()) {
            return mutation;
        }
    },

    async fileExist(file_path) {
        try {
            if (fs.existsSync(file_path)) {
                //file exists
                let rawdata = fs.readFileSync(file_path);
                return JSON.parse(rawdata);
            }
            else {
                throw "File missing";
            }
        } catch (err) {
            console.error(err);
            return null;
        }
    },


    async getFilefronUrl(url) {
        return new Promise((resolve, reject) => {
            request({ url, method: 'GET' }, (error, response, body) => {
                if (error) return reject(error)

                return resolve({ body, response })
            })
        })
    }
    ,
    async verifyAsset(data = { ledgerId, assetId, metadata, schema }) {
        console.log(data);
        if (data == {} || data === undefined) {
            throw new Error('Empty Data');
        }
        //console.log( JSON.stringify(jsondata));
        let assetid = (data.assetId).toString();
        let evidenceLink = data.metadata.$evidence;
        //let metadataLink = jsondata.metadata;
        let evidence_json = await this.getFilefronUrl(evidenceLink)
            .then(r => { console.log(r); return JSON.parse(r.body); })
            .catch(e => { console.log(e); throw new Error('Error retrieving Evidence file.'); });

        console.log('evidence ', evidenceLink, evidence_json);

        const cert = certificate(data.schema);
        const metadata_json = data.metadata;
        console.log("asset in verify ==> ", metadata_json);

        // let evidence2 = {
        //     "$schema": "http://json-schema.org/draft-07/schema",
        //     data: evidence,
        // }
        // console.log(JSON.stringify(evidence2));
        const imprint_verify = await cert.calculate(metadata_json, evidence_json.data);
        console.log('verify => ', imprint_verify);
        let result = { success: false, message: '', imprint: null };
        if (imprint_verify !== null) {
            result.success = true;
            result.message = 'Token verified';
            result.imprint = imprint_verify
        }
        else result.message = 'Verification failed';
        let ledger = await this.getAssetLedger(data.ledgerId);
        let ledgerInfo = await ledger.getInfo();
        let asset = await ledger.getAsset(data.assetId);
        if (asset.imprint !== imprint_verify) result.success = false;

        return result;
    },

}

module.exports = {
    _0xcert: _0xcert,
}