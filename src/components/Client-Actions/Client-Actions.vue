<template>
	<div class="client-actions-modal">
		<b-modal
			ref="clientActionsModal"
			:title="title"
			:no-close-on-backdrop="true"
			:modal-class="'modal client-actions-modal__modal'"
			size="xl"
			static
			hide-footer
			@hide="handleResetData"
		>
			<div class="content modal__content">
				<div class="data-input content__data-input">
					<div
						class="group-input group-input--name data-input__group-input data-input__group-input--name"
					>
						<label>Client Name <span>*</span></label>
						<input v-model="dataClient.clientName" />
					</div>
					<div
						class="group-input group-input--number data-input__group-input data-input__group-input--number"
					>
						<label>Client Number</label>
						<input v-model="dataClient.memberNumber" />
					</div>
					<div
						class="group-input group-input--mobile data-input__group-input data-input__group-input--mobile"
					>
						<label>Mobile Number</label>
						<input v-model="dataClient.mobileNumber" />
					</div>
					<div
						class="group-input group-input--sex data-input__group-input data-input__group-input--sex"
					>
						<label>Sex</label>
						<b-form-radio v-model="dataClient.sex" name="sex-radios" value="1"
							>Male</b-form-radio
						>
						<b-form-radio v-model="dataClient.sex" name="sex-radios" value="2"
							>Female</b-form-radio
						>
					</div>
					<div
						class="group-input group-input--group data-input__group-input data-input__group-input--group"
					>
						<label>Client Group</label>
						<b-form-select
							v-model="groupClient"
							:options="clientGroupOptions"
						></b-form-select>
					</div>
					<div
						class="group-input group-input--register-date data-input__group-input data-input__group-input--register-date"
					>
						<label>Registered Date <span>*</span></label>
						<v-date-picker
							v-model="registeredDate"
							:masks="masks"
							class="date-picker group-input--register-date__date-picker"
						>
							<template v-slot="{ inputValue, inputEvents }">
								<input
									class="input-date-picker date-picker__input-date-picker"
									:value="inputValue"
									v-on="inputEvents"
								/>
							</template>
						</v-date-picker>
					</div>
				</div>
				<div>
					<div>Click here</div>
				</div>
			</div>

			<footer class="footer modal__footer">
				<group-button @cancel="onClickCancel" @confirm="onClickConfirm" />
			</footer>
		</b-modal>
	</div>
</template>

<script>
import apis from "../../lib/apis";
import common from "../../lib/utils/common";
import session from "../../lib/utils/session";
import constant from "../../lib/utils/constant";

const DEFAULT_TITLE_MODAL = ["Add Client", "Edit Client"];

const DEFAULT_DATA_CREATE_CLIENT = {
	address1: null,
	address2: null,
	allowedMessageType: 1,
	birthDD: "0",
	birthMonth: "0",
	birthYear: "0",
	birthdayType: 1,
	clientGroupId: null,
	clientGroupName: null,
	// Registered Date
	clientInputDateTimeTS: 1654095624,
	clientName: "",
	clientRatingId: null,
	clientRatingName: null,
	clientReferralSourceId: null,
	clientReferralSourceName: null,
	country: constant.payload.DEFAULT_COUNTRY,
	// Time create client
	// createdDateTimeTS: 1654527624,
	email: null,
	memberNumber: 6,
	memberType: 1,
	mobileNumber: "123456789101" || null,
	mobileNumber2: null,
	notes: null,
	phoneNumber: null,
	postcode: null,
	preferredStaffId: null,
	preferredStaffName: null,
	recommenderId: null,
	sessionToken: session.shopSession.getSessionToken(),
	sex: 3,
	shopId: session.shopSession.getShopId(),
	shopLocation: constant.payload.DEFAULT_SHOP_LOCATION,
};

const DEFAULT_GROUP_CLIENT = {
	clientGroupId: null,
	clientGroupName: null,
};

export default {
	name: "SalonThankzClientActions",

	data() {
		return {
			typeModal: 0,
			dataClient: Object.assign({}, DEFAULT_DATA_CREATE_CLIENT),
			groupClient: Object.assign({}, DEFAULT_GROUP_CLIENT),
			registeredDate: Date.now(),
			inputProps: {
				class: "input",
			},
			masks: {
				input: "YYYY-MM-DD",
			},
		};
	},

	props: {},

	components: {
		"group-button": () => import("../Group-Button/Group-Button.vue"),
	},

	created() {},

	mounted() {},

	computed: {
		title() {
			return DEFAULT_TITLE_MODAL[this.typeModal];
		},

		clientGroupOptions() {
			const clientGroup = session.clientSession
				.getClientSetup()
				.clientGroup.map(function (group) {
					return {
						value: {
							clientGroupId: group.clientGroupId,
							clientGroupName: group.itemName,
						},
						text: group.itemName,
					};
				});
			return [
				{
					value: { clientGroupId: null, clientGroupName: null },
					text: "Select",
				},
				...clientGroup,
			];
		},
	},

	methods: {
		showModal(dataModal) {
			this.typeModal = dataModal.typeModal;
			this.dataClient.memberNumber = dataModal?.memberNumber || 0;
			if (dataModal.dataClient && dataModal.dataClient !== null) {
				this.dataClient = Object.assign(
					DEFAULT_DATA_CREATE_CLIENT,
					dataModal.dataClient
				);
				this.groupClient = {
					clientGroupId: dataModal?.dataClient?.clientGroupId,
					clientGroupName: dataModal?.dataClient?.clientGroupName,
				};
				this.registeredDate = common.momentFunction.UnixMiliSecondsIntoDate(
					dataModal?.dataClient?.clientInputDateTimeTS
				);
			}
			this.$refs.clientActionsModal && this.$refs.clientActionsModal.show();
		},

		hideModal() {
			this.$refs.clientActionsModal && this.$refs.clientActionsModal.hide();
		},

		async onClickConfirm() {
			this.dataClient.clientGroupId = this.groupClient.clientGroupId;
			this.dataClient.clientGroupName = this.groupClient.clientGroupName;
			this.dataClient.clientInputDateTimeTS =
				common.momentFunction.DateIntoUnix(
					common.momentFunction.FormatDate(this.registeredDate)
				);

			try {
				let res;
				if (!this.typeModal) {
					this.dataClient.createdDateTimeTS =
						common.momentFunction.DateNowIntoUnix();

					res = await apis.clientApi.createNewClient("DEV", this.dataClient);
				} else {
					this.dataClient.editedDateTimeTS =
						common.momentFunction.DateNowIntoUnix();
					console.log(this.dataClient);
					res = await apis.clientApi.editClient("DEV", this.dataClient);
				}

				if (res.status !== 200) throw res.message;

				if (res.data.isOK) {
					this.$emit("loadClient");
					this.hideModal();
				} else {
					alert("Errors");
				}
			} catch (errors) {
				console.log(errors);
			}
		},

		onClickCancel() {
			this.hideModal();
		},

		handleResetData() {
			this.groupClient = Object.assign({}, DEFAULT_GROUP_CLIENT);
			this.dataClient = Object.assign({}, DEFAULT_DATA_CREATE_CLIENT);
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./Client-Action.scss";
</style>
