import {buildPath, getChainAssetInfoPath, getChainAssetsList} from "../generic/repo-structure";
import {readJsonFile} from "../generic/json";
import {appendFileSync, createDir, isPathExistsSync, writeFileSync} from "../generic/filesystem";

console.log(`Creating build folder: ${buildPath}`)

createDir(buildPath);

[ 'ethereum' ].forEach(blockchain => {
    const blockchainJsonPath = buildPath + `/${blockchain}-token-list.json`;
    const blockchainJsonndPath = buildPath + `/${blockchain}-token-list.ndjson`;
    const blockchainCsvPath = buildPath + `/${blockchain}-token-list.csv`;

    writeFileSync(blockchainJsonPath, '');
    writeFileSync(blockchainJsonndPath, '');
    writeFileSync(blockchainCsvPath, '');

    appendFileSync(blockchainJsonPath, '[' + '\n');
    appendFileSync(blockchainCsvPath, 'Id,Name,Symbol,Status\n')

    const assets = getChainAssetsList(blockchain);

    console.log(`Aggregating ${blockchain} token list.`)

    let tokenCount = 0;
    assets.forEach(asset => {

        const assetInfoLocation = getChainAssetInfoPath('ethereum', asset)
        if (isPathExistsSync(assetInfoLocation)) {
            const assetInfo = readJsonFile(assetInfoLocation);

            if (tokenCount != 0) {
                appendFileSync(blockchainJsonPath, ',\n')
                appendFileSync(blockchainJsonndPath, '\n')
                appendFileSync(blockchainCsvPath, '\n')
            }

            const csvRow = [];
            [ 'id', 'name', 'symbol', 'status' ].forEach(field => csvRow.push(assetInfo[field]));

            appendFileSync(blockchainJsonPath, JSON.stringify(assetInfo));
            appendFileSync(blockchainJsonndPath, JSON.stringify(assetInfo));
            appendFileSync(blockchainCsvPath, csvRow.join(','));
            tokenCount++;
        }
    });


    appendFileSync(blockchainJsonPath, '\n' + ']')

    console.log(`Aggregated ${tokenCount} tokens on ${blockchain}`);
});
