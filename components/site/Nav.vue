<template>
  <div>
    <notifications position="bottom right"/>
    <b-navbar toggleable="lg" type="light" variant="info">
      <b-navbar-brand href="#">Ticket-Management-System</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="#">
            <nuxt-link to="/ticket-bookings"><span class="tab-text-color">Ticket-Booking</span></nuxt-link>
          </b-nav-item>
          <b-nav-item href="#">
            <nuxt-link to="/ticket-types"><span class="tab-text-color">Ticket-Type</span></nuxt-link>
          </b-nav-item>
        </b-navbar-nav>

      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style lang="css" scoped>
  .tab-text-color {
    color: white;
  }
</style>