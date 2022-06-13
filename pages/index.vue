<template>
  <!-- <Tutorial/> -->
  <div></div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "IndexPage",
  data() {
    return {};
  },mounted() {
    // Redirect to Ticket-bookings
    this.$router.push("/ticket-bookings");
  },
});
</script>
