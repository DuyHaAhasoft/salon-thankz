<template>
	<div class="upload-image-modal">
        <b-modal
            ref="uploadImageModal"
            :title="title"
            :no-close-on-backdrop="true"
            :modal-class="'modal upload-image-modal__modal'"
            static
            hide-footer
        >
            <input ref="inputClick" type="file" @change="handleChange" accept="image/png image/jpg image/jpg" />
            <button @click="loadImage">Search Image</button>
            <button @click="onClickSaveImage">Save</button>
            <button @click="onClickCancel">Cancel</button>
        </b-modal>
	</div>
</template>

<script>

import apis from "../../lib/apis"
import session from "../../lib/utils/session"
import constant from "../../lib/utils/constant"

export default {
	name: "SalonThankzUploadImage",

	data() {
		return {
            title: "",
            url: "",

            dataClient: null,
        };
	},

	props: {},

	components: {},

	created() {},

	mounted() {},

	computed: {},

	methods: {
        showModal(dataModal) {
            this.title = dataModal.title;
            this.dataClient = dataModal.dataClient;
            this.$refs.uploadImageModal && this.$refs.uploadImageModal.show();
        },

        loadImage() {
            console.log('Image')
            this.$refs.inputClick.click()
        },

        async onClickSaveImage() {
            const [file] = this.$refs.inputClick.files || []
            console.log(this.$refs.inputClick.files)

            if (!file) return

            const formData = new FormData()

            formData.append('fomrFile', file)
            formData.append('clientId', this.dataClient)
            formData.append('shopId', session.shopSession.getShopId())
            formData.append('countryCode', constant.payload.DEFAULT_COUNTRY)
            try {
                const res = await apis.clientApi.uploadClientImage('DEV', formData)
                console.log('res', res)
            }
            catch (errors) {
                console.log('errors', errors)
            }
        },

        onClickCancel() {
            console.log('Cancel')
        },

        handleChange(event) {
            

            this.url = URL.createObjectURL(event.target.files[0])
        }
    },
};
</script>

<style lang="scss" scoped>
@import "./Upload-Image.scss";
</style>
