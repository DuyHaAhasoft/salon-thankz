<template>
	<div class="notification-modal">
		<b-modal
			static
			scrollable
			hide-footer
			ref="modal"
			:title="modalTitle"
			header-bg-variant="info"
			:no-close-on-backdrop="true"
			:modal-class="'modal notification-modal__modal'"
		>
			<div
				class="message modal__message"
				v-for="message in listMessage"
				:key="message.errorCode"
			>
				{{ message.errorMessage }}
			</div>

			<footer class="footer modal__footer">
				<button class="btn footer__btn" @click="onCancel">OK</button>
			</footer>
		</b-modal>
	</div>
</template>

<script>
export default {
	name: "NotificationModal",
	data() {
		return {
			listMessage: [],
		};
	},
	props: {
		modalTitle: {
			type: String,
			default: "Error",
		},
	},
	methods: {
		showModal(dataModal) {
			this.listMessage = dataModal.listMessage;
			this.$refs.modal && this.$refs.modal.show();
		},
		hideModal() {
			this.$refs.modal && this.$refs.modal.hide();
		},
		onCancel() {
			this.hideModal();
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./Notification.scss";
</style>
