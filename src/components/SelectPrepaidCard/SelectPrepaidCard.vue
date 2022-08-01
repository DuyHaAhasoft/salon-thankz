<template>
	<div>
		<ul>
			<li
				v-for="good in goodList"
				:key="good.prepaidCardId"
				@click="handleSetPCardInfo(good)"
			>
				{{ good.prepaidCardName }}
			</li>
		</ul>
		<div>
			<h3>Prepaid Card Info</h3>
			<p>{{ prepaidCardInfo.prepaidCardName }}</p>
			<p>{{ prepaidCardInfo.price }}</p>
			<p v-if="isDepositCard">{{ prepaidCardInfo.chargeAmount }}</p>
			<p>{{ prepaidCardInfo.validity }}</p>
		</div>
	</div>
</template>

<script>
import constant from "@constant";

const DEFAULT_PREPAID_CARD_INFO = {
	price: 0,
	validity: 12,
	chargeAmount: 0,
	prepaidCardName: "",
	validityType: constant.sales.validityType.month,
	prepaidCardType: constant.sales.prepaidCardType.depositCard,
};

export default {
	data() {
		return {
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
	},

	methods: {
		handleSetPCardInfo(pCardInfo) {
			this.prepaidCardInfo = Object.assign({}, pCardInfo);
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./SelectPrepaidCard.scss";
</style>
