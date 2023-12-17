<script setup lang="ts">
const props = defineProps<{
    header: string,
    width?: string,

    showTrash?: boolean,
    hideClose?: boolean,

    style?: "default" | "red",
}>()

const emit = defineEmits<{
    (e: "close"): void
    (e: "trash"): void
}>()

function closePopup(event: MouseEvent) {
    if (event.target === event.currentTarget) {
        emit("close")
    }
}

function trashPopup() {
    emit("trash")
}

const widthCSS = computed(() => props.width ?? "25rem")
</script>

<template>
    <Flex class="background" justify="center" align="center" @click="closePopup">
        <Flex :data-style="style" class="popup" direction="column" gap="1rem" align="stretch" justify="center">
            <Flex align="center" justify="space-between">
                <Flex align="center" gap="0.5rem">
                    <h4 class="header">{{ header }}</h4>
                </Flex>
                
                <Flex align="center" gap="1rem">
                    <img v-if="showTrash" @click="trashPopup" class="trash red-filter" src="/icons/delete.svg" alt="">
                    <img v-if="!hideClose" class="close" @click="closePopup" src="/icons/cross.svg" alt="">
                </Flex>
            </Flex>

            <Flex align="stretch" direction="column" gap="0.5rem">
                <slot></slot>
            </Flex>
        </Flex>
    </Flex>
</template>

<style lang="scss" scoped>
.popup {
    border: solid 1px var(--weak);
    background-color: white;
    border-radius: 5px;
    padding: 2rem;

    min-width: v-bind("widthCSS");
    max-width: v-bind("widthCSS");
}

.close {
    width: 0.7rem;
    height: 0.7rem;

    transition: 0.2s;

    opacity: 0.5;

    &:hover {
        opacity: 1;
    }
}

.trash {
    width: 1.25rem;
    height: 1.25rem;
}

.trash, .close {
    cursor: pointer;
    transition: 0.2s;
}

.trash:hover {
    opacity: 0.5;
}

.popup[data-style="red"] .header {
    color: var(--red) !important;
}
</style>

<style scoped>
.background {
    position: fixed;
    top: 0;
    left: 0;
    
    width: 100vw !important;
    height: 100vh !important;
    width: 100svw !important;
    height: 100svh !important;

    background: rgb(from var(--primary) r g b / 50%);
    backdrop-filter: blur(5px);
    z-index: 100;
}
</style>