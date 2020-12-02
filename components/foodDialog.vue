<template>
  <transition name="modal" appear>
    <div class="modal__overlay">
      <div class="modal__window">
        <div class="modal__content">
          <b-row>
            <b-col>
              <b-card>
                <div>
                  <b-table
                    :items="items"
                    :fields="fields"
                  ></b-table>
                  <b-form inline>
                    <b-row>
                      <b-col cols="8">
                        <b-form-input v-model="inputWeight"></b-form-input>
                      </b-col>
                      <b-col cols="2">
                        <b-button variant="info" size="sm" @click="modalOk">Set</b-button>
                      </b-col>
                      <b-col cols="2">
                        <b-button variant="info" size="sm" @click="$emit('modalClose')">Cancel</b-button>
                      </b-col>
                    </b-row>
                  </b-form>
                </div>
              </b-card>
            </b-col>
          </b-row>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return{
      fields: [
        {key: 'id', sortable: false, tdClass: 'd-none', thClass: 'd-none'},
        {key: 'Name', sortable: true, thStyle:{width: "290px"}},
        {key: 'En', sortable: true, thStyle:{width: "50px"}},
        {key: 'Pr', sortable: true, thStyle:{width: "50px"}},
        {key: 'Va', sortable: true, thStyle:{width: "50px"}},
        {key: 'Fe', sortable: true, thStyle:{width: "50px"}},
      ],
      inputWeight: 0
    }
  },
  methods: {
    modalOk(){
      let result = {}
      result.item = this.items
      result.Wt = this.inputWeight
      this.$emit('modalOk', result)
    }
  }
}
</script>

<style lang="scss" scoped>
.modal {
  &__overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.7);
  }

  &__window {
    height: 230px;
    width: 500px;
    overflow: hidden;
    background-color: lightgray;
  }

  &__content {
    height: 100%;
    padding: 10px;
  }
}

// transition
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s;

  .modal__window {
    transition: opacity 0.4s, transform 0.4s;
  }
}

.modal-leave-active {
  transition: opacity 0.6s ease 0.4s;
}

.modal-enter,
.modal-leave-to {
  opacity: 0;

  .modal__window {
    opacity: 0;
    transform: translateY(-20px);
  }
}
</style>
