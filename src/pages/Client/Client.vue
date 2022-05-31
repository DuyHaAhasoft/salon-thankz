<template>
  <div>
    <h1>{{name}}</h1>
    <ul>
      <li v-for="user in users" :key="user.clientId">
        {{user.clientName}}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'ClientPage',
  data() {
    return {
      name: 'ThankZ',
      users: [],
    }
  },
  props: {},
  async mounted() {
    const shopInfo = JSON.parse(sessionStorage.getItem("shopInfo"))
    const data = {
      shopId: 600908,
      pageSize: 10,
      pageNumber: 1
    }
    console.log(shopInfo.userAuthInfo.authToken)
    const headers = {
      'Authorization': `Bearer ${shopInfo.userAuthInfo.authToken}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type',
      'Accept': 'application/json'
    }
    const res = await axios.post('https://ahasoft-salon-admin-http-aggregator-dev.azurewebsites.net/api/read/v1/clients/Client/Active', data, {headers: headers})
    this.users = res.data.result.items
    console.log(res.data.result.items)
  },
  computed: {
    shopInfo() {
      const shopInfo = sessionStorage.getItem("shopInfo")
      return JSON.parse(shopInfo)
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>
