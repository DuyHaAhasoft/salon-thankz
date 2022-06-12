<template>
	<div class="sales-detail">
		<b-modal
			static
			hide-footer
			:title="title"
			ref="salesDetailModal"
			header-bg-variant="info"
			:no-close-on-backdrop="true"
			:modal-class="'modal sales-detail-modal__modal'"
		>
			<div class="">B</div>

			<group-button @cancel="onClickCancel" :isShowButton="isShowGroupButton" />
		</b-modal>
	</div>
</template>

<script>
import GroupButton from "../Group-Button/Group-Button.vue";

export default {
	name: "SalonThankzSalesDetail",

	data() {
		return {
			title: "",
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

	mounted() {},

	methods: {
		showModal(dataModal) {
			this.title = dataModal.title;
			console.log("dataModal", dataModal);
			this.$refs.salesDetailModal && this.$refs.salesDetailModal.show();
		},

		hideModal() {
			this.$refs.salesDetailModal && this.$refs.salesDetailModal.hide();
		},

		onClickCancel() {
			this.hideModal();
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./Sales-Detail.scss";
</style>
