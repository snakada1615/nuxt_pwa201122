<template>
  <div class="modal">
    <div class="modal-wrap">
      // このボタンを押すとカスタムイベントcloseModalが発生
      <button @click="$emit('closeModal')">
        <p>ここを押せば閉じる</p>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .modal {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    .modal-wrap {
      background-color: rgba(0,0,0,0.5);
      height: 100%;
    }
  }
</style>
