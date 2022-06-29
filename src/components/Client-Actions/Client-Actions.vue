<template>
	<div class="client-actions-modal">
		<validation-observer v-slot="{ invalid }">
			<b-modal
				static
				hide-footer
				:title="title"
				@hide="handleResetData"
				header-bg-variant="info"
				ref="clientActionsModal"
				:no-close-on-backdrop="true"
				:size="typeModal ? 'xl' : 'lg'"
				:modal-class="'modal client-actions-modal__modal'"
			>
				<div
					class="content modal__content"
					:class="{ 'modal__content--add-client': !typeModal }"
				>
					<div class="data-input content__data-input">
						<div
							class="group-input group-input--name data-input__group-input data-input__group-input--name"
						>
							<validation-provider
								name="name"
								rules="required|min:3|max:50"
								v-slot="{ errors }"
							>
								<label>Client Name <span>*</span></label>
								<input
									maxlength="50"
									placeholder="Ex: ThankZ"
									v-model="dataClient.clientName"
								/>
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
								rules="required|max:16"
								v-slot="{ errors }"
							>
								<label>Client Number</label>
								<input
									minlength="1"
									type="number"
									maxlength="16"
									placeholder="Ex: 1703"
									v-model="dataClient.memberNumber"
									oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
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
									placeholder="Ex: 0385076161"
									v-model="dataClient.mobileNumber"
									class="no-arrow group-input--no-arrow"
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
							<label>Gender</label>
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

					<div
						v-if="typeModal && statusScreenLaptop"
						@click="showUploadImageModal"
						class="avatar-image content__avatar-image"
					>
						<div
							v-if="urlImageAvatar === '' ? true : false"
							class="message avatar-image__message"
						>
							Click here to upload avatar
						</div>
						<img
							v-if="urlImageAvatar !== '' ? true : false"
							:src="urlImageAvatar"
							class="avatar-image__img-avatar"
						/>
					</div>
				</div>

				<footer class="footer modal__footer">
					<button
						v-if="!statusScreenLaptop"
						@click="showUploadImageModal"
						class="footer__btn-upload-image"
					>
						{{ urlImageAvatar === "" ? "Add Avatar" : "View Avatar" }}
					</button>
					<group-button
						class="footer__group-button"
						@cancel="onClickCancel"
						@confirm="onClickConfirm"
						@delete="onClickDelete"
						:isShowButton="isShowButton"
						:disableConfirm="invalid"
					/>
				</footer>
				<div>
					<client-tabs
						v-if="typeModal"
						ref="refClientTabs"
						@loading="handleLoading"
						:dataSalesHistory="dataSalesHistory"
						:dataPrepaidCards="dataPrepaidCards"
						@getPrepaidCard="handleGetPrepaidCard"
						@getSalesHistory="handleGetSalesHistory"
						:dataPrepaidServices="dataPrepaidServices"
						@getPrepaidService="handleGetPrepaidService"
					/>
				</div>
			</b-modal>
		</validation-observer>

		<upload-image-modal
			ref="uploadImageModal"
			@loading="handleLoading"
			@uploadImage="handleUploadAvatar"
			@deleteImage="handleDeleteAvatar"
			@updateUrlImage="updateUrlImageAvatar"
		/>
		<notification modalTitle="Notification" ref="refNotification" />
		<confirm-modal ref="refConfirmModal" @confirm="handleDeleteClient" />
	</div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";

import apis from "../../lib/apis";
import common from "../../lib/utils/common";
import session from "../../lib/utils/session";
import constant from "../../lib/utils/constant";

