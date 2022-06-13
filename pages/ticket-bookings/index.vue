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
                    <label>Filter Bar</label>
                    <b-form-select
                      id="filter-input"
                      v-model="form.filter_ticket_type"
                      :options="ticket_types"
                    ></b-form-select>
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

              <b-row>
                <b-col lg="6" sm="12" class="my-2">
                  <b-form-group>
                    <label for="date-datepicker">Email User</label>
                    <b-form-input
                      id="filter-email-input"
                      v-model="form.filter_user_email"
                      type="search"
                      placeholder="Type to Search Email_user"
                    ></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col lg="6" sm="12" class="my-2">
                  <div class="button-position">
                    <b-button type="reset" variant="warning" class="mr-2"
                      >Clear</b-button
                    >
                    <b-button type="submit" variant="primary"
                      ><BIconSearch /> Search
                    </b-button>
                  </div>
                </b-col>
              </b-row>
            </div>
          </b-form>
        </b-col>
        <!-- End of Filter -->

        <label class="mr-3 remark-text"
          >***When Ticket was Booking, These Ticket should't edit.</label
        >

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
              @click="
                deleteModalTicketBooking(row.item, row.index, $event.target)
              "
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

        <!-- Eelete modal -->
        <b-modal
          :id="deleteModal.id"
          :title="deleteModal.title"
          @ok="onDelete(deleteModal.row)"
          @hide="resetDeleteModal"
        >
          <div>
            Are you sure to delete, Ticket Booking User Email Name
            <b>{{ deleteModal.row.user_email }} </b>?
          </div>
        </b-modal>
        <!-- End of Delelte Modal -->
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
          key: "ticket_type",
          label: "Ticket Type",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "created_at",
          label: "Booked At",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "user_email",
          label: "Email User",
          sortable: true,
          sortDirection: "desc",
        },
        { key: "actions", label: "Actions" },
      ],
      // Form Search
      ticket_types: [{ value: null, text: "Please select an option" }],
      ticket_type_items: [],
      show: true,
      form: {
        filter_ticket_type: null,
        filter_created_at: "",
        filter_user_email: "",
      },
      // Pagination
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      // Modal Delete
      deleteModal: {
        id: "delete-modal",
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
    this.fetchTicketType();
    this.fetchTicketBooking();
  },
  methods: {
    async fetchTicketType() {
      try {
        const results = await APIClient.getTicketType();
        this.ticket_type_items = results;
        results.filter((item) => {
          this.ticket_types.push({ value: item.id, text: item.ticket_type });
        });
      } catch (error) {
        this.$notify({
          title: "Fetch Ticket Type Data Failed",
          type: "warn",
          text: `Can't Fetch data ${error?.message}`,
          width: 700,
        });
      }
    },
    async fetchTicketBooking() {
      try {
        const query = {
          page: this.currentPage,
          limit: this.perPage,
          ticket_type_id: this.form.filter_ticket_type,
          created_at: this.form.filter_created_at,
          user_email: this.form.filter_user_email,
        };

        const results = await APIClient.getTicketBooking(query);

        this.ticketBookings = results?.items.map((item) => ({
          ...item,
          created_at: dayjs(item?.created_at, DEFAULT_TIME_ZONE).format(
            DEFAULT_FORMAT_DATE
          ),
          ticket_type: this.onAdjustTicketType(item),
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
    onAdjustTicketType(ticketBooking) {
      const foundId = this.ticket_type_items.find(
        (item) => item.id == ticketBooking?.ticket_type_id
      );
      if (foundId) {
        return foundId?.ticket_type;
      }
      return "";
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
      this.form.filter_user_email = "";
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
    deleteModalTicketBooking(item, index, button) {
      this.deleteModal.title = `Action Delete index: ${item.id}`;
      this.deleteModal.row = item;

      this.$root.$emit("bv::show::modal", this.deleteModal.id, button);
    },
    resetDeleteModal() {
      this.deleteModal.title = "";
      this.deleteModal.content = "";
      this.deleteModal.row = {};
    },
    async onDelete(item) {
      try {
        await APIClient.deleteTicketBooking(item?.id);

        this.$notify({
          title: "Action Completed",
          type: "success",
          text: `Ticket Booking User Email Name ${item?.user_email} has been deleted!`,
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
  align-items: center;
  height: 100%;
  margin-top: 8px;
  justify-content: flex-end;
}

.remark-text {
  color: darksalmon;
}

.table-pagination {
  display: flex;
  justify-content: center;
}
</style>