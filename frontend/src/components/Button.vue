<template>
  <button
    class="reusable-btn"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'Button',
  emits: ['click']
}
</script>

<style scoped>
.my-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.2);
  color: var(--text-color);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
  font-family: inherit;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 255, 0, 0.3);
  backdrop-filter: blur(2px);
}

.my-btn:hover {
  background-color: rgba(0, 255, 0, 0.2);
  color: #0f0;
  box-shadow: 0 4px 8px rgba(0, 255, 0, 0.3);
  border-color: rgba(0, 255, 0, 0.6);
}
</style>