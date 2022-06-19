const sales = {
    prepaidCardHistoryType: [
        { value: 1,  text: 'Sales' },
        { value: 6,  text: 'Refund' },
        { value: 14, text: 'Import' },
        { value: 4,  text: 'Deduction' },
        { value: 2,  text: 'Sales Edited' },
        { value: 3,  text: 'Sales Deleted' },
        { value: 7,  text: 'Refund Deleted' },
        { value: 12, text: 'Balance Edited' },
        { value: 10, text: 'Balance Move In' },
        { value: 11, text: 'Balance Move Out' },
        { value: 15, text: 'Deduction Edited' },
        { value: 5,  text: 'Deduction Deleted' },
        { value: 8,  text: 'Refund By Balance' },
        { value: 17, text: 'Sales Date Edited' },
        { value: 13, text: 'Expiry Date Edited' },
        { value: 9,  text: 'Refund By Balance Deleted' },
    ],

    prepaidCardHistoryTypeEnum: {
        sales: 1,
        refund: 6,
        import: 14,
        deduction: 4,
        salesEdited: 2,
        salesDeleted: 3,
        refundDeleted: 7,
        balanceMoveIn: 10,
        balanceEdited: 12,
        refundByBalance: 8,
        balanceMoveOut: 11,
        discountEdited: 16,
        deductionDeleted: 5,
        deductionEdited: 15,
        salesDateEdited: 17,
        expiryDateEdited: 13,
        refundByBalanceDeleted: 9,
    },

    typePrepaidGood: {
        card: 0,
        service: 1
    },
}

export default sales