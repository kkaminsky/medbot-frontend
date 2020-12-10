<template>
  <div v-if ="code">
    <div v-if ="result">
      <a v-bind:href="this.$config.BOT_URI">
        {{"Проверьте личные собщения"}}
      </a>
    </div>
    <div v-else>
      <p> {{"Ссылка не действительна"}}</p>
    </div>
  </div>
  <div v-else>
    <div>{{$router.push({ name: 'Home' })}}</div>
  </div>
</template>


<script>
export default {
  name: "AddPlatformAccount",
  data: function () {
    return {
      code: null,
      result: null
    }
  },
  created: function () {
    this.code = this.$route.query.code
    console.info(this.code)

    if (this.code !== null) {
      this.axios
          .post(this.$config.BIND_PLATFORM_URI, {
                code: this.code
              }
          )
          .then(response => {
            console.info(response)
            this.result = response.data
          })
          .catch(error => {
            console.log(error);
            this.result = false
          })
          .finally(() => (this.loading = false));
    } else {
      this.result = false
    }
  },
}
</script>