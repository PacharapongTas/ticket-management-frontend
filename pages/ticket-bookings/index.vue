<template>
  <client-only>
    <div>
      <!-- Header Scope -->
      <Nav />
      <Breadcrumb :lists="breadcrumbs" />
      <!-- End of Scope -->

      <!-- Table Scope  -->
      <b-container>
        <div class="create-button">
          <span><h1>Ticket Status</h1></span>
          <b-button variant="outline-primary" to="ticket-bookings/new">
            Create Ticket
          </b-button>
        </div>

        <!-- Filter  -->
        <b-col lg="12" class="my-4">
          <b-form @submit="onSubmit" @reset="onReset" v-if="show">
            <div class="filter-ticket-table">
              <b-row>
                <b-col lg="6" sm="12" class="my-2">
                  <b-form-group>
                    <label for="date-datepicker">Filter Bar</label>
                    <b-form-input
                      id="filter-input"
                      v-model="form.filter_ticket_type"
                      type="search"
                      placeholder="Type to Search Ticket-Type"
                    ></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col lg="6" sm="12" class="my-2">
                  <label for="date-datepicker">Choose a date</label>
                  <b-form-datepicker
                    id="date-datepicker"
                    v-model="form.filter_created_at"
                    class="mb-2"
                  ></b-form-datepicker>
                </b-col>
              </b-row>
            </div>
            <div class="button-position">
              <b-button type="reset" variant="warning" class="mr-2"
                >Clear</b-button
              >
              <b-button type="submit" variant="primary"
                ><BIconSearch /> Search
              </b-button>
            </div>
          </b-form>
        </b-col>
        <!-- End of Filter -->

        <b-table
          striped
          hover
          :items="ticketBookings"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          @filtered="onFiltered"
        >
          <template #cell(actions)="row">
            <b-button
              size="sm"
              @click="info(row.item, row.index, $event.target)"
              class="mr-1"
            >
              <BIconTrashFill /> Delete
            </b-button>
          </template>
        </b-table>

        <div class="table-pagination">
          <b-col sm="7" md="4" class="my-1">
            <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              align="fill"
              size="sm"
              class="my-0"
            ></b-pagination>
          </b-col>
        </div>
      </b-container>
      <!-- End of Scope -->
    </div>
  </client-only>
</template>

<script>
import Nav from "../../components/site/Nav.vue";
import Breadcrumb from "../../components/site/Breadcrumb.vue";
import { BIconTrashFill, BIconSearch } from "bootstrap-vue";
import APIClient from "../../utils/APIClient"

export default {
  data() {
    return {
      breadcrumbs: [
        {
          name: "Ticket-Booking",
          text: "=> Ticket-Bookings",
          href: "#",
        },
      ],
      // Items
      ticketBookings: [
        { ticket_type: "Dickerson", price: 40, created_at: "12:12" },
        { ticket_type: "Larsen", price: 21, created_at: "13:12" },
        { ticket_type: "Geneva", price: 89, created_at: "12:23" },
        { ticket_type: "Jami", price: 38, created_at: "11:22" },
      ],
      // Header Field
      fields: [
        {
          key: "ticket_type",
          label: "Ticket Type",
          sortable: true,
          sortDirection: "desc",
        },
        { key: "price", label: "Price", sortable: true, sortDirection: "desc" },
        {
          key: "created_at",
          label: "Booked At",
          sortable: true,
          sortDirection: "desc",
        },
        { key: "actions", label: "Actions" },
      ],
      // Form Search
      show: true,
      form: {
        filter_ticket_type: null,
        filter_created_at: "",
      },
      // Pagination
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
    };
  },
  components: { Nav, Breadcrumb, BIconTrashFill, BIconSearch },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.ticketBookings.length;

    // Fetch Ticket-Booking
    this.fetchTicketBooking();
  },
  methods: {
    async fetchTicketBooking(){
      try {
        const results = await APIClient.getTicketBooking()
        console.log('results :>> ', results);
      } catch (error){
        console.log('error :>> ', error);
      }
    },
    onSubmit(event) {
      event.preventDefault();
      alert(JSON.stringify(this.form));
    },
    onReset(event) {
      event.preventDefault();
      // Reset our form values
      this.form.filter_ticket_type = null;
      this.form.filter_created_at = "";
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
};
</script>

<style lang="css" scoped>
.create-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-block-end: 2ch;
}

.button-position {
  display: flex;
  justify-content: flex-end;
}

.table-pagination {
  display: flex;
  justify-content: center;
}
</style>