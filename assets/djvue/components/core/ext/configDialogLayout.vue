<template>
<v-dialog
        v-model="isActive"
        width="80%"
        height="400px"
        persistent
      >
      <slot></slot>
</v-dialog>      
</template>
<script>
 export default {}
</script>