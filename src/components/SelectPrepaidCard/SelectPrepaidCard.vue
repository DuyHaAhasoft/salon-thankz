<template>
	<div class="select-prepaid-card">
		<div class="prepaid-card-list select-prepaid-card__prepaid-card-list">
			<div class="title prepaid-card-list__title">Prepaid Card List</div>

			<div class="list-items prepaid-card-list__list-items">
				<div
					v-for="good in goodList"
					:key="good.prepaidCardId"
					@click="handleSetPCardInfo(good)"
					:class="{
						'item-selected':
							good.prepaidCardId === prepaidCardInfo.prepaidCardId,
					}"
					class="item list-items__item"
				>
					{{ good.prepaidCardName }}
				</div>
			</div>
		</div>

		<div class="prepaid-card-info select-prepaid-card__prepaid-card-info">
			<div class="title prepaid-card-info__title">Prepaid Card Information</div>

			<div class="info-box prepaid-card-info__info-box">
				<div class="info info--name info-box__info">
					{{ prepaidCardInfo.prepaidCardName }}
				</div>

				<div class="info info--price info-box__info">
					<label>Sales Price</label>
					<input type="text" v-model="prepaidCardPrice" />
				</div>

				<div
					v-if="isDepositCard"
					class="info info--earned-amount info-box__info"
				>
					<label>Earned Amount</label>
					<input type="text" v-model="prepaidCardChargeAmount" />
				</div>

				<div class="info info--validity info-box__info">
					<label>Validity</label>

					<div class="validity-value validity__validity-value">
						<input
							v-model="prepaidCardValidity"
							:class="classDisableValidity"
							:disabled="isDisableValidityInput"
						/>

						<b-form-checkbox
							v-model="isNoLimit"
							id="checkbox-no-limit"
							name="checkbox-no-limit"
							class="checkbox-no-limit"
						>
							Nolimt
						</b-form-checkbox>
					</div>

					<div class="validity-type validity__validity-type">
						<button class="btn btn__month">Month</button>
						<button class="btn btn__day">Days</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import common from "@common";
import constant from "@constant";

const DEFAULT_PREPAID_CARD_INFO = {
	price: 0,
	validity: 12,
	chargeAmount: 0,
	prepaidCardId: 0,
	prepaidCardName: "",
	validityType: constant.sales.validityType.month,
	prepaidCardType: constant.sales.prepaidCardType.depositCard,
};

export default {
	data() {
		return {
			isNoLimit: false,
			prepaidCardInfo: Object.assign({}, DEFAULT_PREPAID_CARD_INFO),
		};
	},

	props: {
		goodList: {
			type: Array,
			default: function () {
				return [];
			},
		},
	},

	computed: {
		isDepositCard() {
			return (
				this.prepaidCardInfo.prepaidCardType ===
				constant.sales.prepaidCardType.depositCard
			);
		},

		isDisableValidityInput() {
			return this.isNoLimit;
		},

		classDisableValidity() {
			return this.isDisableValidityInput ? "disabled-validity" : "";
		},

		prepaidCardPrice: {
			get: function () {
				return this.handleFormatNumber(this.prepaidCardInfo.price);
			},
			set: function (value) {
				this.prepaidCardInfo.price = Number(value.replaceAll(",", ""));
			},
		},

		prepaidCardChargeAmount: {
			get: function () {
				return this.handleFormatNumber(this.prepaidCardInfo.chargeAmount);
			},
			set: function (value) {
				this.prepaidCardInfo.chargeAmount = Number(value.replaceAll(",", ""));
			},
		},

		prepaidCardValidity: {
			get: function () {
				return this.handleFormatNumber(this.prepaidCardInfo.validity);
			},
			set: function (value) {
				this.prepaidCardInfo.validity = Number(value.replaceAll(",", ""));
			},
		},
	},

	beforeUpdate() {
		if (!this.prepaidCardInfo?.prepaidCardName?.length) {
			this.prepaidCardInfo = this.goodList?.[0] ?? DEFAULT_PREPAID_CARD_INFO;
			this.isNoLimit = this.prepaidCardInfo?.validity === -1 ?? false;
		}
	},

	watch: {
		isNoLimit: {
			handler: function (value) {
				if (!value && this.prepaidCardInfo?.validity === -1) {
					this.prepaidCardInfo.validity = 12;
				}
			},
		},

		prepaidCardInfo: {
			handler: function () {
				if (this.prepaidCardInfo?.prepaidCardId) {
					this.selectedPrepaidCard(this.prepaidCardInfo);
				}
			},

			deep: true,
		},
	},

	methods: {
		handleSetPCardInfo(pCardInfo) {
			this.prepaidCardInfo = Object.assign({}, pCardInfo);
			this.isNoLimit = this.prepaidCardInfo?.validity === -1 ?? false;

			this.selectedPrepaidCard(pCardInfo);
		},

		handleFormatNumber(data) {
			let number = 0;
			if (data > 0) {
				number = common.commonFunctions.formatMoneyNumber(data);
			}
			return number;
		},

		selectedPrepaidCard(good = null) {
			this.$emit("handleSelectPrepaidCard", good);
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./SelectPrepaidCard.scss";
</style>
