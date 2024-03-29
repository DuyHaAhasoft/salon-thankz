<template>
	<validation-observer v-slot="{ invalid }">
		<div class="login-page">
			<img
				class="image login-page__image"
				src="https://www.ahasoft.co.kr/login/images/logo_nobkg.png"
			/>

			<div class="title login-page__title">SALON ADMIN</div>
			<form class="form login-page__form" action="#" @submit.prevent="onSubmit">
				<validation-provider
					name="user"
					rules="required|min:3|max:16|alpha_dash"
					v-slot="{ errors }"
				>
					<input
						required
						autofocus
						maxlength="16"
						placeholder="Ex: ThankZ, ThankZ_Salon"
						v-model="dataUser.username"
					/>
					<div
						class="error-message form__error-message"
						:class="{ 'error-message-text': !!errors[0] }"
					>
						{{ errors[0] ? errors[0] : "Ex: ThankZ, ThankZ_Salon" }}
					</div>
				</validation-provider>

				<validation-provider
					name="password"
					rules="required|min:8|max:16"
					v-slot="{ errors }"
				>
					<input
						required
						maxlength="16"
						type="password"
						autocomplete="off"
						v-model="dataUser.password"
						placeholder="Ex: abcd@1234"
					/>
					<div
						class="error-message form__error-message"
						:class="{ 'error-message-text': !!errors[0] }"
					>
						{{ errors[0] ? errors[0] : "Ex: abcd@1234" }}
					</div>
				</validation-provider>

				<button
					type="submit"
					class="login-page__btn"
					:class="{ 'login-page__btn--disabled': disabledBtn || invalid }"
					:disabled="disabledBtn || invalid"
				>
					Login
				</button>
			</form>

			<notification-modal ref="notificationRef" modalTitle="Login Failed" />
		</div>

		<loading v-if="isLoading" />
	</validation-observer>
</template>

<script>
// Utils
import { ValidationProvider, ValidationObserver } from "vee-validate";

import apis from "../../lib/apis";
import common from "../../lib/utils/common";
import session from "../../lib/utils/session";
import constant from "../../lib/utils/constant";

// Components
import NotificationModal from "../../components/Notification/Notification.vue";
import Loading from "../../components/Loading/Loading.vue";

export default {
	name: "LoginPage",

	data() {
		return {
			dataUser: {
				username: "",
				password: "",
			},

			isLoading: false,
		};
	},

	mounted() {
		session.shopSession.removeShopInfo();
	},

	components: {
		ValidationProvider,
		ValidationObserver,

		Loading,
		NotificationModal,
	},

	computed: {
		disabledBtn() {
			return this.dataUser.username === "" || this.dataUser.password === "";
		},
	},

	methods: {
		async onSubmit() {
			const data = {
				userID: this.dataUser.username.trim(),
				password: this.dataUser.password.trim(),
				solutionId: constant.api.SOLUTION_ID.SALON_ADMIN,
			};

			if (data.userID.trim() === "" || data.password.trim() === "") {
				this.$refs.notificationRef.showModal({
					listMessage: [
						{
							errorCode: "Login",
							errorMessage: "Username and password cannot be empty",
						},
					],
				});
			} else {
				// e.preventDefault();
				try {
					this.isLoading = true;
					const res = await apis.userApis.login(data);

					if (res.status !== 200) {
						location.reload();
						throw res.statusText;
					}

					if (res.data.isOK) {
						res.data.result.userAuthInfo.session_token =
							common.randomFunctions.guid();

						await session.shopSession.setShopInfo(res.data.result);
						await this.loadClientSetUp(res.data.result.shopBasicInfo.shopId);

						this.$router.push("/client");

						this.isLoading = false;
					} else {
						this.isLoading = false;

						this.$refs.notificationRef.showModal({
							listMessage: res.data.errorMessages,
						});
					}

					if (res.isOK === false) {
						this.isLoading = false;
						location.reload();
					}
				} catch (errors) {
					console.log(errors);
				}
			}
		},

		async loadClientSetUp(shopId) {
			const data = {
				shopId: shopId,
			};

			try {
				const resShopInfo = await apis.shopApis.getShopInfo(data);

				if (resShopInfo.status !== 200) {
					location.reload();
					throw resShopInfo.message;
				}

				if (resShopInfo.data.isOK)
					session.clientSession.setClientSetup(resShopInfo.data.result);
				else alert("Error Set up client");
			} catch (errors) {
				console.log(errors);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./Login.scss";
</style>
