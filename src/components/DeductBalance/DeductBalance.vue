<template>
    <div class="deduct-balance-modal">
        <b-modal
			static
			size="xl"
			hide-footer
			:title="title"
			@hide="resetModal"
			header-bg-variant="info"
			ref="deductBalanceModal"
			:no-close-on-backdrop="true"
			:modal-class="'modal deduct-balance-modal__modal'"
		>
            <table>
                <thead>
                    <tr>
                        <th v-for="field in fields" :key="field.text">
                            {{ field.text }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr 
                        :key="index"
                        v-for="(depositCard, index) in listDepositCard"
                        :class="cardClass(depositCard.prepaidCardId)"
                        @click="handleCardSelected(depositCard.prepaidCardId)"
                    >
                        <td class="table__table-data">
                            {{ showLongText(depositCard.prepaidCardName, 20) }}
                        </td>
                        <td class="table__table-data">
                            {{ handleFormatNumber(depositCard.balance) }}
                        </td>
                        <td class="table__table-data">
                            {{ handleFormatDate(depositCard.expiryDateTS) }}
                        </td>
                        <td class="table__table-data">
                            <input v-if="isDeduct(depositCard.prepaidCardId)" v-model="balance"/>
                            <input v-else disabled />
                        </td>
                    </tr>
                </tbody>
            </table>
            <group-button
                @cancel="hideModal"
                @confirm="handleAddDeduct"
                :isShowButton="isShowButton"
            />
        </b-modal>
    </div>
</template>

<script>
import common from "@common";
import GroupButton from "@components/Group-Button/Group-Button.vue";


const DEFAULT_FIELD_ITEM = {
	prepaidCardName: { text: "Prepaid Cards" },
	balance: { text: "Balance" },
    expiryDateTS: { text: "Expiry Date" },
    deduct: {text: "Deduct"},
};

export default {
    data() {
        return {
            goodId: -1,
            maxDeduct: 0,
            balanceDeduct: 0,
            selectedCardId: 0,
            listDepositCard: [],
            fields: Object.assign({}, DEFAULT_FIELD_ITEM),
        }
    },

    components: {
        GroupButton,
    },

    computed: {
        title() {
            return "Balance Deduction";
        },

        balance: {
            get: function () {
				return this.handleFormatNumber(this.balanceDeduct);
            },
            
            set: function (value) {
                const balanceDeduct = Number(value.replaceAll(",", ""));
                const selectedCard = this.listDepositCard.find(card => card.prepaidCardId = this.selectedCardId)

                if (balanceDeduct > selectedCard?.balance) {
                    this.balanceDeduct = 0;
                    this.balanceDeduct = Number(selectedCard?.balance || 0);
                } else if (balanceDeduct > this.maxDeduct) {
                    this.balanceDeduct = 0;
                    this.balanceDeduct = Number(this.maxDeduct || 0);
                } else {
                    this.balanceDeduct = balanceDeduct;
                }
			},
		},

        isShowButton() {
			return {
				confirm: true,
				delete: false,
				cancel: true,
			};
		},
    },

    methods: {
        showModal(dataModal) {
            this.goodId = dataModal.goodId;
            this.maxDeduct = dataModal.maxDeduct;
            this.listDepositCard = dataModal.data.items;
            this.selectedCardId = dataModal.data.items?.[0]?.prepaidCardId ?? 0;

            if (dataModal.maxDeduct > dataModal.data.items?.[0]?.balance) {
                this.balanceDeduct = dataModal.data.items?.[0]?.balance ?? 0;
            } else {
                this.balanceDeduct = dataModal.maxDeduct;
            }
            
            this.$refs.deductBalanceModal && this.$refs.deductBalanceModal.show();
        },

        hideModal() {
			this.resetModal();
			this.$refs.deductBalanceModal && this.$refs.deductBalanceModal.hide();
        },

        resetModal() {
            this.listDepositCard = [];
        },

        handleAddDeduct() {
            const cardInfo = this.listDepositCard.find(card => card.prepaidCardId = this.selectedCardId);

            this.$emit('handleAddDeduct', { cardInfo, balanceDeduct: this.balanceDeduct, goodId: this.goodId });

            this.hideModal();
        },

        showLongText(text, length) {
			return common.commonFunctions.showLongText(text, length);
        },

        handleFormatNumber(data) {
			let number = 0;
			if (data > 0) {
				number = common.commonFunctions.formatMoneyNumber(data);
			} else if (data < 0) {
				number = common.commonFunctions.formatMoneyNumber(data);
			}
			return number;
        },

        handleFormatDate(date) {
			if (date === -1) return "No Limit";

			return common.momentFunctions.FormatDate(
				common.momentFunctions.UnixMiliSecondsIntoDate(date)
			);
        },

        handleCardSelected(cardId) {
            const selectedCard = this.listDepositCard.find(card => card.prepaidCardId === cardId)

            if (this.balanceDeduct > selectedCard.balance) {
                this.balanceDeduct = selectedCard.balance
            }

            this.selectedCardId = cardId;
        },

        isDeduct(cardId) {
            return cardId === this.selectedCardId;
        },

        cardClass(cardId) {
            return [
                {
                    'table__card-selected card-selected': cardId === this.selectedCardId,
                }
            ]
        },
    },
}
</script>

<style lang="scss" scoped>
    @import './DeductBalance.scss';
</style>