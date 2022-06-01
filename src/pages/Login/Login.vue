<template>
  <div class="login-page">
    <img class="image login-page__image" src="https://www.ahasoft.co.kr/login/images/logo_nobkg.png" />
    <div class="title login-page__title">LOGIN</div>
    <form class="form login-page__form" action="#" @submit.prevent="onSubmit">
      <input v-model="dataUser.username" placeholder="Enter ID" required/>
      <input v-model="dataUser.password" type="password" placeholder="Enter password" required/>
      <button type="submit" class="login-page__btn login-page__btn--disabled" :disabled="disabledBtn">Login</button>
    </form>
    <nofication-modal ref="noficationRef" modalTitle="Login Failed" />
  </div>
</template>

<script>
// Utils
import apis from '../../lib/apis'
import session from '../../lib/utils/session'
import constant from '../../lib/utils/constant'

// Components
import NoficationModal from '../../components/Nofication/Nofication.vue'

export default {
  name: 'LoginPage',

  data() {
    return {
      dataUser: {
        username: '',
        password: '',
      },
      disabledBtn: true
    }
  },

  mounted() {
    session.shopSession.removeShopInfo()
  },
  
  components: {
    NoficationModal
  },

  methods: {
    async onSubmit() {
      const data = {
        userID: this.username,
        password: this.password,
        solutionId: constant.api.SOLUTION_ID.SALON_ADMIN
      }

      try {
        const res = await apis.userApi.login('DEV', data)
        if(res.status !== 200) {
          throw res.statusText
        }
        
        if(res.data.isOK) {
          await session.shopSession.setShopInfo(res.data.result)
          this.$router.push('/client')
        } else {
          console.log(res.data)
          this.$refs.noficationRef.showModal({listMessage: res.data.errorMessages})
        }
      }
      catch(errors) {
        console.log(errors)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "./Login.scss";
</style>
