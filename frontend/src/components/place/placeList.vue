<template>
  <div class="container">
      <h3>Places List</h3>
      <b-button @click="showCreateModal()" variant="info">Add</b-button>
      <b-alert variant="success" :show="showSuccessAlert" dismissible>Place was added successfully.</b-alert>
      <b-alert variant="info" :show="showInfoAlert" dismissible>Place was updated successfully.</b-alert>
      <b-alert variant="warning" :show="showWarningAlert" dismissible>Place was deleted successfully.</b-alert>
    <b-row>
      <b-col cols="6">
        <b-row>
          <b-table :items="places" :fields="fields" responsive primary-key="id">
            <template v-slot:cell(actions)="data">
              <b-button @click="showEditModal(data.item.id)" variant="warning" size="sm">Edit</b-button>&nbsp;
              <b-button @click="showDeleteModal(data.item.id)" variant="danger" size="sm">Delete</b-button>
            </template>
          </b-table>
        </b-row>
        <b-row>
          <paginateNav :property="'places'" @set-page-request="setPaginationRequest" />
        </b-row>
      </b-col>
    </b-row>
    <b-modal 
      id="placeForm" 
      :title="modalTitle" 
      hide-footer no-close-on-backdrop>
      <placeForm 
        :action="action" 
        :placeId="placeId"
        @showSuccessAlert="showSuccessAlert=true"
        @showInfoAlert="showInfoAlert=true"/>
    </b-modal>
    <b-modal 
      id="deletePlace" 
      title="Delete Place" 
      ok-title="Delete" 
      @ok="onDelete(placeId)">
      <p>Are you sure you want to delete the place?</p>
    </b-modal>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';

import placeForm from '@/components/place/placeForm.vue';
import paginateNav from '@/components/paginate.vue';

export default {
  name: 'placeList',
  components: {
    placeForm,
    paginateNav,
  },
  data() {
    return {
        placeId: null,
        action: '',
        modalTitle: '',
        fields: [
          'name',
          'actions',
        ],
        showSuccessAlert: false,
        showInfoAlert: false,
        showWarningAlert: false,
    };
  },
  computed: {
    ...mapGetters([
        'places',
    ]),
  },
  methods: {
    onDelete(placeId) {
      this.$store.dispatch('deletePlace', placeId)
        .then(() => {
          this.showWarningAlert=true;
        })
    },
    showCreateModal() {
      this.action = 'create';
      this.modalTitle = 'Add Place'
      this.$bvModal.show('placeForm');
    },
    showEditModal(placeId) {
      this.action = 'update';
      this.placeId = placeId;
      this.modalTitle = 'Edit Place'
      this.$bvModal.show('placeForm');
    },
    showDeleteModal(placeId) {
      this.placeId = placeId;
      this.$bvModal.show('deletePlace');
    },
    setPaginationRequest(page) {
      const params = { params: {
        page: page,
      }};
      this.$store.dispatch('getPlaces', params);
    },
  },

  beforeMount() {
    this.$store.dispatch('getPlaces');
  },  
}
</script>
