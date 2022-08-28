<template>
	<div class="sales-detail">
		<b-modal
			static
			size="xl"
			hide-footer
			:title="title"
			ref="salesDetailModal"
			header-bg-variant="info"
			:no-close-on-backdrop="true"
			:modal-class="'modal sales-detail-modal__modal'"
		>
			<div class="content modal__content">
				<div class="title content__title">{{ title }}</div>
				<div class="client-name content__client-name">
					{{ !!salesDetail && salesDetail.clientName }}
				</div>
				<div class="sales-date content__sales-date">
					{{ !!salesDetail && handleFormatDate(salesDetail.createdDateTimeTS) }}
				</div>
				<table class="table tab__table" v-if="!!salesDetail && statusScreenLaptop">
					<thead>
						<tr>
							<th v-for="field in fields" :key="field.text">
								{{ field.text }}
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in salesDetail.salesItems" :key="index">
							<td class="table__table-data table__table-data--name">
								{{ showLongText(item.goodsName, 20) }}
							</td>
							<td class="table__table-data table__table-data--price">
								{{ handleNumber(item.unitPrice) }}
							</td>
							<td class="table__table-data table__table-data--quantity">
								{{ handleNumber(item.quantity) }}
							</td>
							<td class="table__table-data table__table-data--discount">
								{{ item.discountValue ? `${item.discountValue}%` : "" }}
							</td>
							<td class="table__table-data table__table-data--price">
								{{ handleNumber(item.amount) }}
								<div class="table-data--price--initial">
									{{
										item.prepaidCardInitialBalance
											? `(${handleNumber(item.prepaidCardInitialBalance)})`
											: ""
									}}
								</div>
							</td>
							<td class="table__table-data table__table-data--staff">
								{{ item.staffs }}
							</td>
							<td class="table__table-data table__table-data--sales-type">
								{{ item.salesTypeName }}
							</td>
							<td class="table__table-data table__table-data--point-deduct">
								{{
									item.deductionPoints ? handleNumber(item.deductionPoints) : ""
								}}
							</td>
							<td class="table__table-data table__table-data--balance-deduct">
								{{
									item.deductionAmount ? handleNumber(item.deductionAmount) : ""
								}}
							</td>
						</tr>
					</tbody>
				</table>

				<div class="modal__content-small" v-if="!!salesDetail && !statusScreenLaptop">
					<div v-for="(item, index) in salesDetail.salesItems" :key="index" class="content-small__detail">
						<div class="detail__title">
							<div class="title__good-name">
								{{ showLongText(item.goodsName, 20) }},
							</div>
							<div class="title__good-amount">
								&nbsp;&nbsp;Amount {{ handleNumber(item.amount) }}
							</div>
						</div>

						<div class="detail__more">
							<div class="more__price">
								Unit Price {{ handleNumber(item.unitPrice) }}
							</div>
							<div class="more__quatity">
								&nbsp;&nbsp;Q'ty {{ handleNumber(item.quantity) }}
							</div>
							<div class="more__discount">
								&nbsp;&nbsp;Discount {{ item.discountValue ? item.discountValue : 0 }}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="footer modal__footer">
				<div class="payment-name footer__payment-name">Payment</div>
				<div class="payment-notes footer__payment-notes">
					<div class="total-sales payment-notes__total-sales">
						<div class="total-amount total-sales__total-amount">
							<span class="payment-method-name">Total Amount</span>
							{{ !!salesDetail && handleNumber(salesDetail.totalAmount) }}
						</div>
						<div class="point total-sales__point">
							<span class="payment-method-name">Point Deduction</span>
							{{ !!salesDetail && handleNumber(this.deductionPoints) }}
						</div>
						<div class="balance total-sales__balance">
							<span class="payment-method-name">Balance Deduction</span>
							{{ !!salesDetail && handleNumber(this.deductionAmount) }}
						</div>
						<div
							v-for="(payment, index) in !!salesDetail && salesDetail.payments"
							:key="index"
							class="payment-used total-sales__payment-used"
						>
							<div class="payment-type payment-used__payment-type">
								<div class="payment-name payment-type__payment-name">
									<span class="payment-method-name">
										{{ payment.paymentMethodName }}
									</span>
								</div>
								<div class="payment-value payment-type__payment-value">
									{{ handleNumber(payment.paymentAmount) }}
								</div>
							</div>
							<div class="payment-date payment-used__payment-date">
								{{ `[Paid ] ${handleFormatDateTime(payment.paidDateTimeTS)}` }}
							</div>
						</div>
						<div class="outstanding total-sales__outstanding">
							<span class="payment-method-name">Outstanding</span>
							{{ !!salesDetail && handleNumber(salesDetail.outstanding) }}
						</div>
						<div class="loyalty-point total-sales__loyalty-point">
							<span class="payment-method-name">Earn Loyalty Points</span>
							{{ !!salesDetail && handleNumber(salesDetail.earnedPoints) }}
						</div>
					</div>

					<div class="notes payment-notes__text-notes">
						<textarea :value="salesDetail && salesDetail.notes" disabled />
					</div>

					<div class="payment-notes__button--close">
						<group-button
							@cancel="onClickCancel"
							:nameButton="nameButton"
							:isShowButton="isShowGroupButton"
						/>
					</div>
				</div>
			</div>
		</b-modal>
	</div>
