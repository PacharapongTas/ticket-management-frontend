<template>
  <div>
    <b-breadcrumb :items="lists"></b-breadcrumb>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ["lists"],
};
</script>

<style lang="scss" scoped>
</style>