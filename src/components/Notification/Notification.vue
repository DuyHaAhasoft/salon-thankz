<template>
	<div class="nofication-modal">
		<b-modal
			ref="modal"
			:title="modalTitle"
			:no-close-on-backdrop="true"
			:modal-class="'modal nofication-modal__modal'"
			static
			scrollable
			hide-footer
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
	name: "NoficationModal",
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
