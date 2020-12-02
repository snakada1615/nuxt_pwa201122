<template>
  <transition name="modal" appear>
    <div class="modal__overlay">
      <div class="modal__window">
        <div class="modal__content">
          <b-row>
            <b-col>
              <b-card>
                <div>
                  test
                </div>
                <b-button variant="info" size="sm" @click="$emit('modalClose')">close</b-button>
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
    height: 300px;
    width: 500px;
    overflow: hidden;
    background-color: lightgray;
  }

  &__content {
    height: 100%;
    padding: 30px;
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
