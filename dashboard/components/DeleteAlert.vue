<template>
  <div class="modal fade" :id="id" tabindex="-1" role="dialog" aria-labelledby="ModalComponents" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="ModalComponents">Alert</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div class="modal-body">
            Are you sure you want to delete {{title}}?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" data-dismiss="modal">Cancel</button>
          <button type="button" @click="deleteItem" class="btn btn-outline-danger" data-dismiss="modal">Yes</button>
        </div>
      </div>
    </div>
  </div>    
</template>

<script>
export default {
    name: 'DeleteAlert',
    props: ["id", "title", "itemId"],
    methods: {
        deleteItem() {
            this.$emit('deleteItem', this.itemId);
        }
    }
}
</script>