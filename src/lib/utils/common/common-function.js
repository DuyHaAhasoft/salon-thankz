const commonFunctions = {
    concatURL,
    formatPhoneNumber,
    formatMoneyNumber,
    trimAllDataObject,
}

function formatPhoneNumber(phone) {
    let mobileNumber = phone.split("")

    if(mobileNumber.length > 9 && mobileNumber.length < 12) {
        mobileNumber.splice(4,0,"-")
        mobileNumber.splice(8,0,"-")
    }
    
    mobileNumber = mobileNumber.join('');

    return mobileNumber
}

function formatMoneyNumber(money) {
    return money.toLocaleString('en-US')
}

function trimAllDataObject(dataObject) {
    const keys = Object.keys(dataObject);

    for (let i = 0; i < keys.length; i++) {
        if (typeof dataObject[keys[i]] === 'string') {
            dataObject[keys[i]] = dataObject[keys[i]].trim()
        }
    }

    return dataObject
}

function concatURL({defaultURL, pathURL}) {
    let url = defaultURL;

    for(let i = 0; i < pathURL.length; i++) {
        if(pathURL[i].trim())
            url += '/' + pathURL[i].trim();
    }

    return url;
}

export default commonFunctions