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
          :per-page="0"
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
              @change="handlePageChange"
              align="fill"
              size="sm"
              class="my-0"
            ></b-pagination>
          </b-col>
        </div>
        <!-- Info modal -->
        <b-modal
          :id="infoModal.id"
          :title="infoModal.title"
          @ok="onDelete(infoModal.row)"
          @hide="resetInfoModal"
        >
          <pre>
Are you sure to delete, Ticket Type id = {{ infoModal.row.id }}</pre
          >
        </b-modal>
      </b-container>
      <!-- End of Scope -->
    </div>
  </client-only>
</template>

<script>
import dayjs from "dayjs";
import Nav from "../../components/site/Nav.vue";
import Breadcrumb from "../../components/site/Breadcrumb.vue";
import { BIconTrashFill, BIconSearch } from "bootstrap-vue";
import APIClient from "../../utils/APIClient";
import { DEFAULT_TIME_ZONE, DEFAULT_FORMAT_DATE } from "../../utils/Constants";

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
      ticketBookings: [],
      // Header Field
      fields: [
        {
          key: "ticket_type_id",
          label: "Ticket Type",
          sortable: true,
          sortDirection: "desc",
        },
        // { key: "price", label: "Price", sortable: true, sortDirection: "desc" },
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
      perPage: 10,
      // Modal Delete
      infoModal: {
        id: "info-modal",
        title: "",
        content: "",
        row: {},
      },
    };
  },
  components: { Nav, Breadcrumb, BIconTrashFill, BIconSearch },
  mounted() {
    // Set the initial number of items
    // Fetch Ticket-Booking
    this.fetchTicketBooking();
  },
  methods: {
    async fetchTicketBooking() {
      try {
        const query = {
          page: this.currentPage,
          limit: this.perPage,
          ticket_type_id: this.form.filter_ticket_type,
          created_at: this.form.filter_created_at,
        };

        const results = await APIClient.getTicketBooking(query);

        this.ticketBookings = results?.items.map((item) => ({
          ...item,
          created_at: dayjs(item?.created_at, DEFAULT_TIME_ZONE).format(
            DEFAULT_FORMAT_DATE
          ),
        }));

        this.totalRows = results.meta.totalItems;
        this.currentPage = results.meta.currentPage;
        this.perPage = results.meta.itemsPerPage;
      } catch (error) {
        this.$notify({
          title: "Fetch Data Failed",
          type: "warn",
          text: `Can't Fetch data ${error?.message}`,
          width: 700,
        });
      }
    },
    onSubmit(event) {
      event.preventDefault();

      this.currentPage = 1;
      this.fetchTicketBooking();
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
      this.fetchTicketBooking();
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    handlePageChange(value) {
      this.currentPage = value;
      this.fetchTicketBooking();
    },
    info(item, index, button) {
      this.infoModal.title = `Action Delete index: ${item.id}`;
      this.infoModal.row = item;

      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
      this.infoModal.row = {};
    },
    async onDelete(item) {
      try {
        await APIClient.deleteTicketBooking(item?.id);

        this.$notify({
          title: "Action Completed",
          type: "success",
          text: `Ticket Type ${item?.id} has been deleted!`,
          width: 700,
        });
      } catch (error) {
        this.$notify({
          title: "Action Failed",
          type: "warn",
          text: `Can't delete "${item?.id}" ${error?.message}`,
          width: 700,
        });
      }

      this.currentPage = 1;
      this.fetchTicketBooking();
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