<template>
  <div>
    <Nav />
    <Breadcrumb :lists="breadcrumbs" />
  </div>
</template>

<script>
import Nav from "../../components/site/Nav.vue";
import Breadcrumb from "../../components/site/Breadcrumb.vue";

export default {
  data() {
    return {
      breadcrumbs: [{ name: "Ticket-Type", text: "=> Ticket-Types", href: "#" }],
    };
  },
  components: { Nav, Breadcrumb },
};
</script>

<style lang="scss" scoped>
</style>