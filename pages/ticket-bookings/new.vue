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
              <b-form-select
                id="input-1"
                v-model="form.ticket_type"
                :options="ticket_types"
                required
                @change="onSelectTicketType()"
              ></b-form-select>
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
                readonly
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-group-3"
              label="Quantity:"
              label-for="input-3"
              :description="`Minimum buying was ${this.quantity_min}`"
            >
              <b-form-input
                id="input-3"
                type="number"
                v-model="form.quantity"
                placeholder="minimun field"
                :max="quantity_max"
                :min="quantity_min"
                @change="onChangeQuantity()"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-group-4"
              label="Email:"
              label-for="input-4"
              description="We will send you booking status via email contract."
            >
              <b-form-input
                id="input-3"
                type="email"
                v-model="form.email"
                placeholder="xxx@gmail.com"
                required
              ></b-form-input>
            </b-form-group>

            <label>Summary Paid: {{ total_price }}</label>

            <div class="button-position">
              <b-button variant="danger" class="mr-2" to="/ticket-bookings"
                >Back</b-button
              >
              <b-button type="submit" variant="primary" :disabled="out_of_stock"
                >{{ out_of_stock ? "Out of Stock" : "Booking" }}</b-button
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
        quantity: 1,
        price: 0,
      },
      show: true,
      selected: null,
      ticket_types: [{ value: null, text: "Please select an option" }],
      ticket_type_items: [],
      quantity_min: 1,
      quantity_max: 5,
      total_price: 0,
      out_of_stock: false,
    };
  },
  components: { numeral, Nav, Breadcrumb },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const results = await APIClient.getTicketType();

        this.ticket_type_items = results;

        results.filter((item) => {
          this.ticket_types.push({ value: item.id, text: item.ticket_type });
        });
      } catch (error) {
        this.$notify({
          title: "Fetch Data Failed",
          type: "warn",
          text: `Can't Fetch data ${error?.message}`,
          width: 700,
        });
      }
    },
    async onSubmit(event) {
      event.preventDefault();

        const new_ticket_booking = {
          ticket_type_id: this.form.ticket_type,
          user_email: this.form.email,
          quantity: this.form.quantity,
        };

      try {
        await APIClient.createTicketBooking(new_ticket_booking);

        this.$notify({
          title: "Action Completed",
          type: "success",
          text: `Booking has been Completed`,
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
    async onSelectTicketType() {
      const current_price = this.ticket_type_items.find(
        (item) => item.id == this.form.ticket_type
      );
      if (current_price) {
        this.form.price = current_price.price;
        this.quantity_min = current_price.minimum;
        this.form.quantity = current_price.minimum;
        this.total_price = numeral(this.form.price * this.form.quantity).format(
          "0,0"
        );

        // For check maximun per day
        const results = await APIClient.getMaximunTicketType(
          this.form.ticket_type
        );

        this.quantity_max = current_price.daily_quota - results;

        if (this.quantity_max <= 0) {
          this.out_of_stock = true;
        } else {
          this.out_of_stock = false;
        }

      } else {
        this.form.price = 0;
        this.quantity_min = 1;
        this.total_price = 0;
        this.form.quantity = 0;
      }
    },
    onChangeQuantity() {
      this.total_price = numeral(this.form.price * this.form.quantity).format(
        "0,0"
      );
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
