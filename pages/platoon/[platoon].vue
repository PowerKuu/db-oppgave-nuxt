<script setup lang="ts">
import type { TableData } from "@/components/Table.vue"

const route = useRoute()
const platoonID = Number(route.params.platoon as string)
const user = await useAndVerifyLogin()

if (user.value == null) {
    await navigateTo("/login")
}

const platoon = ref<NoServerFunctionErrors<ServerFunctionResult<"platoonGetCensored">>>()

const users = computed(() => {
    if (!platoon.value) return []

    const users = platoon.value.users.map((value) => ({
        ...value,
        role: "user"
    }))

    const managers = platoon.value.managers.map((value) => ({
        ...value,
        role: "manager"
    }))

    return [...users, ...managers] as {
        email?: string
        phone?: string
        name: string
        birthdate: string
        role: "user" | "manager"
    }[]
})

const data = computed<TableData>(() => ({
    head: [
        {
            id: "email",
            name: "Email"
        },

        {
            id: "phone",
            name: "Phone"
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

    rows: users.value.map((value) => ({
        cells: [
            {
                id: value.email ?? "***********",
                value: value.email ?? "***********",
                type: "String"
            },

            {
                id: value.phone ?? "***********",
                value: value.phone ?? "***********",
                type: "String"
            },

            {
                id: value.name,
                value: value.name,
                type: "String"
            },

            {
                id: value.role,
                value: value.role,
                type: "String"
            },

            {
                id: value.birthdate,
                value: (new Date().getFullYear() - new Date(value.birthdate).getFullYear()).toString(),
                type: "String"
            }
        ]
    }))
}))


async function getUsers() {
    const data = await serverFunction("platoonGetCensored", {
        token: user.value!.token,
        platoonID: platoonID
    })

    if (isServerError(data)) return

    platoon.value = data
}

async function editUser() {
    await serverFunction("userEdit", {
        token: user.value!.token,

        user: {
            birthdate: birthDate.value,
            name: fullName.value,
            phone: phoneNumber.value
        }
    })

    user.value = {
        ...user.value!,
        birthdate: birthDate.value,
        name: fullName.value,
        phone: phoneNumber.value
    }

    await getUsers()

    toogleUserPopup()
}

const showUserPopup = ref(false)

function toogleUserPopup() {
    showUserPopup.value = !showUserPopup.value
}


const birthDate = ref<string>(user.value!.birthdate)
const fullName = ref(user.value!.name)
const phoneNumber = ref(user.value!.phone)

await getUsers()
</script>

<template>
    <Popup v-if="showUserPopup" @close="toogleUserPopup" header="Edit user">
        <Flex direction="column" gap="1rem">
            <Flex direction="column" gap="0.25rem">
                <p>Full name</p>
                <input v-model="fullName" placeholder="Full name" />
            </Flex>

            <Flex direction="column" gap="0.25rem">
                <p>Phone number</p>
                <input v-model="phoneNumber" placeholder="Phone number" />
            </Flex>

            <Flex direction="column" gap="0.25rem">
                <p>Birthdate</p>
                <input type="date" v-model="birthDate" placeholder="Birthdate" />
            </Flex>

            <Button @click="editUser" theme="fill">Confirm</Button>
        </Flex>
    </Popup>

    <Table rowHeight="4rem" :data="data"></Table>
    
    <PageActions>
        <IconButton @click="logout" theme="rednofill" icon="/icons/logout.svg" />
        <IconButton @click="toogleUserPopup" theme="fill" icon="/icons/user.svg" />

        <NuxtLink href="/admin">
            <IconButton theme="fill" icon="/icons/admin.svg" />
        </NuxtLink>
    </PageActions>
</template>

<style scoped lang="scss">

</style>