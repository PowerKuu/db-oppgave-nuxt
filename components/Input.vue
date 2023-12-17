<script setup lang="ts">
const props = defineProps<{
    modelValue?: string
    placeholder: string
}>()

const model = useModel(props, "modelValue")
const inputElement = ref<HTMLInputElement>()


function focusInput() {
    inputElement.value?.focus()
}
</script>
 
<template>
    <div :data-hasInput="!!model" class="input" @click="focusInput">
        <div>
            <p>{{ placeholder }}</p>
        </div>
        
        <input
            ref="inputElement" 
            type="text"
            v-model="model"
        >
    </div>
</template>

<style scoped lang="scss">
.input {
    display: flex;
    flex-direction: column;
    justify-content: center;

    border: 1px solid var(--weak);

    cursor: text;
    height: var(--input-size);

    padding: 0 0.5rem;

    border-radius: 0.25rem;

    input {
        padding: 0;
        border: 0;
        background-color: transparent;
        margin-bottom: -0.9rem;

        font-size: 1rem;

        padding: 0 0.075rem;
    }

    input:focus {
        outline: none;
    }

    &:has(input:focus), &[data-hasInput="true"] {
        div {
            margin-top: -1.2rem;

            p {
                font-size: 0.75rem;
            }
        }
    }

    div {
        transition: 0.5s;
        position: absolute;

        p {
            color: var(--weak-text);
            transition: 0.5s;
            font-size: 1rem;
        }
    }
}
</style>