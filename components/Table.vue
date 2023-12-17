<script setup lang="ts">
export interface Head {
    name: string,
    id: string,

    info?: string,
    width?: string,
    space?: boolean,
    sort?: boolean
}

export type Cell = {
    id: string,
} & ({
    type: "String"
    value: string
    link?: string
} | {
    type: "Boolean"
    value: boolean
} | {
    type: "IconButton"
    value: string
    click: () => void
})

export type TableData = {
    head: Head[],
    rows: { 
        click?: () => void,
        cells: Cell[] 
    }[]
}

const props = defineProps<{
    data: TableData,
    rowHeight?: string,
    rowPadding?: string
}>()

export interface FilterOptions {
    head: Head,
    activeSort: "up" | "down" | "none"
}

const emit = defineEmits<{
    (e: "update:filter", filter: FilterOptions | null): void
}>()

const rowPaddingAbs = computed(() => props.rowPadding ?? "1rem")
const rowHeightAbs = computed(() => props.rowHeight ?? "3rem")

const cellWidth = computed(() => {
    const max = Math.min(100 / props.data.head.length, 100)
    return `${max}%`
})

function getCellWidth(id: string) {
    const head = props.data.head.find((item) => item.id == id)

    return head?.width ?? cellWidth.value
}

function getCellSpace(id: string) {
    const head = props.data.head.find((item) => item.id == id)

    return head?.space ?? false
}

const defaultSortOption = {
    headID: "",
    activeSort: "none"
}

const sortOption = ref(defaultSortOption)

async function filter(filter: FilterOptions) {
    if (
        sortOption.value.headID == filter.head.id &&
        sortOption.value.activeSort == filter.activeSort
    ) {
        sortOption.value = defaultSortOption

        return emit("update:filter", null)
    }

    sortOption.value = {
        headID: filter.head.id,
        activeSort: filter.activeSort
    }

    emit("update:filter", filter)
}

function checkClick(event: Event, callback: () => void) {
    if (!callback) return
    if (event.target instanceof HTMLElement) {
        if (event.target.dataset.canclick != undefined) {
            console.log(event.target)
            callback()
        }
    }
}
</script>

<template>
<Flex direction="column">
    <Flex class="head row" gap="0.5rem" align="center">
        <Flex gap="0.25rem" v-for="head of data.head" :data-id="head.id" :data-space="getCellSpace(head.id)" :width="getCellWidth(head.id)" align="center">
            <p class="text-overflow">{{ head.name }}</p>

            <InfoTooltip v-if="!!head.info">
                {{ head.info }}
            </InfoTooltip>

            <Flex direction="column" v-if="head.sort">
                <img 
                    class="arrow-up contrast-filter"
                    :data-active="head.id == sortOption.headID && sortOption.activeSort == 'up'"
                    src="/icons/sort-arrow.svg" 
                    alt=""
                    @click="filter({head, activeSort: 'up'})"
                >
                <img
                    class="arrow-down contrast-filter"
                    :data-active="head.id == sortOption.headID && sortOption.activeSort == 'down'"
                    src="/icons/sort-arrow.svg"
                    alt="" 
                    @click="filter({head, activeSort: 'down'})"
                >
            </Flex>
        </Flex>
    </Flex>

    <Flex class="rows" direction="column">
        <Flex gap="0.5rem" v-for="row of data.rows" class="row" data-canclick :data-clickable="row.click ? true : false" @click="checkClick($event, row.click!)">
            <Flex 
                class="cell text-overflow" 
                v-for="cell of row.cells" :data-id="cell.id" 
                :data-space="getCellSpace(cell.id)"
                :style="{
                    width: getCellWidth(cell.id)
                }"

                data-canclick
            >
                <p data-canclick class="h7 text-overflow" v-if="cell.type == 'String'">
                    <NuxtLink v-if="cell.link" class="h7 underline" :href="cell.link">
                        {{ cell.value }}
                    </NuxtLink>
                    <template v-else>
                        {{ cell.value }}
                    </template>
                </p>

                <Flex data-canclick class="boolean" v-else-if="cell.type == 'Boolean'" :data-boolean="cell.value">
                    <p>{{ cell.value ? "True" : "False" }}</p>
                </Flex>

                <IconButton :icon="cell.value" @click="cell.click" v-else-if="cell.type == 'IconButton'" theme="nofill"></IconButton>
            </Flex>
        </Flex>
    </Flex>
</Flex>
</template>

<style lang="scss" scoped>
.arrow-up, .arrow-down {
    width: 0.4rem;
    height: 0.4rem;
    cursor: pointer;
    transition: transform 0.2s;

    &[data-active="false"] {
        opacity: 0.25;
    }
}

.underline {
    text-decoration: underline;
}

.arrow-down {
    transform: rotate(180deg);
}

.head {
    p {
        font-size: 01rem;
        color: var(--weak-text);
    }
}

.row {
    padding: 0.5rem 0rem;
    border-bottom: 1px solid var(--weak);

    align-items: center !important;

    padding-left: v-bind("rowPaddingAbs") !important;
    padding-right: v-bind("rowPaddingAbs") !important;

    min-height: v-bind("rowHeightAbs") !important;

    transition: background-color 0.2s, border-color 0.2s;

    
    background-color: white;

    border-radius: 0.25rem;
}

.row[data-clickable="true"]:hover {
    cursor: pointer;

    background-color: var(--weak);
    border-color: var(--primary);
}

.cell[data-space="true"] {
    margin-left: auto;
}

.iconButton {
    background-color: var(--primary);
    border-radius: 5px;

    min-width: 1.7rem;
    min-height: 1.7rem;

    cursor: pointer;
    transition: opacity 0.2s;
}

.iconButton:hover {
    opacity: 0.8;
}

.iconButton img {
    width: 0.9rem;
    height: 0.9rem;
    filter: invert(1);
}

.h7 {
    color: var(--primary-text);
    font-size: 1rem;
}

.boolean {
    padding: 0.15rem 0.4rem;

    border-radius: 0.25rem;

    &[data-boolean="true"] {
        background-color: rgba(0, 189, 47, 0.913);

        p {
            color: white;
            font-weight: 400;
        }
    }

    &[data-boolean="false"] {
        background-color: rgba(189, 3, 0, 0.913);

        p {
            color: white;
        }
    }
    
}
</style>