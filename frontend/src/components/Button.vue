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
.reusable-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--bg-color);
  color: var(--text-color);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
  font-family: inherit;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.reusable-btn:hover {
  background-color: var(--button-bg);
  color: var(--button-text);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}
</style>