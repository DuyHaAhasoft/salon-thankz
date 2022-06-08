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
			<div class="message modal__message">{{message}}</div>
			
			<group-button 
				@cancel="onClickCancel"
				@delete="onClickDelete"
				:isShowButton="isShowGroupButton"
			/>
		</b-modal>
	</div>
</template>

<script>
export default {
	name: "SalonThankzConfirmModal",

	data() {
		return {
			title: "",
            message: "",
			isShowGroupButton: {
				cancel: true,
				delete: true,
				confirm: false,
			}
		};
	},

	props: {},

	components: {
		"group-button": () => import("../Group-Button/Group-Button.vue")
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

        onClickDelete() {
            this.$emit("confirm")
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
