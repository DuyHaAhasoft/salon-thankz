import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const commonFunctions = {
    concatURL,
    exportExcel,
    showLongText,
    formatSaleItem,
    formatPhoneNumber,
    formatMoneyNumber,
    trimAllDataObject,
    formatPaymentMethod,
    covertSizeFileIntoMB,
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
    console.log(data.columns[i].width, row);

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
    let goodName = '';

    if(item.type === 1) {
        goodId = item.goodInfo.serviceId;
        goodName = item.goodInfo.serviceName;
    }

    if(item.type === 2) {
        goodId = item.goodInfo.productId;
        goodName = item.goodInfo.productName;
    }

    return {
            amount: item.goodInfo.price * item.qty,
			clientPrepaidGoodsId: 0,
			deductedByPrepaidGoodsGuid: "",
			deductedPrepaidGoodsRef: 0,
			deductedPrepaidGoodsRefName: "",
			deductionAmount: 0,
			deductionPoints: 0,
			deductionType: 0,
			discountCategoryId: 0,
			discountCategoryName: "",
			discountForClient: false,
			discountForProduct: 0,
			discountForService: 0,
			discountType: 2,
			discountValue: 0,
			giftCardType: 0,
			goodsCategoryId: item.categoryInfo.id,
			goodsCategoryName: item.categoryInfo.name,
			goodsId: goodId,
			goodsName: goodName,
			goodsType: item.type,
			isCustomizePrepaidGoods: false,
			prepaidCardInitialBalance: 0,
			prepaidCardType: 0,
			prepaidGoodsExpiryDateTS: 0,
			prepaidGoodsGuid: "",
			prepaidServiceInitialQuantity: 0,
			productCode: "",
			quantity: item.qty,
			relatedServiceId: 0,
			relatedServiceName: "",
			relatedServiceUnitPrice: 0,
			salesItemId: 0,
			salesTypeId: null,
			salesTypeName: "",
			smallCutDiscountEnumDefault: 0,
			staffs: [],
			supplierPrice: 0,
			unitPrice: item.goodInfo.price,
    }
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

export default commonFunctions