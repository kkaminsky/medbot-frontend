<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        Choose patient
      </v-col>

      <!--<v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to Medical Assistant
        </h1>

        <p class="subheading font-weight-regular">
          For help and collaboration with other Vuetify developers,
          <br>please join our online
          <router-link to="/user/account">
            User Account
          </router-link>
        </p>
      </v-col>-->
      <v-col cols="4" offset-md="4">
        <v-combobox outlined
                    v-model="selectedPatient"
                    item-text="username"
                    :items="patients"
                    @change="getPatientTreatments"
                    return-object>

        </v-combobox>
      </v-col>

    </v-row>
    <v-row v-if="selectedPatient!==null" class="text-left" >
      <v-col>
        <h1 class="font-weight-bold mb-3">
          Info
        </h1>
        <p class="subheading font-weight-regular">
          Username: {{selectedPatient.username}}<br/>
          Telegram: <a :href="'t.me/' + selectedPatient.platformId">User Telegram</a> <br/>
          Breakfast time: {{selectedPatient.breakfastTime}} <br/>
          Launch time: {{selectedPatient.lanchTime}}<br/>
          Dinner time: {{selectedPatient.dinnerTime}}<br/>
          Go to bed time: {{selectedPatient.goToBedTime}} <br/>
          Get up time: {{selectedPatient.getUpTime}}<br/>
        </p>
      </v-col>
    </v-row>
    <v-row class="text-left">
      <v-col cols="2">
        <h1 class="font-weight-bold mb-3">
          Treatments
        </h1>
      </v-col>
      <v-col cols="1">
        <v-btn outlined class="mt-2" @click="createTreatment">
          NEW
        </v-btn>
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
          <v-card-actions>
            <v-btn outlined @click="selectTreatment(obj)">
              add drugs
            </v-btn>
            <v-btn outlined @click="getReports(obj.id)">
              reports
            </v-btn>


          </v-card-actions>

        </v-card>
      </v-col>
      <v-dialog
          v-model="dialogForDrugs"
          width="700"
      >
        <v-card>
          <v-card-title>
            add drugs
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="2" class="mt-6 text-left">
                Choose drug:
              </v-col>
              <v-col cols="10">
                <v-combobox :items="drugs"
                            item-text="name"
                            return-object
                            v-model="selectedDrug">

                </v-combobox>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2" class="mt-6 text-left">
                Period:
              </v-col>
              <v-col cols="10">
                <v-combobox :items="periods" v-model="selectedPeriod">

                </v-combobox>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2" class="mt-6 text-left">
                When:
              </v-col>
              <v-col cols="10">
                <v-combobox :items="times" v-model="selectedTime">

                </v-combobox>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2" class="mt-6 text-left">
                How many:
              </v-col>
              <v-col cols="10">
                <v-text-field v-model="countInPeriod">

                </v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn outlined @click="saveReceipt">
              save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogForShowReports" width="700">
        <v-card>
          <v-card-title>
            Drug reports
          </v-card-title>
          <v-card-text>
            <div v-for="report in drugReports" class="text-left">
              Report date: {{new Date(report.reportDate*1000).toLocaleDateString()}} {{new Date(report.reportDate*1000).toLocaleTimeString()}} <br/>
              Consumed: {{report.isMissed}} <br/>
            </div>
          </v-card-text>
          <v-card-title>
            Health reports
          </v-card-title>
          <v-card-text>
            <div v-for="report in healthReports" class="text-left">
              Report date: {{new Date(report.reportDate*1000).toLocaleDateString()}} {{new Date(report.reportDate*1000).toLocaleTimeString()}} <br/>
              Text: {{report.text}} <br/>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Doctor",
  data: () => ({
    patients: [],
    selectedPatient: null,
    treatments: [],
    selectedTreatment: null,
    drugs: [],
    selectedDrug: null,
    dialogForDrugs: false,
    dialogForShowReports: false,
    countInPeriod: 0,
    periods: ['DAY',
      'WEEK',
      'MONTH',
      'HOUR'],
    times: [
      'BEFORE_EATING',
      'AFTER_EATING',
      'DURING_EATING',
      'AFTER_SLEEPING',
      'BEFORE_SLEEPING',
    ],
    selectedPeriod: null,
    selectedTime: null,
    drugReports: [],
    healthReports: []
  }),
  methods: {
    getPatients(){
      this.$http.get("/core/doctor/get/patients").then(res=>{

        this.patients = res.data
      })
    },
    getPatientTreatments(){
      this.$http.post("/core/doctor/get/treatments",{
        patientId: this.selectedPatient.id
      }).then(res=>{
        this.treatments = res.data
      })
    },
    selectTreatment(treatment){
      console.log(treatment)
      this.selectedTreatment = treatment
      this.dialogForDrugs = true
      this.getAllDrugs()
    },
    createTreatment(){
      this.$http.post("/core/doctor/create/treatment",{
        patientId: this.selectedPatient.id
      }).then(res=>{
        this.getPatientTreatments()
      })
    },
    getAllDrugs(){
      this.$http.get("/core/doctor/get/drugs").then(res=>{
        this.drugs = res.data
      })
    },
    getReports(treatmentId){
      this.$http.post("/core/doctor/get/reports",{
        treatmentId: treatmentId
      }).then(res=>{
        this.drugReports = res.data
        this.$http.post("/core/doctor/get/reports/text",{
          treatmentId: treatmentId
        }).then(res=>{
          this.healthReports = res.data
          this.dialogForShowReports = true
        })
      })
    },
    saveReceipt(){
      this.$http.post("/core/doctor/create/receipt",{
        treatmentId: this.selectedTreatment.id,
        drugId: this.selectedDrug.id,
        countInPeriod: this.countInPeriod,
        periodEnum: this.selectedPeriod,
        whenEnum: this.selectedTime
      }).then(res=>{
        this.$http.post("/core/doctor/create/notifications", {
          treatmentId: this.selectedTreatment.id
        })
      })
    }
  },
  created() {
    this.getPatients()
  }
}
</script>

<style scoped>

</style>