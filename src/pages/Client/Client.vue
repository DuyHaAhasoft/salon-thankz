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
import apis from '../../lib/apis'
import session from '../../lib/utils/session'

export default {
  name: 'ClientPage',
  data() {
    return {
      users: [],
      name: 'ThankZ',
    }
  },
  props: {},
  async mounted() {
    const data = {
      pageSize: 10,
      pageNumber: 1,
      shopId: session.shopSession.getShopId(),
    }
    const res = await apis.clientApi.getAllClientByShop('DEV', data)
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

<style lang="scss" scoped>
  @import "./Client.scss"
</style>
