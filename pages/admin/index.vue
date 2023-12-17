<script setup lang="ts">
import type { TableData } from "@/components/Table.vue"
import type { Company, User } from "@prisma/client";

const router = useRouter()
const user = useJsonStorage<User | null>("user", null)

if (user.value == null) {
    await navigateTo("/login")
}

const companies = ref<NoServerFunctionErrors<ServerFunctionResult<"companiesGetManaging">>>([])


async function getCompanies() {
    const data = await serverFunction("companiesGetManaging", {
        token: user.value!.token
    })

    console.log(data)

    if (isServerError(data)) return

    companies.value = data
    return data
}

const data = computed<TableData>(() => ({
    head: [
        {
            id: "company",
            name: "Company"
        },

        {
            id: "platoons",
            name: "Platoons"
        },

        {
            id: "edit",
            name: "Edit",
            space: true
        },

        {
            id: "remove",
            name: "Remove",
            space: true
        }
    ],

    rows: companies.value.map((value) => ({
        cells: [
            {
                id: "company",
                value: value.name,
                type: "String"
            },

            {
                id: "platoons",
                value: value.platoons.length.toString(),
                type: "String"
            },

            {
                id: "edit",
                value: "/icons/edit.svg",
                type: "IconButton",
                
                click: () => {
                    toggleCompanyPopup(true)
                }
            },

            {
                id: "remove",
                value: "/icons/delete.svg",
                type: "IconButton",
                
                click: () => {
                    removeCompany(value.id)
                }
            }
        ],

        click: () => {
            navigateTo(`/admin/${value.id}`)
        }
    }))

}))

const showCompanyPopup = ref(false)
const editMode = ref(false)

function toggleCompanyPopup(newEditMode = false) {
    editMode.value = newEditMode
    showCompanyPopup.value = !showCompanyPopup.value
}


async function removeCompany(companyID: number) {
    const confirm = window.confirm("Are you sure you want to remove this company?")
    if (!confirm) return
    
    await serverFunction("companyDelete", {
        token: user.value!.token,
        companyID
    })

    await getCompanies()
}

async function createCompany() {
    await serverFunction("companyCreate", {
        token: user.value!.token,

        company: {
            name: companyName.value
        }
    })

    await getCompanies()

    toggleCompanyPopup()
}

const companyName = ref("")

await getCompanies()
</script>

<template>
    <Popup v-if="showCompanyPopup" @close="toggleCompanyPopup" :header="editMode ? `Edit company` : `New company`">
        <Flex gap="1rem" direction="column">
            <Flex direction="column" gap="0.25rem">
                <p>Name</p>
                <input v-model="companyName" placeholder="Name"/>
            </Flex>
            <Button @click="createCompany" icon="/icons/arrow_right.svg" theme="fill">Confirm</Button>
        </Flex> 
    </Popup>

    <Table rowHeight="4rem" :data="data"></Table>

    <PageActions>
        <IconButton @click="logout" theme="rednofill" icon="/icons/logout.svg"/>
        <IconButton @click="toggleCompanyPopup()" theme="fill" icon="/icons/plus.svg"/>
    </PageActions>
</template>

<style scoped lang="scss">

</style>