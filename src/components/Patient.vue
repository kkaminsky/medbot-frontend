<template>
  <v-container>
    <v-row class="text-left">
      <v-col>
        <h1 class="font-weight-bold mb-3">
          Info
        </h1>
        <p class="subheading font-weight-regular">
          Username: {{currentPatient.username}}<br/>
          Telegram: <a :href="'t.me/' + currentPatient.platformId">User Telegram</a><br/>
          Breakfast time: {{currentPatient.breakfastTime}}<br/>
          Launch time: {{currentPatient.lanchTime}}<br/>
          Dinner time: {{currentPatient.dinnerTime}}<br/>
          Go to bed time: {{currentPatient.goToBedTime}} <br/>
          Get up time: {{currentPatient.getUpTime}}<br/>
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="1">
        <v-btn outlined>
          Change
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="text-left">
      <v-col cols="2">
        <h1 class="font-weight-bold mb-3">
          My treatments
        </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3" v-for="(obj,i) in treatments">
        <v-card>
          <v-card-title>
            Treatment {{ i+1 }}
          </v-card-title>
          <v-card-text class="text-left">
            date begin: {{new Date(obj.dateBegin*1000).toDateString()}}<br/>
            date end: {{new Date(obj.dateFinish*1000).toDateString()}}<br/>
            <br/>
            <h2>drugs:</h2> <br/>
            <div v-for="receipt in obj.receipts">
              Name of drug: {{receipt.drugName}} <br/>
              Every {{receipt.periodEnum}}, {{receipt.whenEnum}}. <br/>
              Count: {{receipt.countInPeriod}} <br/>
              <br/>
            </div>

          </v-card-text>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Patient",
  data: () => ({
    currentPatient: null,
    treatments: [],
    dialogForChangeTimes: false
  }),
  methods: {
    getPatientTreatments(){
      this.$http.post("/core/doctor/get/treatments",{
        patientId: this.currentPatient.id
      }).then(res=>{
        this.treatments = res.data
      })
    },
    parseISOString(s) {
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', };
      var b = s.split(/\D+/);
      return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6])).toLocaleDateString('ru-RU', options) + " " + new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6])).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) ;
    }
  },

  created() {
    this.$http.get("/core/patient/get/me").then(res=>{
      this.currentPatient = res.data
      this.getPatientTreatments()
    })
  }
}
</script>

<style scoped>

</style>