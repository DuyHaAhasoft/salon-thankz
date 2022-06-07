<template>
	<div class="client-actions-modal">
		<validation-observer v-slot="{ invalid }">
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
							<validation-provider
								name="name"
								rules="required|min:3"
								v-slot="{ errors }"
							>
								<label>Client Name <span>*</span></label>
								<input v-model="dataClient.clientName" />
								<div class="error-text group-input__error-text">
									{{ errors[0] }}
								</div>
							</validation-provider>
						</div>
						<div
							class="group-input group-input--number data-input__group-input data-input__group-input--number"
						>
							<validation-provider
								name="number"
								rules="required"
								v-slot="{ errors }"
							>
								<label>Client Number</label>
								<input
									type="number"
									v-model="dataClient.memberNumber"
									maxlength="10"
								/>
								<div class="error-text group-input__error-text">
									{{ errors[0] }}
								</div>
							</validation-provider>
						</div>
						<div
							class="group-input group-input--mobile data-input__group-input data-input__group-input--mobile"
						>
							<validation-provider
								name="mobile"
								rules="min:10|max:11"
								v-slot="{ errors }"
							>
								<label>Mobile Number</label>
								<input
									type="number"
									minlength="10"
									maxlength="11"
									class="no-arrow group-input--no-arrow"
									v-model="dataClient.mobileNumber"
									oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
								/>
								<div class="error-text group-input__error-text">
									{{ errors[0] }}
								</div>
							</validation-provider>
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
						<div
							class="error-client data-input__error-client"
							v-if="errorActionClient.isShow"
						>
							<div
								v-for="errorMessage in errorActionClient.errorMessages"
								:key="errorMessage.errorCode"
							>
								{{ errorMessage.errorMessage }}
							</div>
						</div>
					</div>
					<div class="avatar-image content__avatar-image">
						<div>Click here to upload avatar</div>
						<button @click="showUploadImageModal">Show</button>
					</div>
				</div>

				<footer class="footer modal__footer">
					<group-button
						@cancel="onClickCancel"
						@confirm="onClickConfirm"
						:disableConfirm="invalid"
					/>
				</footer>
			</b-modal>
		</validation-observer>
		<upload-image-modal ref="uploadImageModal" />
	</div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";

import apis from "../../lib/apis";
import common from "../../lib/utils/common";
import session from "../../lib/utils/session";
import constant from "../../lib/utils/constant";

const DEFAULT_TITLE_MODAL = ["Add Client", "Edit Client"];

const DEFAULT_DATA_CREATE_CLIENT = {
	sex: 3,
	email: null,
	notes: null,
	birthDD: "0",
	memberType: 1,
	address1: null,
	address2: null,
	postcode: null,
	clientName: "",
	birthYear: "0",
	birthMonth: "0",
	birthdayType: 1,
	memberNumber: 6,
	phoneNumber: null,
	mobileNumber: null,
	mobileNumber2: null,
	recommenderId: null,
	clientGroupId: null,
	clientRatingId: null,
	allowedMessageType: 1,
	clientGroupName: null,
	preferredStaffId: null,
	clientRatingName: null,
	preferredStaffName: null,
	clientReferralSourceId: null,
	clientReferralSourceName: null,
	shopId: session.shopSession.getShopId(),
	country: constant.payload.DEFAULT_COUNTRY,
	sessionToken: session.shopSession.getSessionToken(),
	clientInputDateTimeTS: 1654095624, // Registered Date
	shopLocation: constant.payload.DEFAULT_SHOP_LOCATION,
	// createdDateTimeTS: 1654527624, Time create client
};

const DEFAULT_GROUP_CLIENT = {
	clientGroupId: null,
	clientGroupName: null,
};

const DEFAULT_ERROR_MESSAGES = {
	isShow: false,
	errorMessages: [],
};

export default {
	name: "SalonThankzClientActions",

	data() {
		return {
			typeModal: 0,
			registeredDate: Date.now(),
			groupClient: Object.assign({}, DEFAULT_GROUP_CLIENT),
			dataClient: Object.assign({}, DEFAULT_DATA_CREATE_CLIENT),
			errorActionClient: Object.assign({}, DEFAULT_ERROR_MESSAGES),
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
		ValidationProvider,
		ValidationObserver,
		"group-button": () => import("../Group-Button/Group-Button.vue"),
		"upload-image-modal": () => import("../Upload-Image/Upload-Image.vue"),
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
							clientGroupName: group.itemName,
							clientGroupId: group.clientGroupId,
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

			const currentDateTime = common.momentFunction.DateNowIntoUnix();

			if (currentDateTime < this.dataClient.clientInputDateTimeTS) {
				alert("Registerd Date Client cannot be greater than current time");
				return;
			}

			try {
				let res;
				if (!this.typeModal) {
					this.dataClient.createdDateTimeTS =
						common.momentFunction.DateNowIntoUnix();

					res = await apis.clientApi.createNewClient("DEV", this.dataClient);
				} else {
					this.dataClient.editedDateTimeTS =
						common.momentFunction.DateNowIntoUnix();
					res = await apis.clientApi.editClient("DEV", this.dataClient);
				}

				if (res.status !== 200) throw res.message;

				if (res.data.isOK) {
					this.$emit("loadClient");
					this.hideModal();
					this.errorActionClient.isShow = false;
				} else {
					this.errorActionClient.isShow = true;
					this.errorActionClient.errorMessages = [...res.data.errorMessages];
				}
			} catch (errors) {
				console.log(errors);
			}
		},

		onClickCancel() {
			this.hideModal();
			this.handleResetData();
		},

		handleResetData() {
			this.groupClient = Object.assign({}, DEFAULT_GROUP_CLIENT);

			// Reset Data Client
			this.dataClient = Object.assign(
				{},
				common.clientFunctions.ResetDataClient()
			);

			this.registeredDate = Date.now();

			//Reset Error Messages
			this.errorActionClient = Object.assign(
				{},
				common.messageFunctions.ResetErrorMessages()
			);
		},

		showUploadImageModal() {
			const dataClient = this.dataClient.clientId;
			this.$refs.uploadImageModal.showModal({
				title: "UploadImage",
				dataClient,
			});
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./Client-Action.scss";
</style>
