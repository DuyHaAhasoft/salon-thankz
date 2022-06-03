<template>
	<div class="login-page">
		<img
			class="image login-page__image"
			src="https://www.ahasoft.co.kr/login/images/logo_nobkg.png"
		/>
		<div class="title login-page__title">SALON ADMIN</div>
		<form class="form login-page__form" action="#" @submit.once="onSubmit">
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
		<nofication-modal ref="noficationRef" modalTitle="Login Failed" />
	</div>
</template>

<script>
// Utils
import apis from "../../lib/apis";
import session from "../../lib/utils/session";
import constant from "../../lib/utils/constant";

// Components
import NoficationModal from "../../components/Nofication/Nofication.vue";

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
		NoficationModal,
	},

	computed: {
		disabledBtn() {
			return this.dataUser.username === "" || this.dataUser.password === "";
		},
	},

	methods: {
		async onSubmit(event) {
			const data = {
				userID: this.dataUser.username,
				password: this.dataUser.password,
				solutionId: constant.api.SOLUTION_ID.SALON_ADMIN,
			};

			if (data.userID.trim() === "" || data.password.trim() === "") {
				this.$refs.noficationRef.showModal({
					listMessage: "Username and password cannot be empty",
				});
			} else {
				try {
					const res = await apis.userApi.login("DEV", data);
					if (res.status !== 200) {
						throw res.statusText;
					}
					if (res.data.isOK) {
						await session.shopSession.setShopInfo(res.data.result);
						this.$router.push("/client");
					} else {
						console.log(res.data);
						this.$refs.noficationRef.showModal({
							listMessage: res.data.errorMessages,
						});
					}
				} catch (errors) {
					console.log(errors);
				}
			}

			event.preventDefault();
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./Login.scss";
</style>
