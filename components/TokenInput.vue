<script setup lang="ts">
const props = defineProps<{
    token: string
    censor?: boolean

    showRegenerate?: boolean
}>()

const emit = defineEmits<{
    (e: "regenerate"): void
}>()

const currentIcon = ref("/icons/copy.svg")
const iconTimer = 1000
let iconTimeout: NodeJS.Timeout | null = null

function copyText() {
    navigator.clipboard.writeText(props.token)

    currentIcon.value = "/icons/check.svg"

    if (iconTimeout) clearTimeout(iconTimeout)

    iconTimeout = setTimeout(() => {
        currentIcon.value = "/icons/copy.svg"
    }, iconTimer)
}

function regenerate() {
    const confirmed = confirm("Are you sure you want to regenerate your code?")
    if (!confirmed) return
    emit("regenerate")
}

const text = computed(() => props.censor ? "•".repeat(props.token.length) : props.token)
</script>

<template>  
    <Flex gap="0.25rem">
        <Flex @click="copyText" class="copy-text" gap="0.25rem" style="width: 100%;">
            <p class="text text-overflow">
                {{ text }}
            </p>

            <IconButton theme="nofill" @click="copyText" :icon="currentIcon"/>
        </Flex>

        <IconButton v-if="showRegenerate" theme="nofill" @click="regenerate" icon="/icons/refresh.svg"/>
    </Flex>
</template>

<style scoped lang="scss">
.copy-text {
    cursor: pointer;

    .text {
        display: inline-block;


        padding: 0.55rem 0.5rem;
        height: var(--input-size);

        width: 0;
        flex-grow: 1;

        border: 1px solid var(--weak);
        border-radius: 5px;
    }
}
</style>