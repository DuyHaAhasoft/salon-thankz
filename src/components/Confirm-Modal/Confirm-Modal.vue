<template>
	<div class="confirm-modal">
		<b-modal
			static
			hide-footer
			:title="title"
			ref="confirmModal"
			header-bg-variant="info"
			:no-close-on-backdrop="true"
			:modal-class="'modal confirm-modal__modal'"
		>
			<div class="message modal__message">{{ message }}</div>

			<group-button
				@cancel="onClickCancel"
				@confirm="onClickConfirm"
				:nameButton="nameButton"
				:isShowButton="isShowGroupButton"
			/>
		</b-modal>
	</div>
</template>

<script>
import GroupButton from "../Group-Button/Group-Button.vue";

export default {
	name: "SalonThankzConfirmModal",

	data() {
		return {
			title: "",
			message: "",
			isShowGroupButton: {
				cancel: true,
				delete: false,
				confirm: true,
			},
			nameButton: {
				confirm: "Confirm",
				cancel: "Cancel",
			},

			typeGood: null,
		};
	},

	props: {},

	components: {
		GroupButton,
		// "group-button": () => import("../Group-Button/Group-Button.vue")
	},

	created() {},

	mounted() {},

	computed: {},

	methods: {
		showModal(dataModal) {
			this.title = dataModal.title;
			this.message = dataModal.message;
			this.$refs.confirmModal && this.$refs.confirmModal.show();
		},

		hideModal() {
			this.$refs.confirmModal && this.$refs.confirmModal.hide();
		},

		onClickConfirm() {
			this.$emit("confirm");
			this.hideModal();
		},

		onClickCancel() {
			this.hideModal();
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./Confirm-Modal.scss";
</style>
