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
          <b-form @submit="onSubmit" v-if="show">
            <b-form-group
              id="input-group-1"
              label="Ticket Type:"
              label-for="input-1"
            >
              <b-form-input
                id="input-1"
                v-model="form.ticket_type"
                placeholder="Fill text like A, Concert, Movie Ticket etc."
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-group-2"
              label="Price:"
              label-for="input-2"
              description="Price per 1 ticket."
            >
              <b-form-input
                id="input-2"
                v-model="form.price"
                type="number"
                placeholder="cost field"
                min="0"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-group-3"
              label="Amount limit per day:"
              label-for="input-3"
              description="Qouta daily"
            >
              <b-form-input
                id="input-3"
                type="number"
                v-model="form.daily_quota"
                placeholder="Fill number."
                min="1"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-group-4"
              label="Minimum buying:"
              label-for="input-4"
              description="Minimun quantity."
            >
              <b-form-input
                id="input-3"
                type="number"
                v-model="form.minimum"
                placeholder="Fill number."
                min="1"
                required
              ></b-form-input>
            </b-form-group>

            <div class="button-position">
              <b-button variant="danger" class="mr-2" to="/ticket-types"
                >Back</b-button
              >
              <b-button type="submit" variant="primary"
                >Create Ticket Type</b-button
              >
            </div>
          </b-form>
        </div>
      </b-container>
      <!-- End of Scope -->
    </div>
  </client-only>
</template>

<script>
import numeral from "numeral";
import Nav from "../../components/site/Nav.vue";
import Breadcrumb from "../../components/site/Breadcrumb.vue";
import APIClient from "~/utils/APIClient";

export default {
  data() {
    return {
      breadcrumbs: [
        {
          name: "Ticket-Type",
          text: "=> Ticket-Types",
          href: "/ticket-types",
        },
        { name: "Create-Ticket-Types", text: "Create", href: "#" },
      ],
      form: {
        ticket_type: "",
        price: 0,
        daily_quota: 1,
        minimum: 1,
      },
      show: true,
    };
  },
  components: { numeral, Nav, Breadcrumb },
  methods: {
    async onSubmit(event) {
      event.preventDefault();

        const new_ticket_type = {
          ticket_type: this.form.ticket_type,
          price: this.form.price,
          daily_quota: this.form.daily_quota,
          minimum: this.form.minimum,
        };

      try {
        await APIClient.createTicketType(new_ticket_type);

        this.$notify({
          title: "Action Completed",
          type: "success",
          text: `Cretate Ticket Type has been Completed`,
          width: 700,
        });

        this.$router.back();
      } catch (error) {
        this.$notify({
          title: "Action Failed",
          type: "warn",
          text: `Can't create ${error?.message}`,
          width: 700,
        });
      }
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
