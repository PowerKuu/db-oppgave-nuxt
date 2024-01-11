<script setup lang="ts">
const props = defineProps<{
    icon: string
    theme: "nofill" | "fill" | "rednofill" | "redfill"
    disabled?: boolean

    imageSize?: string
}>()

const imageSizeAbs = computed(() => props.imageSize ?? "1.25rem")
</script>
    
<template>
    <Flex justify="center" :disabled="disabled" align="center" class="button" :data-theme="theme">
        <img :class="theme == `rednofill` ? `red-filter` : ``" :src="icon" alt="">
    </Flex>
</template>

<style scoped lang="scss">
.button {
    cursor: pointer;
    border-radius: 0.25rem;

    transition: 0.2s;

    height: var(--input-size);
    width: var(--input-size);
    min-width: var(--input-size);
    min-height: var(--input-size);

    img {
        height: v-bind(imageSizeAbs);
        width: v-bind(imageSizeAbs);
    }

    &[disabled="true"] {
        opacity: 0.5;
        cursor: not-allowed;
    }

    &[data-theme="nofill"]:hover, &[data-theme="fill"] {
        background-color: var(--primary) !important;

        img {
            filter: invert(1);
        }
    }

    &[data-theme="fill"]:hover {
        opacity: 0.5;
    }

    &[data-theme="nofill"] {
        background-color: transparent;
        border: 1px solid var(--weak);
    }

    &[data-theme="redfill"] {
        background-color: var(--red);
        border: 1px solid var(--red);
        color: white;

        &:hover {
            opacity: 0.8;
        }

        img {
            filter: invert(1);
        }
    }

    &[data-theme="rednofill"] {
        background-color: transparent;
        border: 1px solid var(--red);

        &:hover {
            background-color: var(--red);

            img {
                filter: invert(1);
            }
        }
    }
}
</style>