<template>
	<div class="upload-image-modal">
		<b-modal
			static
			hide-footer
			:title="title"
			ref="uploadImageModal"
			header-bg-variant="info"
			:no-close-on-backdrop="true"
			:modal-class="'modal upload-image-modal__modal'"
		>
			<input
				hidden
				type="file"
				ref="inputFileImage"
				@change="onClickChangeFile"
				accept="image/*"
			/>

			<div class="input-data modal__input-data" v-if="typeUploadImage">
				<input readonly v-model="file" />
				<button @click="onClickSelectImage">Search Image</button>
			</div>

			<div class="preview-avatar modal__preview-avatar">
				<img :src="urlImage" v-if="urlImage" />
			</div>

			<group-button
				:disableConfirm="!file"
				@cancel="onClickCancel"
				@confirm="onClickSaveImage"
				@delete="onClickDeleteImage"
				:isShowButton="isShowGroupButton"
			/>
		</b-modal>

		<confirm-modal ref="confirmModal" @confirm="handleDeleteImage" />
		<notification ref="notificationModal" modalTitle="Error Image Action" />
	</div>
</template>

<script>
import apis from "../../lib/apis";
import session from "../../lib/utils/session";
import constant from "../../lib/utils/constant";
import common from "@/lib/utils/common";

// Components
import GroupButton from "../Group-Button/Group-Button.vue";
import Notification from "../Notification/Notification.vue";
import ConfirmModal from "../Confirm-Modal/Confirm-Modal.vue";

export default {
	name: "SalonThankzUploadImage",

	data() {
		return {
			file: "",
			title: "",
			urlImage: "",
			dataClient: null,
			typeUploadImage: 1,
			isShowGroupButton: {
				cancel: true,
				delete: true,
				confirm: true,
			},
		};
	},

	props: {},

	components: {
		GroupButton,
		ConfirmModal,
		Notification,
	},

	created() {},

	mounted() {},

	computed: {},

	methods: {
		showModal(dataModal) {
			this.title = dataModal.title;
			this.dataClient = dataModal.dataClient;
			this.urlImage = dataModal.urlImageAvatar;

			if (dataModal.urlImageAvatar) this.typeUploadImage = 0;
			else this.typeUploadImage = 1;

			this.isShowGroupButton.delete = !!this.urlImage;
			this.isShowGroupButton.confirm = !this.urlImage;
			this.$refs.uploadImageModal && this.$refs.uploadImageModal.show();
		},

		hideModal() {
			this.$refs.uploadImageModal && this.$refs.uploadImageModal.hide();
		},

		onClickSelectImage() {
			this.$refs.inputFileImage.click();
		},

		async onClickSaveImage() {
			const [file] = this.$refs.inputFileImage.files || [];

			if (!file) return;

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

					const urlImageAvatar = common.commonFunctions.concatURL({
						defaultURL: constant.api.DEFAULT_URL_IMAGE.CLIENT,
						pathURL,
					});

					this.$emit("updateUrlImageAvatar", {
						clientImageId: res.data.result.clientImageId,
						urlImageAvatar,
					});

					this.$emit("loading", false);

					this.hideModal();

					this.handleReset();
				} else {
					this.$emit("loading", false);

					console.log(res.data);
				}
			} catch (errors) {
				console.log("errors", errors);
			}
		},

		onClickCancel() {
			this.hideModal();
			this.handleReset();
		},

		onClickDeleteImage() {
			this.$refs.confirmModal.showModal({
				title: "Delete Avatar Client",
				message: "Are you sure you want to delete this avatar?",
			});
		},

		async handleDeleteImage() {
			const data = {
				shopId: session.shopSession.getShopId(),
				clientImageId: this.dataClient.clientImageId,
			};

			this.$emit("loading", true);

			try {
				const res = await apis.clientApis.deleteClientImage(data);

				if (res.status !== 200) throw res;

				if (res.data.isOK) {
					this.$emit("updateUrlImageAvatar", {
						clientImageId: null,
						urlImageAvatar: "",
					});

					this.$emit("loading", false);

					this.hideModal();

					this.handleReset();
				} else {
					this.$emit("loading", false);
					console.log(res);
				}
			} catch (errors) {
				console.log(errors);
			}
		},

		onClickChangeFile(event) {
			const dataFile = event.target.files[0];

			//covert MB
			const dataSize = common.commonFunctions.covertSizeFileIntoMB(
				dataFile.size
			);

			if (dataSize >= 1) {
				this.$refs.notificationModal.showModal({
					listMessage: [
						{
							errorCode: "FileSize",
							errorMessage: "Data size is not larger than 1M",
						},
					],
				});

				this.handleReset();
				return;
			}

			if (dataFile) {
				this.file = dataFile?.name;
				const url = URL.createObjectURL(dataFile);

				if (url && url !== this.urlImage) {
					URL.revokeObjectURL(this.urlImage);
					this.urlImage = url;
				}
			}
		},

		handleReset() {
			this.file = "";
			this.$refs.inputFileImage.value = "";
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./Upload-Image.scss";
</style>
