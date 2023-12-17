<script setup lang="ts">
import type { TableData } from "@/components/Table.vue"

const route = useRoute()
const platoonID = route.params.platoon

const data: TableData = {
    head: [
        {
            id: "email",
            name: "Email"
        },

        {
            id: "name",
            name: "Name"
        },

        {
            id: "role",
            name: "Role"
        },

        {
            id: "age",
            name: "Age"
        }
    ],

    rows: [
        {
            cells: [
                {
                    id: "company",
                    value: "Company 1",
                    type: "String"
                },

                {
                    id: "owner",
                    value: "Owner 1",
                    type: "String"
                },

                {
                    id: "owner",
                    value: "Owner 1",
                    type: "String"
                },

                {
                    id: "age",
                    value: "10",
                    type: "String"
                }
            ]
        },
    ]
}

const showUserPopup = ref(false)

function toogleUserPopup() {
    showUserPopup.value = !showUserPopup.value
}


const birthDate = ref<string>("2004-12-20")
const fullName = ref("")
</script>

<template>
    <Popup v-if="showUserPopup" @close="toogleUserPopup" header="Edit user">
        <Flex direction="column" gap="1rem">
            <Flex direction="column" gap="0.25rem">
                <p>Full name</p>
                <input v-model="fullName" placeholder="Full name" />
            </Flex>

            <Flex direction="column" gap="0.25rem">
                <p>Birthdate</p>
                <input type="date" v-model="birthDate" placeholder="Birthdate" />
            </Flex>

            <Button theme="fill">Confirm</Button>
        </Flex>
    </Popup>

    <Table rowHeight="4rem" :data="data"></Table>
    
    <PageActions>
        <IconButton @click="logout" theme="rednofill" icon="/icons/logout.svg" />
        <IconButton @click="toogleUserPopup" theme="fill" icon="/icons/user.svg" />

        <NuxtLink href="/admin">
            <IconButton @click="toogleUserPopup" theme="fill" icon="/icons/admin.svg" />
        </NuxtLink>
    </PageActions>
</template>

<style scoped lang="scss">

</style>