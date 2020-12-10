<template>
  <div>
    <doctor v-if="this.$store.state.user.roles.includes('doctor')"></doctor>
    <patient v-else></patient>
  </div>
</template>

<script>

import Doctor from "@/components/Doctor";
import Patient from "@/components/Patient";

export default {
  name: "UserAccount",
  components:{
    Doctor,
    Patient
  }
}
</script>

<style scoped>

</style>