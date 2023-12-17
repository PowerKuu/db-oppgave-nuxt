<script setup lang="ts">
export interface SelectOption {
    img?: string
    value: string,
    label: string,

    default?: boolean
    excludeModify?: boolean
}

const props = defineProps<{
    options: SelectOption[],
    selected: SelectOption[]
}>()


const selectedModel = useModel(props, "selected")

const searchQuery = ref("")

function isSelected(option: SelectOption) {
    return props.selected.includes(option)
}

function removeSelectedOption(option: SelectOption) {
    const removedOption = props.selected.filter(o => o.value !== option.value)
    selectedModel.value = removedOption
}

function selectOption(option: SelectOption) {
    if (isSelected(option)) return removeSelectedOption(option)

    selectedModel.value = [...props.selected, option]
}

function toogleEditing() {
    editing.value = !editing.value
}

const editing = ref(false)
const maxSelectedOptions = 3

const sortedOptions = computed(() => {
    const alphabeticalOrder = props.options.sort((a, b) => {
        return a.label.localeCompare(b.label)
    })

    return alphabeticalOrder.sort((a, b) => {
        if (isSelected(a) && !isSelected(b)) return -1
        else return 1
    })
})

function clickElementStrict(e: Event, callback: (e: Event) => void, excludeClass: string = "exclude") {
    const target = e.target as HTMLElement
    const currentTarget = e.currentTarget
    
    if (target === currentTarget || target.matches(`.${excludeClass} *, .${excludeClass}`)) {
        callback(e)
    }
}

function formatEmptyName(name?: string) {
    if (!name || name === "") return "Untitled"
    return name
}

function simpleSearchMatch(query: string, target: string) {
    if (query === "") return true
    target = formatEmptyName(target)
    return target.toLowerCase().includes(query.toLowerCase())
}
</script>

<template>
<Flex class="multi-selector" :data-editing="editing" direction="column">
    <Cover @click="toogleEditing" v-if="editing"></Cover>

    <Flex 
        @click="(event) => clickElementStrict(event, toogleEditing, 'exclude')" 
        width="100%" 
        class="selected" 
        gap="0.5rem" 
        justify="space-between" 
        align="center"
    >
        <Flex class="items" gap="0.5rem" align="start" justify="start">
            <Flex
                v-for="option in selected.slice(0, maxSelectedOptions)"
                @click="removeSelectedOption(option)"
                class="selected-option actual" 
                gap="0.2rem" 
                align="center" 
                justify="center"
            >
                <img 
                    v-if="option.img"
                    
                    class="icon" 
                    :src="option.img" 
                    :alt="option.label"
                    loading="lazy"
                >

                <p>{{ option.label }}</p>
            </Flex>

            <Flex 
                v-if="selected.length > maxSelectedOptions"
                class="selected-option" 
                gap="0.2rem" 
                align="center" 
                justify="center"
            >
                <p>+{{ selected.length - maxSelectedOptions }}</p>
            </Flex>
        </Flex>

        <Flex gap="0.25rem" align="center" justify="center" class="icons">
            <Flex 
                v-if="selected.length > 0" 
                @click="selectedModel = []"
                class="cross" 
                align="center"
                justify="center"
            >
                <img class="weak-filter" src="/icons/cross.svg">
            </Flex>
            
            <img class="drop-down icon exclude" src="/icons/arrow.svg">
        </Flex>
    </Flex>

    <div v-if="editing" class="selector">
        <div class="select-options">
            <Flex class="search" gap="0.5rem" align="center">
                <input v-model="searchQuery" type="text" placeholder="Search">
                <img class="weak-filter" src="/icons/search.svg" alt="">
            </Flex>

            <Flex class="list" direction="column">
                <template v-for="option of sortedOptions">
                    <Flex 
                        class="option" 
                        gap="0.5rem"
                        align="center"
                        @click="() => selectOption(option)"
                        :data-active="isSelected(option)"
                        v-if="simpleSearchMatch(searchQuery, option.label)"
                    >
                        <img
                            v-if="option.img"
                            class="icon" 
                            loading="lazy" 
                            :src="option.img" 
                            alt=""
                       />
                        <p> {{ option.label }} </p>
                    </Flex>
                </template>
            </Flex>
        </div>
    </div>
</Flex>

</template>

<style scoped lang="scss">
.icon {
    width: 1.25rem;
    height: 1.25rem;
}
.multi-selector {
    border-radius: 0.25rem;
    background-color: white;
    border: solid 1px var(--weak);

    &[data-editing="true"] {
        border: solid 1px var(--primary);
    }

    &[data-editing="false"] {
        .icons .drop-down {
            transform: rotate(-90deg);
        }
    }

    * {
        user-select: none;
    }
}

.selected {
    padding: 0.25rem;
    min-height: var(--input-size);

    .items {
        flex-wrap: wrap;
        overflow: auto;
    }
}

.icons {
    .cross {
        transition: 0.2s;
        margin-left: 0.1rem;

        padding: 0.5rem;

        cursor: pointer;
    }

    .cross img {
        width: 0.6rem;
        height: 0.6rem;
    }

    .drop-down {
        transition: 0.2s;
        cursor: pointer;
    }

    .drop-down:hover, .cross:hover {
        opacity: 0.5;
    }
}

.selected-option {
    background-color: var(--weak);
    cursor: pointer;
    padding: 0.25rem 0.7rem;
    
    border-radius: 0.25rem;

    margin-right: var(--wrap-buffer);

    span {
        font-size: 0.9rem;
        color: var(--primary);
    }

    img {
        height: 1.3rem;
    }

    &.actual:hover {
        margin-right: 0;
        opacity: 0.8;
    }
}
.add {
    background-color: var(--weak);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 0.25rem;

    transition: 0.2s;

    &:hover {
        background-color: var(--primary);

        img {
        filter: invert(1);
        }
    }
}

.selector {
    display: flex;
    flex: 1;

    position: relative;
    z-index: 200;

    top: 0.5rem;
    width: 100%;

    .select-options {
        position: absolute;
        width: 100%;

        border-radius: 0.25rem;
        background-color: white;
        border: solid 1px var(--weak);

        transition: 0.2s;

        z-index: 200;
        
        .search {
            position: sticky;
            top: 0;
            z-index: 1;
            border-bottom: 1px solid var(--weak);
            background-color: white;

            width: 100%;

            transition: 0.2s;



            img {
                height: 1.25rem;
                margin-right: 0.5rem;
            }

            input, input:focus {
                flex: 1;
                border: none;
                border-radius: 0;
                background: 0;
            }

            &:has(input:focus) {
                background-color: var(--weak);
                border-color: var(--primary);
            }
        }

        .list {
            max-height: 15rem;
            overflow-y: auto;

            .option {
                margin-top: -1px;

                cursor: pointer;
                padding: 0 0.5rem;
                min-height: var(--input-size);

                transition: 0.2s;
                background-color: white;
                border-bottom: white 1px solid;

                &:hover {
                    background-color: var(--weak);
                    border-bottom: 1px solid var(--primary);
                }

                &[data-active="true"] {
                    background-color: var(--weak);
                }
            }
        }
    }
}
</style>