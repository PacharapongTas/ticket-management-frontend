<template>
  <client-only>
    <div>
      <!-- Header Scope -->
      <Nav />
      <Breadcrumb :lists="breadcrumbs" />
      <!-- End of Scope -->

      <!-- Table Scope  -->
      <b-container>
        <div>
          <b-form @submit="onSubmit" @reset="onReset" v-if="show">
            <b-form-group
              id="input-group-1"
              label="Ticket-Type:"
              label-for="input-1"
            >
              <b-form-select
                id="input-1"
                v-model="form.ticket_type"
                :options="ticket_types"
                required
              ></b-form-select>
            </b-form-group>

            <b-form-group
              id="input-group-2"
              label="Price:"
              label-for="input-2"
              description="We'll never share your email with anyone else."
            >
              <b-form-input
                id="input-2"
                v-model="form.email"
                type="number"
                placeholder="cost field"
                readonly
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-group-3"
              label="Quantity:"
              label-for="input-3"
              description="Minimum buying was 100000."
            >
              <b-form-input
                id="input-3"
                type="number"
                v-model="form.name"
                placeholder="minimun field"
                readonly
                required
              ></b-form-input>
            </b-form-group>

            <div class="button-position">
              <b-button type="reset" variant="danger" class="mr-2"
                >Reset</b-button
              >
              <b-button type="submit" variant="primary">Booking</b-button>
            </div>
          </b-form>
        </div>
      </b-container>
      <!-- End of Scope -->
    </div>
  </client-only>
</template>

<script>
import Nav from "../../components/site/Nav.vue";
import Breadcrumb from "../../components/site/Breadcrumb.vue";

export default {
  data() {
    return {
      breadcrumbs: [
        {
          name: "Ticket-Booking",
          text: "=> Ticket-Bookings",
          href: "/ticket-bookings",
        },
        { name: "Create-Ticket-Booking", text: "Create", href: "#" },
      ],
      form: {
        email: "",
        name: "",
        ticket_type: null,
      },
      show: true,
      selected: null,
      ticket_types: [
        { value: null, text: "Please select an option" },
        { value: "a", text: "This is First option" },
        { value: "b", text: "Selected Option" },
        { value: { C: "3PO" }, text: "This is an option with object value" },
        { value: "d", text: "This one is disabled", disabled: true },
      ],
    };
  },
  components: { Nav, Breadcrumb },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      alert(JSON.stringify(this.form));
    },
    onReset(event) {
      event.preventDefault();
      // Reset our form values
      this.form.email = "";
      this.form.name = "";
      this.form.ticket_type = null;
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
  },
};
</script>

<style lang="css" scoped>
.button-position {
  display: flex;
  justify-content: flex-end;
}
</style>
