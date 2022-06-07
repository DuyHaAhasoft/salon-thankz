<template>
	<validation-observer v-slot="{invalid}">
		<div class="login-page">
			<img
				class="image login-page__image"
				src="https://www.ahasoft.co.kr/login/images/logo_nobkg.png"
			/>
			<div class="title login-page__title">SALON ADMIN</div>
				<form class="form login-page__form" action="#" @submit.prevent="onSubmit">
					<validation-provider name="user" rules="required|min:3|alpha_dash">
						<input
							v-model="dataUser.username"
							placeholder="Enter ID"
							required
							autofocus
						/>
					</validation-provider>
					<validation-provider name="password" rules="required|min:8">
						<input
							v-model="dataUser.password"
							type="password"
							placeholder="Enter password"
							required
							autocomplete="off"
						/>
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

export default {
	name: "LoginPage",

	data() {
		return {
			dataUser: {
				username: "",
				password: "",
			},
		};
	},

	mounted() {
		session.shopSession.removeShopInfo();
	},

	components: {
		ValidationProvider,
		ValidationObserver,
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
				userID: this.dataUser.username,
				password: this.dataUser.password,
				solutionId: constant.api.SOLUTION_ID.SALON_ADMIN,
			};

			if (data.userID.trim() === "" || data.password.trim() === "") {
				this.$refs.notificationRef.showModal({
					listMessage: "Username and password cannot be empty",
				});
			} else {
				// e.preventDefault();
				try {
					const res = await apis.userApi.login("DEV", data);
					if (res.status !== 200) {
						throw res.statusText;
					}
					if (res.data.isOK) {
						res.data.result.userAuthInfo.session_token = common.random.guid();
						await session.shopSession.setShopInfo(res.data.result);
						await this.loadClientSetUp(res.data.result.shopBasicInfo.shopId);
						this.$router.push("/client");
					} else {
						this.$refs.notificationRef.showModal({
							listMessage: res.data.errorMessages,
						});
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
				const resShopInfo = await apis.shopApi.getShopInfo("DEV", data);

				if (resShopInfo.status !== 200) throw resShopInfo.message;

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
