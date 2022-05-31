<template>
  <div class="login-page">
    <img class="image login-page__image" src="https://www.ahasoft.co.kr/login/images/logo_nobkg.png" />
    <div class="title login-page__title">LOGIN</div>
    <form class="form login-page__form" action="#" @submit.prevent="onSubmit">
      <input v-model="username" placeholder="Enter ID" required/>
      <input v-model="password" placeholder="Enter password" required/>
      <button type="submit" @click="onSubmit">Login</button>
    </form>
  </div>
</template>

<script>
import axios from "axios"

export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  async mounted() {
    sessionStorage.removeItem("shopInfo");
    // const data = {
    //   userID: 'thankz_salon',
    //   password: 'abcd@1234',
    //   solutionId: 3002
    // }
    // const res = await axios.post('https://ahasoft-salon-admin-http-aggregator-dev.azurewebsites.net/api/aggr/v1/auth/login/subscriber?culture=en-US&ui-culture=en-US', data)
    // console.log(data, res, res.data.isOK)
  },
  methods: {
    async onSubmit() {
      const data = {
        userID: this.username,
        password: this.password,
        solutionId: 3002
      }
      try {
        // this.preLoader()
        const res = await axios.post('https://ahasoft-salon-admin-http-aggregator-dev.azurewebsites.net/api/aggr/v1/auth/login/subscriber?culture=en-US&ui-culture=en-US', data)
        // this.preLoader(false)
        if(res.status !== 200) {
          throw res.statusText
        }
        
        if(res.data.isOK) {
          console.log('OK')
          sessionStorage.setItem("shopInfo", JSON.stringify(res.data.result));
          this.$router.push('/client')
        } else {
          alert('SOS')
        }

      }
      catch(errors) {
        console.log(errors)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "./Login.scss";
</style>
