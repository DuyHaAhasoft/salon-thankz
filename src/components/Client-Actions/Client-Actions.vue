<template>
	<div class="client-actions-modal">
		<b-modal
			ref="clientActionsModal"
			:title="title"
			:no-close-on-backdrop="true"
			:modal-class="'modal client-actions-modal__modal'"
			size="xl"
			static
			scrollable
			hide-footer
		>
			<div class="content modal__content">
				<div>
					<div>
						<label>Client Name <span>*</span></label>
						<input />
					</div>
					<div>
						<label>Client Number</label>
						<input />
					</div>
					<div>
						<label>Mobile Number</label>
						<input />
					</div>
					<div>
						<label>Sex</label>
						<b-form-radio v-model="dataClient.sex" name="sex-radios" value="1"
							>Male</b-form-radio
						>
						<b-form-radio v-model="dataClient.sex" name="sex-radios" value="2"
							>Female</b-form-radio
						>
					</div>
					<div>
						<label>Client Group</label>
						<b-form-select
							v-model="dataClient.group"
							:options="groupClientOptions"
						></b-form-select>
					</div>
					<div>
						<label>Registered Date</label>
						<v-calendar />
					</div>
				</div>
				<div>
					<div>Click here</div>
				</div>
			</div>

			<footer class="footer modal__footer">
				<group-button @cancel="onClickCancel" />
			</footer>
		</b-modal>
	</div>
</template>

<script>
const DEFAULT_TITLE_MODAL = ["Add Client", "Edit Client"];

export default {
	name: "SalonThankzClientActions",

	data() {
		return {
			typeModal: 0,
			dataClient: {
				sex: 3,
				name: "",
				group: -1,
				number: 0,
				phone: "0385076161",
				registeredDate: "2000-03-17",
			},
			groupClientOptions: [
				{ text: "A", value: -1 },
				{ text: "B", value: 1 },
				{ text: "C", value: 2 },
			],
		};
	},

	props: {},

	components: {
		"group-button": () => import("../Group-Button/Group-Button.vue"),
	},

	mounted() {},

	computed: {
		title() {
			return DEFAULT_TITLE_MODAL[this.typeModal];
		},
	},

	methods: {
		showModal(dataModal) {
			this.typeModal = dataModal.typeModal;
			this.$refs.clientActionsModal && this.$refs.clientActionsModal.show();
		},
		hideModal() {
			this.$refs.clientActionsModal && this.$refs.clientActionsModal.hide();
		},
		onClickCancel() {
			this.hideModal();
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./Client-Action.scss";
</style>
