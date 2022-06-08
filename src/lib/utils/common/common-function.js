const commonFunctions = {
    formatPhoneNumber,
    formatMoneyNumber,
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

export default commonFunctions