</template>

<script>
import constant from "@constant";
import common from "@/lib/utils/common";

import GroupButton from "../Group-Button/Group-Button.vue";

const DEFAULT_FIELDS_TABLE = {
	salesItems: { text: "Sales Items" },
	unitPrice: { text: "Unit Price" },
	quantity: { text: "Q'ty" },
	discount: { text: "Discount" },
	amount: { text: "Amount" },
	staff: { text: "Staff" },
	salesType: { text: "Sales Type" },
	pointsDeduct: { text: "Points Deduct" },
	balanceDeduct: { text: "Balance Deduct" },
};

export default {
	name: "SalonThankzSalesDetail",

	data() {
		return {
			title: "",
			salesDetail: null,
			windowWidth: window.innerWidth,
			fields: Object.assign({}, DEFAULT_FIELDS_TABLE),
			isShowGroupButton: {
				cancel: true,
				delete: false,
				confirm: false,
			},
		};
	},

	components: {
		GroupButton,
	},

	mounted() {
		this.$nextTick(() => {
			window.addEventListener("resize", this.onResize);
		});
	},

	beforeDestroy() {
		window.removeEventListener("resize", this.onResize);
	},

	computed: {
		nameButton() {
			return {
				confirm: "Save",
				cancel: "Close",
				delete: "Delete",
			};
		},

		statusScreenLaptop() {
			return this.windowWidth > constant.common.screenSize.maxScreenLaptop;
		},

		deductionPoints() {
			return this.salesDetail.salesItems.reduce((totalPoint, item) => totalPoint + item.deductionPoints, 0);
		},

		deductionAmount() {
			return this.salesDetail.salesItems.reduce((totalPoint, item) => totalPoint + item.deductionAmount, 0);
		}
	},

	methods: {
		showModal(dataModal) {
			this.title = dataModal.title;
			this.salesDetail = dataModal.salesDetail;
			this.$refs.salesDetailModal && this.$refs.salesDetailModal.show();
		},

		hideModal() {
			this.$refs.salesDetailModal && this.$refs.salesDetailModal.hide();
		},

		onClickCancel() {
			this.hideModal();
		},

		handleFormatDate(date) {
			return common.momentFunctions.FormatFullDateTime(
				common.momentFunctions.UnixMiliSecondsIntoDate(date)
			);
		},

		handleFormatDateTime(date) {
			return common.momentFunctions.FormatDateTime(
				common.momentFunctions.UnixMiliSecondsIntoDate(date)
			);
		},

		handleNumber(data) {
			const number = !!data && common.commonFunctions.formatMoneyNumber(data);
			if (data > 0) return number;
			if (number === false) return 0;
			return number;
		},

		onResize() {
			this.windowWidth = window.innerWidth;
		},

		showLongText(text, length = 20) {
			return common.commonFunctions.showLongText(text, length)
		}
	},
};
</script>

<style lang="scss" scoped>
@import "./Sales-Detail.scss";
</style>
