<script setup lang="ts">
import type { TableData } from "@/components/Table.vue"
import type { SelectOption } from "@/components/MultiSelector.vue"

const router = useRouter()
const user = await useAndVerifyLogin()

const route = useRoute()
const companyID = Number(route.params.company as string)

if (user.value == null) {
    await navigateTo("/login")
}

const platoons = ref<NoServerFunctionErrors<ServerFunctionResult<"platoonsGetMangingOnCompany">>>([])

async function getMangingPlatoons() {
    const data = await serverFunction("platoonsGetMangingOnCompany", {
        token: user.value!.token,
        companyID: companyID
    })

    if (isServerError(data)) return

    platoons.value = data
}

async function getUsersOnCompany() {
    const data = await serverFunction("companyGet", {
        token: user.value!.token,
        companyID: companyID
    })


    if (isServerError(data)) return

    userSelectorOptions.value = data.usersHistory.map((value) => ({
        label: value.email,
        value: value.email
    }))
}

const tableData = computed<TableData>(() => {
    return {
        head: [
            {
                id: "platoon",
                name: "Platoon"
            },

            {
                id: "invite",
                name: "Invite"
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

        rows: platoons.value.map((value) => ({
                cells: [
                    {
                        id: "platoon",
                        value: value.name,
                        type: "String"
                    },

                    {
                        id: "invite",
                        value: "/icons/qrcode.svg",
                        type: "IconButton",
                        
                        click: () => {
                            editingPlatoonID.value = value.id

                            inviteCode.value = value.inviteCode
                            toggleInvitePopup()
                        }
                    },

                    {
                        id: "edit",
                        value: "/icons/edit.svg",
                        type: "IconButton",
                        
                        click: () => {
                            platoonName.value = value.name

                            platoonUserMails.value = value.users.map((value) => ({
                                label: value.email,
                                value: value.email
                            }))

                            platoonManagerMails.value = value.managers.map((value) => ({
                                label: value.email,
                                value: value.email
                            }))

                            editingPlatoonID.value = value.id
                            togglePlatoonPopup(true)
                        }
                    },

                    {
                        id: "remove",
                        value: "/icons/delete.svg",
                        type: "IconButton",
                        click: () => {
                            removePlatoon(value.id)
                        }
                    }
                ],

                click: () => router.push(`/platoon/${value.id}`)
            })
        )
    }
})

async function removePlatoon(platoonID: number) {
    const confirm = window.confirm("Are you sure you want to remove this platoon?")
    if (!confirm) return

    await serverFunction("platoonDelete", {
        token: user.value!.token,
        platoonID: platoonID
    })

    await getMangingPlatoons()
}

async function createPlatoon() {
    await serverFunction("platoonCreate", {
        token: user.value!.token,
        companyID: companyID,
        platoon: {
            name: platoonName.value,
            
            users: platoonUserMails.value.map((value) => value.value),
            managers: platoonManagerMails.value.map((value) => value.value)
        }
    })

    await getMangingPlatoons()

    togglePlatoonPopup()
}

async function editPlatoon() {
    if (editingPlatoonID.value == null) return

    await serverFunction("platoonEdit", {
        token: user.value!.token,
        platoonID: editingPlatoonID.value,

        platoon: {
            name: platoonName.value,
            users: platoonUserMails.value.map((value) => value.value),
            managers: platoonManagerMails.value.map((value) => value.value)
        }
    })

    await getMangingPlatoons()

    togglePlatoonPopup()
}

async function regenerateInviteUrl() {
    const platoon = await serverFunction("platoonRegenerateInvite", {
        token: user.value!.token,
        platoonID: editingPlatoonID.value!
    })

    if (isServerError(platoon)) return

    inviteCode.value = platoon.inviteCode
}

const editMode = ref(false)
const editingPlatoonID = ref<number | null>(null)

const showPlatoonPopup = ref(false)

const showInvitePopup = ref(false)

function toggleInvitePopup() {
    showInvitePopup.value = !showInvitePopup.value
}

const inviteCode = ref("")

function togglePlatoonPopup(newEditMode = false) {    
    if (!newEditMode) {
        platoonName.value = ""
        platoonUserMails.value = []
        platoonManagerMails.value = []
    }

    editMode.value = newEditMode

    showPlatoonPopup.value = !showPlatoonPopup.value
}


const platoonName = ref("")
const platoonUserMails = ref<SelectOption[]>([])
const platoonManagerMails = ref<SelectOption[]>([])

const userSelectorOptions = ref<SelectOption[]>([])

const inviteUrl = computed(() => {
    return `${window.location.origin}/login?invite=${inviteCode.value}`
})

const qrcodeUrl = computed(() => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURI(inviteUrl.value)}`
})

function confirmPopup() {
    if (editMode.value) {
        editPlatoon()
    } else {
        createPlatoon()
    }
}

await getMangingPlatoons()
await getUsersOnCompany()
</script>

<template>
    <Table rowHeight="4rem" :data="tableData"></Table>

    <Popup v-if="showPlatoonPopup" @close="togglePlatoonPopup" :header="editMode ? `Edit platoon` : `New platoon`">
        <Flex direction="column" gap="1rem">
            <Flex direction="column" gap="0.25rem">
                <p>Name</p>
                <input v-model="platoonName" placeholder="Name"/>
            </Flex>
            
            <Flex direction="column" gap="0.25rem">
                <p>Users</p>
                <MultiSelector v-model:selected="platoonUserMails" :options="userSelectorOptions"/>
            </Flex>

            <Flex direction="column" gap="0.25rem">
                <p>Managers</p>
                <MultiSelector v-model:selected="platoonManagerMails" :options="userSelectorOptions"/>
            </Flex>

            <Button @click="confirmPopup" icon="/icons/arrow_right.svg" theme="fill">Confirm</Button>
        </Flex>
    </Popup>

    <Popup v-if="showInvitePopup" @close="toggleInvitePopup" header="Invite">
        <Flex direction="column" gap="1rem">
            <Flex direction="column" gap="0.25rem">
                <p>Link</p>
                <TokenInput @regenerate="regenerateInviteUrl" :token="inviteUrl" :showRegenerate="true" :censor="false"/>
            </Flex>
            
            <Flex direction="column" gap="0.25rem">
                <p>Qrcode</p>
                <img class="qrcode" :src="qrcodeUrl" alt="">
            </Flex>
        </Flex>
    </Popup>



    <PageActions>
        <NuxtLink href="/admin">
            <IconButton theme="nofill" icon="/icons/arrow_left.svg"/>
        </NuxtLink>
        
        <IconButton @click="togglePlatoonPopup()" theme="fill" icon="/icons/plus.svg"/>
    </PageActions>
</template>

<style scoped lang="scss">
.qrcode {
    border: 1px solid var(--weak);
    padding: 1rem;
    border-radius: 0.25rem;
}
</style>