//Components
import ClientTabs from "@components/Client-Tabs/Client-Tabs.vue";
import GroupButton from "@components/Group-Button/Group-Button.vue";
import Notification from "@components/Notification/Notification.vue";
import ConfirmModal from "@components/Confirm-Modal/Confirm-Modal.vue";
import UploadImageModal from "@components/Upload-Image/Upload-Image.vue";

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
			urlImageAvatar: "",
			dataSalesHistory: {},
			dataPrepaidCards: {},
			dataPrepaidServices: {},
			registeredDate: Date.now(),
			windowWidth: window.innerWidth,
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
		ClientTabs,
		GroupButton,
		Notification,
		ConfirmModal,
		UploadImageModal,
		ValidationProvider,
		ValidationObserver,
	},

	created() {},

	mounted() {
		this.$nextTick(() => {
			window.addEventListener("resize", this.onResize);
		});
	},

	beforeDestroy() {
		window.removeEventListener("resize", this.onResize);
	},

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

		statusScreenLaptop() {
			return this.windowWidth > constant.common.screenSize.maxScreenLaptop;
		},

		statusScreenPhone() {
			return this.windowWidth < constant.common.screenSize.maxScreenPhone;
		},

		isShowButton() {
			return {
				delete: this.typeModal,
				cancel: true,
				confirm: true,
			};
		},
	},

	methods: {
		async showModal(dataModal) {
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
				this.registeredDate = common.momentFunctions.UnixMiliSecondsIntoDate(
					dataModal?.dataClient?.clientInputDateTimeTS
				);
			}

			if (this.dataClient.imageName && this.dataClient.imagePath) {
				const pathURL = [this.dataClient.imagePath, this.dataClient.imageName];
				this.urlImageAvatar = common.commonFunctions.concatURL({
					defaultURL: constant.api.DEFAULT_URL_IMAGE.CLIENT,
					pathURL,
				});
			}

			await this.handleGetPrepaidCard();

			this.$refs.clientActionsModal && this.$refs.clientActionsModal.show();
		},

		hideModal() {
			this.$refs.clientActionsModal && this.$refs.clientActionsModal.hide();
		},

		async onClickConfirm() {
			this.dataClient.clientGroupId = this.groupClient.clientGroupId;
			this.dataClient.clientGroupName = this.groupClient.clientGroupName;
			this.dataClient.clientInputDateTimeTS =
				common.momentFunctions.DateIntoUnix(
					common.momentFunctions.FormatDate(this.registeredDate)
				);

			const currentDateTime = common.momentFunctions.DateNowIntoUnix();

			if (currentDateTime < this.dataClient.clientInputDateTimeTS) {
				alert("Registered Date Client cannot be greater than current time");
				return;
			}

			try {
				this.$emit("loading", true);

				let res;
				if (!this.typeModal) {
					this.dataClient.createdDateTimeTS =
						common.momentFunctions.DateNowIntoUnix();

					this.dataClient = common.commonFunctions.trimAllDataObject(
						this.dataClient
					);

					res = await apis.clientApis.createNewClient(this.dataClient);
				} else {
					this.dataClient.editedDateTimeTS =
						common.momentFunctions.DateNowIntoUnix();

					this.dataClient = common.commonFunctions.trimAllDataObject(
						this.dataClient
					);

					res = await apis.clientApis.editClient(this.dataClient);
				}

				if (res.status !== 200) throw res.message;

				if (res.data.isOK) {
					this.$emit("loadClient");

					this.$emit("loading", false);

					this.hideModal();
					this.errorActionClient.isShow = false;
				} else {
					this.$emit("loading", false);

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

			//Reset URL Image Avatar
			this.urlImageAvatar = "";

			//Reset Prepaid Goods
			this.dataSalesHistory = {};
			this.dataPrepaidCards = {};
			this.dataPrepaidServices = {};
		},

		showUploadImageModal() {
			const dataClient = {
				clientId: this.dataClient.clientId,
				clientImageId: this.dataClient.clientImageId,
			};

			this.$refs.uploadImageModal.showModal({
				dataClient,
				title: this.urlImageAvatar
					? "Delete Avatar Image"
					: "Upload Avatar Image",
				urlImageAvatar: this.urlImageAvatar,
			});
		},

		updateUrlImageAvatar({ clientImageId, urlImageAvatar }) {
			this.urlImageAvatar = urlImageAvatar;
			this.dataClient.clientImageId = clientImageId;
		},

		handleLoading(value) {
			this.$emit("loading", value);
		},

		async handleUploadAvatar(file) {
			const formData = new FormData();

			formData.append("fomrFile", file);
			formData.append("clientId", this.dataClient.clientId);
			formData.append("shopId", session.shopSession.getShopId());
			formData.append("countryCode", constant.payload.DEFAULT_COUNTRY);

			this.$emit("loading", true);

			try {
				const res = await apis.clientApis.uploadClientImage(formData);

				if (res.status !== 200) throw res;

				if (res.data.isOK) {
					const pathURL = [
						res.data.result.imagePath,
						res.data.result.imageName,
					];

					this.urlImageAvatar = common.commonFunctions.concatURL({
						defaultURL: constant.api.DEFAULT_URL_IMAGE.CLIENT,
						pathURL,
					});

					this.dataClient.clientImageId = res.data.result.clientImageId;

					this.$emit("loading", false);
				} else {
					this.$emit("loading", false);

					console.log(res.data);
				}
			} catch (errors) {
				console.log("errors", errors);
			}
		},

		async handleDeleteAvatar() {
			const data = {
				shopId: session.shopSession.getShopId(),
				clientImageId: this.dataClient.clientImageId,
			};

			this.$emit("loading", true);

			try {
				const res = await apis.clientApis.deleteClientImage(data);

				if (res.status !== 200) throw res;

				if (res.data.isOK) {
					this.urlImageAvatar = "";
					this.dataClient.clientImageId = null;

					this.$emit("loading", false);
				} else {
					this.$emit("loading", false);
					console.log(res);
				}
			} catch (errors) {
				console.log(errors);
			}
		},

		async handleGetPrepaidCard(dataInfo = { pageNumber: 1, expired: false }) {
			const data = {
				pageSize: 10,
				prepaidCardType: -1,
				includeFamilyService: true,
				pageNumber: dataInfo.pageNumber,
				includeExpired: dataInfo.expired,
				clientId: this.dataClient.clientId,
				shopId: session.shopSession.getShopId(),
			};

			try {
				this.$emit("loading", true);
				const res = await apis.clientApis.getClientPrepaidCards(data);

				if (res.status !== 200) {
					this.$emit("loading", false);
					throw res;
				}

				if (res.data.isOK) {
					this.dataPrepaidCards = res.data.result;
					this.dataPrepaidCards.cards = res.data.result.items;

					this.$refs.refClientTabs &&
						this.$refs.refClientTabs.handleSetPrepaidGoods(
							this.dataPrepaidCards
						);
					this.$emit("loading", false);
				} else {
					this.$emit("loading", false);
				}
			} catch (errors) {
				console.log(errors);
				this.$emit("loading", false);
			}
		},

		async handleGetPrepaidService(
			dataInfo = { expired: false, pageNumber: 1 }
		) {
			const data = {
				pageSize: 10,
				includeFamilyService: true,
				pageNumber: dataInfo.pageNumber,
				includeExpired: dataInfo.expired,
				clientId: this.dataClient.clientId,
				shopId: session.shopSession.getShopId(),
			};

			try {
				this.$emit("loading", true);
				const res = await apis.clientApis.getClientPrepaidServices(data);

				if (res.status !== 200) {
					this.$emit("loading", false);
					throw res;
				}

				if (res.data.isOK) {
					this.dataPrepaidServices = res.data.result;
					this.dataPrepaidServices.services = res.data.result.items;

					this.$refs.refClientTabs &&
						this.$refs.refClientTabs.handleSetPrepaidGoods(
							this.dataPrepaidServices
						);

					this.$emit("loading", false);
				} else {
					this.$emit("loading", false);
				}
			} catch (errors) {
				console.log(errors);
				this.$emit("loading", false);
			}
		},

		async handleGetSalesHistory({
			pageNumber = 1,
			fromDateTS = 1,
			includeDeleted = false,
		}) {
			const data = {
				pageSize: 10,
				pageNumber: pageNumber,
				fromDateTS: fromDateTS,
				includeDeleted: includeDeleted,
				clientId: this.dataClient.clientId,
				clientShopId: this.dataClient.shopId,
				shopId: session.shopSession.getShopId(),
				toDateTS: common.momentFunctions.DateNowIntoUnix(),
			};

			try {
				this.$emit("loading", true);
				const res = await apis.clientApis.getSalesHistoryByClient(data);

				if (res.status !== 200) {
					this.$emit("loading", false);
					throw res;
				}

				if (res.data.isOK) {
					this.dataSalesHistory = res.data.result;

					this.$refs.refClientTabs &&
						this.$refs.refClientTabs.handleSetSalesHistory(
							this.dataSalesHistory
						);

					this.$emit("loading", false);
				} else {
					this.$emit("loading", false);
				}
			} catch (errors) {
				console.log(errors);
				this.$emit("loading", false);
			}
		},

		onClickDelete() {
			this.$refs.refConfirmModal.showModal({
				title: "Delete Client",
				message: `Are you sure you want to delete client ${this.dataClient.clientName} ?`,
			});
		},

		async handleDeleteClient() {
			const data = {
				clientId: this.dataClient.clientId,
				shopId: session.shopSession.getShopId(),
				country: constant.payload.DEFAULT_COUNTRY,
				sessionToken: session.shopSession.getSessionToken(),
				shopLocation: constant.payload.DEFAULT_SHOP_LOCATION,
			};

			this.$emit("loading", true);

			try {
				const res = await apis.clientApis.deleteClient(data);

				if (res.status !== 200) {
					this.$emit("loading", false);
					throw this.$refs.refNotification.showModal({
						listMessage: res.errorMessages,
					});
				}

				if (res.data.isOK) {
					this.$emit("loadClient");

					this.$emit("loading", false);

					this.hideModal();
				} else {
					this.$emit("loading", false);

					this.$refs.refNotification.showModal({
						listMessage: res.errorMessages,
					});
				}
			} catch (errors) {
				this.$refs.refNotification.showModal({ listMessage: errors });
			}
		},

		onResize() {
			this.windowWidth = window.innerWidth;
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./Client-Action.scss";
</style>
