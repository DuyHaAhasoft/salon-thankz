import moment from 'moment';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import randomFunctions from "./random-function";

const commonFunctions = {
    concatURL,
    hourSelect,
    exportExcel,
    minuteSelect,
    showLongText,
    formatSaleItem,
    formatPhoneNumber,
    formatMoneyNumber,
    trimAllDataObject,
    formatPaymentMethod,
    covertSizeFileIntoMB,
    prepaidGoodsExpiryDate,
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

function covertSizeFileIntoMB(sizeFile) {
    return ((sizeFile / 1024) / 1024).toFixed(4);
}

function exportExcel(data) {
const workbook = new ExcelJS.Workbook();
let worksheet = workbook.addWorksheet(
    data.title
);
            

// set header
worksheet.mergeCells("A1:F1");
const headerExcel = worksheet.getCell("A1");

headerExcel.value = data.header;

headerExcel.font = {
    family: 4,
    size: 18,
    bold: true,
    name: "Time New Roman",
};

headerExcel.height = 40;
headerExcel.alignment = { vertical: "middle", horizontal: "center" };

// set column
const columns = data.columns.map(column => column.text)
const row = worksheet.addRow([...columns]);

row.height = 30;
row.alignment = { vertical: "middle", horizontal: "center" };

for (let i = 0; i < data.columns.length; i++) {

    row._cells[i]._column.width = data.columns[i].width;
    row._cells[i].border = {
        top: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
        bottom: { style: "thin" },
    };
}

// set row
data.rows.map(function (dataRow) {
    const row = [...dataRow];

    const rowData = worksheet.addRow(row);

    rowData.height = 20;

    for (let i = 0; i < row.length; i++) {
        rowData._cells[i].alignment = { horizontal: "center" };
        rowData._cells[i].border = {
            top: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
            bottom: { style: "thin" },
        };
    }
});

workbook.xlsx
    .writeBuffer()
    .then(buffer =>
        saveAs(
            new Blob([buffer]),
            `${data.fileName}.xlsx`
        )
    )
    .catch(err => console.log("Error writing excel export", err));
}

function showLongText(text, length = 100) {
    if (text && text.trim().length > length) {
        return text.substring(0, length) + "...";
    }
    return text;
}

function formatSaleItem(item) {
    let goodId = 0;
    let amount = 0;
    let goodName = '';
    let goodPrice = 0;
    let salesItemId = 0;
    let deductionType = 0;
    let goodType = item.type;
    let relatedServiceId = 0;
    let prepaidGoodsGuid = "";
    let discountForProduct = 0;
    let discountForService = 0;
    let relatedServiceName = "";
    let deductedPrepaidGoodsRef = 0;
    let relatedServiceUnitPrice = 0;
    let prepaidGoodsExpiryDateTS = 0;
    let prepaidCardInitialBalance = 0;
    let deductedByPrepaidGoodsGuid = "";
    let deductedPrepaidGoodsRefName = "";
    let prepaidServiceInitialQuantity = 0;

    if(item.type === 1) {
        goodPrice = item.goodInfo.price;
        goodId = item.goodInfo.serviceId;
        goodName = item.goodInfo.serviceName;
        amount = item.goodInfo.price * item?.qty;
    }

    if(item.type === 2) {
        goodId = item.goodInfo.productId;
        goodName = item.goodInfo.productName;
        goodPrice = item.goodInfo.retailPrice;
        amount = item.goodInfo.retailPrice * item?.qty;
    }

    if (item.type === 3) {
        goodType = 4;
        goodPrice = item.goodInfo.price;
        goodId = item.goodInfo.prepaidCardId;
        goodName = item.goodInfo.prepaidCardName;
        amount = item.goodInfo.price * item?.qty;
        prepaidGoodsGuid = randomFunctions.guid();
        discountForProduct = item.goodInfo.discountForProduct;
        discountForService = item.goodInfo.discountForService;
        prepaidCardInitialBalance = item.goodInfo.chargeAmount;
        deductedByPrepaidGoodsGuid = "00000000-0000-0000-0000-000000000000";
        prepaidGoodsExpiryDateTS = prepaidGoodsExpiryDate(item.goodInfo.validityType, item.goodInfo.validity);
    }

    if (item.type === 4) {
        goodType = 3;
        goodPrice = item.goodInfo.price;
        goodId = item.goodInfo.prepaidServiceId;
        amount = item.goodInfo.price * item?.qty;
        prepaidGoodsGuid = randomFunctions.guid();
        goodName = item.goodInfo.prepaidServiceName;
        relatedServiceId = item.goodInfo.relatedServiceId;
        relatedServiceName = item.goodInfo.relatedServiceName;
        prepaidServiceInitialQuantity = item.goodInfo.quantity;
        deductedPrepaidGoodsRefName = item.goodInfo.prepaidServiceName;
        deductedByPrepaidGoodsGuid = "00000000-0000-0000-0000-000000000000";
        relatedServiceUnitPrice = Number((item.goodInfo.price / item.goodInfo.quantity).toFixed());
        prepaidGoodsExpiryDateTS = prepaidGoodsExpiryDate(item.goodInfo.validityType, item.goodInfo.validity);
    }

    if (item.type === 6) {
        goodType = 3;
        deductionType = 2;
        goodId = item.goodInfo.relatedServiceId;
        prepaidGoodsGuid = randomFunctions.guid();
        goodName = item.goodInfo.relatedServiceName;
        deductedPrepaidGoodsRefName = item.goodInfo.prepaidServiceName;
        deductedByPrepaidGoodsGuid = item.goodInfo.deductedByPrepaidGoodsGuid;
        goodPrice = Number((item.goodInfo.price / item.goodInfo.quantity).toFixed());
    }

    if (item.type === 7) {
        goodType = 3;
        deductionType = 2;
        salesItemId = item.goodInfo.salesId;
        goodId = item.goodInfo.relatedServiceId;
        prepaidGoodsGuid = randomFunctions.guid();
        deductedPrepaidGoodsRef = item.goodInfo.id;
        goodName = item.goodInfo.relatedServiceName;
        relatedServiceId = item.goodInfo.relatedServiceId;
        goodPrice = item.goodInfo.relatedServiceUnitPrice;
        relatedServiceName = item.goodInfo.relatedServiceName;
        deductedPrepaidGoodsRefName = item.goodInfo.prepaidServiceName;
    }

    const formattedGood = {
        amount: amount,
        clientPrepaidGoodsId: 0,
        deductedByPrepaidGoodsGuid: deductedByPrepaidGoodsGuid,
        deductedPrepaidGoodsRef: deductedPrepaidGoodsRef,
        deductedPrepaidGoodsRefName: deductedPrepaidGoodsRefName,
        deductionAmount: 0,
        deductionPoints: 0,
        deductionType: deductionType,
        discountCategoryId: 0,
        discountCategoryName: "",
        discountForClient: false,
        discountForProduct: discountForProduct,
        discountForService: discountForService,
        discountType: 2,
        discountValue: 0,
        giftCardType: 0,
        goodsCategoryId: item?.categoryInfo?.id,
        goodsCategoryName: item?.categoryInfo?.name,
        goodsId: goodId,
        goodsName: goodName,
        goodsType: goodType,
        isCustomizePrepaidGoods: false,
        prepaidCardInitialBalance: prepaidCardInitialBalance,
        prepaidCardType: 0,
        prepaidGoodsExpiryDateTS: prepaidGoodsExpiryDateTS,
        prepaidGoodsGuid: prepaidGoodsGuid,
        prepaidServiceInitialQuantity: prepaidServiceInitialQuantity,
        productCode: "",
        quantity: item?.qty ?? 0,
        relatedServiceId: relatedServiceId,
        relatedServiceName: relatedServiceName,
        relatedServiceUnitPrice: relatedServiceUnitPrice,
        salesItemId: salesItemId,
        salesTypeId: null,
        salesTypeName: "",
        smallCutDiscountEnumDefault: 0,
        staffs: [],
        supplierPrice: 0,
        unitPrice: goodPrice,
    }

    if (item.type === 3 || item.type === 4) {
        formattedGood.validity = item?.goodInfo?.validity ?? 0;
        formattedGood.validityType = item?.goodInfo?.validityType ?? 0;
    }

    if (item.deductedDepositCard) {
        formattedGood.deductionType = item?.deductedDepositCard?.deductionType;
        formattedGood.deductionAmount = item?.deductedDepositCard?.deductionAmount;
        formattedGood.deductedPrepaidGoodsRef = item?.deductedDepositCard?.deductedPrepaidGoodsRef;
        formattedGood.deductedPrepaidGoodsRefName = item?.deductedDepositCard?.deductedPrepaidGoodsRefName;
    }

    return formattedGood;
}

function prepaidGoodsExpiryDate(validityType ,validity = -1) {
    if (validity === -1) {
        return -1
    }

    let date = (new Date()).toISOString();

    if (validityType === 1) {
        date = moment(date).add(validity, 'months');
    } else {
        date = moment(date).add(validity, 'days');
    }

    date = date.add(1, 'days')
    date = date.format('YYYY-MM-DD')
    const expiredDate = moment(date).unix() - 1;

    return expiredDate;
}

function formatPaymentMethod(paymentMethod, paidDateTimeTS) {
    return {
        paidDateTimeTS: paidDateTimeTS,
        paymentAmount: 0,
        paymentMethodId: paymentMethod.id,
        paymentMethodName: paymentMethod.name,
        paymentType: 1,
        salesPaymentId: 0,
    }
}

function hourSelect() {
    const hourOptions = [];

    for(let i = 0; i < 24 ; i++ ) {
        hourOptions.push({ value: i, text: i })
    }

    return hourOptions
}

function minuteSelect() {
    const minuteOptions = [];

    for(let i = 0; i < 60 ; i++ ) {
        minuteOptions.push({ value: i, text: i })
    }

    return minuteOptions
}

export default commonFunctions