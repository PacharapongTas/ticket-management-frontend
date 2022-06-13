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
          <span><h1>Ticket Type</h1></span>
          <b-button variant="outline-primary" to="ticket-types/new">
            Create Ticket Type
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
          >***Ticket Type like A, B, C and D should not delete.</label
        >

        <b-table
          striped
          hover
          :items="ticketTicketType"
          :fields="fields"
          :current-page="currentPage"
          :per-page="0"
          @filtered="onFiltered"
        >
          <template #cell(actions)="row">
            <b-button
              size="sm"
              @click="editModalTicketType(row.item, row.index, $event.target)"
              class="mr-1 edit-text-button"
              :disabled="
                !!prevent_delete.find((item) => row.item.ticket_type == item)
              "
            >
              <BIconPencilFill /> Edit
            </b-button>

            <b-button
              size="sm"
              @click="deleteModalTicketType(row.item, row.index, $event.target)"
              class="mr-1"
              :disabled="
                !!prevent_delete.find((item) => row.item.ticket_type == item)
              "
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

        <!-- Edit modal -->
        <b-modal
          :id="editModal.id"
          :title="editModal.title"
          @ok="onEdit(editModal.row)"
          @hide="resetEditModal"
        >
          {{ deleteModal.row.ticket_type }}
          <div>
            <div class="p-2">
              <label>Ticket Type: </label>
              <b-form-input
                v-model="editForm.ticket_type"
                disabled
              ></b-form-input>
            </div>

            <div class="p-2">
              <label>Price: </label>
              <b-form-input
                v-model="editForm.price"
                type="number"
                min="1"
              ></b-form-input>
            </div>

            <div class="p-2">
              <label>Daily Quota: </label>
              <b-form-input
                v-model="editForm.daily_quota"
                type="number"
                placeholder="Minimun quantity."
                min="1"
              ></b-form-input>
            </div>

            <div class="p-2">
              <label>Minimum: </label>
              <b-form-input
                v-model="editForm.minimum"
                type="number"
                min="1"
                placeholder="Fill number."
              ></b-form-input>
            </div>
          </div>
        </b-modal>
        <!-- End Edit Modal -->

        <!-- Delete modal -->
        <b-modal
          :id="deleteModal.id"
          :title="deleteModal.title"
          @ok="onDelete(deleteModal.row)"
          @hide="resetDeleteModal"
        >
          <pre>
Are you sure to delete, Ticket Type name => {{
              deleteModal.row.ticket_type
            }}</pre
          >
        </b-modal>
        <!-- End Delete Modal -->
      </b-container>
      <!-- End of Scope -->
    </div>
  </client-only>
</template>

<script>
import Nav from "../../components/site/Nav.vue";
import Breadcrumb from "../../components/site/Breadcrumb.vue";
import { BIconPencilFill, BIconTrashFill, BIconSearch } from "bootstrap-vue";
import APIClient from "../../utils/APIClient";
import { BAD_REQUEST_WITH_DESCRIPTION, PREVENT_DELETE_VALUE } from "../../utils/Constants";

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
      ticketTicketType: [],
      prevent_delete: PREVENT_DELETE_VALUE,
      // Header Field
      fields: [
        {
          key: "ticket_type",
          label: "Ticket Type",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "price",
          label: "Price",
          sortable: true,
          sortDirection: "desc",
          class: "text-center",
        },
        {
          key: "daily_quota",
          label: "Amount limit per day",
          sortable: true,
          sortDirection: "desc",
          class: "text-center",
        },
        {
          key: "minimum",
          label: "Minimum buying",
          sortable: true,
          sortDirection: "desc",
          class: "text-center",
        },
        { key: "actions", label: "Actions" },
      ],
      // Form Search
      show: true,
      form: {
        filter_ticket_type: null,
      },
      // Pagination
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      // Modal Delete
      editForm: {
        ticket_type: "",
        price: 0,
        daily_quota: 1,
        minimum: 1,
      },
      editModal: {
        id: "edit-modal",
        title: "",
        content: "",
      },
      // Modal Delete
      deleteModal: {
        id: "delete-modal",
        title: "",
        content: "",
        row: {},
      },
    };
  },
  components: {
    Nav,
    Breadcrumb,
    BIconPencilFill,
    BIconTrashFill,
    BIconSearch,
    PREVENT_DELETE_VALUE,
  },
  mounted() {
    // Set the initial number of items
    // Fetch Ticket-Booking
    this.fetchTicketType();
  },
  methods: {
    async fetchTicketType() {
      try {
        const query = {
          page: this.currentPage,
          limit: this.perPage,
          ticket_type: this.form.filter_ticket_type,
        };

        const results = await APIClient.getTicketTypeQuery(query);

        this.ticketTicketType = results.items;

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
      this.fetchTicketType();
    },
    onReset(event) {
      event.preventDefault();
      // Reset our form values
      this.form.filter_ticket_type = null;

      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
      this.fetchTicketType();
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    handlePageChange(value) {
      this.currentPage = value;
      this.fetchTicketType();
    },
    async editModalTicketType(item, index, button) {
      this.editModal.title = `Action Edit Ticket Type: ${item.ticket_type}`;
      this.editModal.row = item;

      try {
        const results = await APIClient.getTicketTypeById(item?.id);

        this.editForm.ticket_type = results.ticket_type;
        this.editForm.price = results.price;
        this.editForm.daily_quota = results.daily_quota;
        this.editForm.minimum = results.minimum;
      } catch (error) {
        this.$notify({
          title: "Fetch Data Failed",
          type: "warn",
          text: `Can't Featch data ${error?.message}`,
          width: 700,
        });
      }

      this.$root.$emit("bv::show::modal", this.editModal.id, button);
    },
    resetEditModal() {
      this.editModal.title = "";
      this.editModal.content = "";
      this.editModal.row = {};
    },
    async onEdit(item) {
      try {
        const updateTicketTypeData = {
          ticket_type: this.editForm.ticket_type,
          price: this.editForm.price,
          daily_quota: this.editForm.daily_quota,
          minimum: this.editForm.minimum,
        };

        await APIClient.updateTicketType(item?.id, updateTicketTypeData);

        this.$notify({
          title: "Action Edit Completed",
          type: "success",
          text: `Ticket Type name ${item?.ticket_type} has been edit!`,
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
      this.fetchTicketType();
    },
    deleteModalTicketType(item, index, button) {
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
        await APIClient.deleteTicketType(item?.id);

        this.$notify({
          title: "Action Completed",
          type: "success",
          text: `Ticket Type name = ${item?.ticket_type} has been deleted!`,
          width: 700,
        });
      } catch (error) {
        this.$notify({
          title: "Action Failed",
          type: "warn",
          text: `Can't delete "${item?.id}" ${error?.status == 400 && BAD_REQUEST_WITH_DESCRIPTION}`,
          width: 700,
        });
      }

      this.currentPage = 1;
      this.fetchTicketType();
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

.edit-text-button {
  background-color: darkslateblue;
}

.table-pagination {
  display: flex;
  justify-content: center;
}
</style>