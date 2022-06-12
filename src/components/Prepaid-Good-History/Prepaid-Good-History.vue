<template>
	<div class="prepaid-good-history-modal">
		<b-modal
			static
			hide-footer
			:title="title"
			ref="prepaidGoodHistoryModal"
			header-bg-variant="info"
			:no-close-on-backdrop="true"
			:modal-class="'modal prepaid-good-history-modal__modal'"
		>
			<div class="">A</div>
			<button class="" @click="onClickShowSalesDetail">Sales Detail</button>

			<group-button @cancel="onClickCancel" :isShowButton="isShowGroupButton" />
		</b-modal>

		<sales-detail ref="refSalesDetail" />
	</div>
</template>

<script>
import apis from "../../lib/apis";
import session from "../../lib/utils/session";

import SalesDetail from "../Sales-Detail/Sales-Detail.vue";
import GroupButton from "../Group-Button/Group-Button.vue";

export default {
	name: "SalonThankzPrepaidGoodHistory",

	data() {
		return {
			title: "",
			infoPrepaidGood: null,
			isShowGroupButton: {
				cancel: true,
				delete: false,
				confirm: false,
			},
		};
	},

	components: {
		GroupButton,
		SalesDetail,
	},

	mounted() {},

	methods: {
		showModal(dataModal) {
			this.title = dataModal.title;
			this.infoPrepaidGood = dataModal.result.items[0];
			console.log("dataModal", dataModal);
			this.$refs.prepaidGoodHistoryModal &&
				this.$refs.prepaidGoodHistoryModal.show();
		},

		hideModal() {
			this.$refs.prepaidGoodHistoryModal &&
				this.$refs.prepaidGoodHistoryModal.hide();
		},

		onClickCancel() {
			this.hideModal();
		},

		async onClickShowSalesDetail() {
			const data = {
				salesNumber: this.infoPrepaidGood.salesNumber,
				shopId: session.shopSession.getShopId(),
				status: !this.infoPrepaidGood.status,
			};

			try {
				const res = await apis.salesApis.getSalesDetail(data);

				if (res.status !== 200) {
					throw res;
				}

				if (res.data.isOK) {
					const result = res.data.result;
					this.$refs.refSalesDetail.showModal({
						title: "Sales Detail",
						result,
					});
				} else {
					console.log(res, data);
				}
			} catch (errors) {
				console.log(errors);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./Prepaid-Good-History.scss";
</style>
