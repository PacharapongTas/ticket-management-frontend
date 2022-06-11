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
        <b-table striped hover :items="ticketBookings" :fields="fields">
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
      </b-container>
      <!-- End of Scope -->
    </div>
  </client-only>
</template>

<script lang="ts">
import Nav from "../../components/site/Nav.vue";
import Breadcrumb from "../../components/site/Breadcrumb.vue";
import { IBREADCRUMBS } from "~/utils/constants";
import { BIconTrashFill } from "bootstrap-vue";

export default {
  data() {
    return {
      breadcrumbs: [
        {
          name: "Ticket-Booking",
          text: "=> Ticket-Bookings",
          href: "#",
        },
      ] as IBREADCRUMBS[],
      ticketBookings: [
        { ticket_type: "Dickerson", price: 40, created_at: "12:12" },
        { ticket_type: "Larsen", price: 21, created_at: "13:12" },
        { ticket_type: "Geneva", price: 89, created_at: "12:23" },
        { ticket_type: "Jami", price: 38, created_at: "11:22" },
      ],
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
    };
  },
  components: { Nav, Breadcrumb, BIconTrashFill },
};
</script>

<style lang="css" scoped>
.create-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-block-end: 2ch;
}
</style>