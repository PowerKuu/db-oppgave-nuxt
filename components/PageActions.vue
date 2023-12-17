<script setup lang="ts">

</script>

<template>
    <Flex gap="0.5rem" class="page-actions">
        <slot></slot>
    </Flex>
</template>

<style scoped lang="scss">
.page-actions {
    position: absolute;

    bottom: 0.5rem;
    left: 0.5rem;
}
</style>