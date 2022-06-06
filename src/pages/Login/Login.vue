<template>
	<div class="login-page">
		<img
			class="image login-page__image"
			src="https://www.ahasoft.co.kr/login/images/logo_nobkg.png"
		/>
		<div class="title login-page__title">SALON ADMIN</div>
		<form class="form login-page__form" action="#" @submit.prevent="onSubmit">
			<input
				v-model="dataUser.username"
				placeholder="Enter ID"
				required
				autofocus
			/>
			<input
				v-model="dataUser.password"
				type="password"
				placeholder="Enter password"
				required
				autocomplete="none"
			/>
			<button
				type="submit"
				class="login-page__btn"
				:class="{ 'login-page__btn--disabled': disabledBtn }"
				:disabled="disabledBtn"
			>
				Login
			</button>
		</form>
		<notification-modal ref="notificationRef" modalTitle="Login Failed" />
	</div>
</template>

<script>
// Utils
import apis from "../../lib/apis";
import common from '../../lib/utils/common'
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
						res.data.result.userAuthInfo.session_token = common.random.guid()
						await session.shopSession.setShopInfo(res.data.result);
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
	},
};
</script>

<style lang="scss" scoped>
@import "./Login.scss";
</style>
