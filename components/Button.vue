<script setup lang="ts">
const props = withDefaults(defineProps<{
    icon?: string,
    theme: "nofill" | "fill" | "rednofill" | "redfill",
    reverseFilter?: boolean
}>(), {
    reverse: false,
    reverseFilter: true
})

</script>

<template>
    <button class="button" :data-theme="props.theme">
        <slot></slot>
        <img v-if="icon" :class="theme == `rednofill` ? `red-filter` : ``" :data-reverseFilter="reverseFilter" :src="icon"/>
    </button>
</template>

<style scoped lang="scss">
.button {
    all: unset;
    
    cursor: pointer;

    display: flex;

    justify-content: space-between;
    align-items: center;

    border-radius: 0.25rem;
    gap: 0.25rem;

    transition: 0.2s;

    padding: 0 1rem;

    height: var(--input-size);

    &[data-theme="fill"] {
        background-color: var(--primary);
        border: 1px solid var(--primary);
        color: white;

        &:hover {
            opacity: 0.8;
        }

        img[data-reverseFilter="true"] {
            filter: invert(1);
        }
    }

    &[data-theme="nofill"] {
        background-color: transparent;
        border: 1px solid var(--weak);

        &:hover {
            background-color: var(--weak);
        }
    }

    &[data-theme="redfill"] {
        background-color: var(--red);
        border: 1px solid var(--red);
        color: white;

        &:hover {
            opacity: 0.8;
        }

        img[data-reverseFilter="true"] {
            filter: invert(1);
        }
    }

    &[data-theme="rednofill"] {
        color: var(--red);
        background-color: transparent;
        border: 1px solid var(--red);

        &:hover {
            color: white;
            background-color: var(--red);
        }
    }



    img {
        width: 1.25rem;
        height: 1.25rem;
    }
}
</style>