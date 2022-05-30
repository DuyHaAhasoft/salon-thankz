<template>
  <div>
    <form>
      <input v-model="username" />
      <input v-model="password" />
      <button @click="Submit">Submit</button>
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
  props: {
    msg: String
  },
  async mounted() {
    const data = {
      userID: 'thankz_salon',
      password: 'abcd@1234',
      solutionId: 3002
    }
    const res = await axios.post('https://ahasoft-salon-admin-http-aggregator-dev.azurewebsites.net/api/aggr/v1/auth/login/subscriber?culture=en-US&ui-culture=en-US', data)
    console.log(data, res, res.data.isOK)
  },
  methods: {
    async Submit() {
      const data = {
        userID: this.username,
        password: this.password,
        solutionId: 3002
      }
      try {
        const res = await axios.post('https://ahasoft-salon-admin-http-aggregator-dev.azurewebsites.net/api/aggr/v1/auth/login/subscriber?culture=en-US&ui-culture=en-US', data)
        console.log('SOS', res)
        // event.preventDefault()
        if(res.status !== 200) {
          throw res.statusText
        }
        
        if(res.data.isOK) {
          console.log('OK')
          sessionStorage.setItem("shopInfo", res.data.result.shopBasicInfo);
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
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
