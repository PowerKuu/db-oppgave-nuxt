<script setup lang="ts">
import type { TableData } from "@/components/Table.vue"
import type { SelectOption } from "@/components/MultiSelector.vue"
import type { User } from "@prisma/client";

const router = useRouter()
const user = useJsonStorage<User | null>("user", null)

if (user.value == null) {
    await navigateTo("/login")
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

    rows: [
        {
            cells: [
                {
                    id: "platoon",
                    value: "Platoon 1",
                    type: "String"
                },

                {
                    id: "invite",
                    value: "/icons/qrcode.svg",
                    type: "IconButton",
                    
                    click: () => {
                        toggleInvitePopup()
                    }
                },

                {
                    id: "edit",
                    value: "/icons/edit.svg",
                    type: "IconButton",
                    
                    click: () => {
                        togglePlatoonPopup(true)
                    }
                },

                {
                    id: "remove",
                    value: "/icons/delete.svg",
                    type: "IconButton",
                    click: () => {
                        removePlatoon()
                    }
                }
            ],

            click: () => router.push("/platoon/1")
        },
    ]
}
})

function removePlatoon() {
    const confirm = window.confirm("Are you sure you want to remove this platoon?")
    if (!confirm) return

    console.log("Remove platoon")
}

const editMode = ref(false)
const showPlatoonPopup = ref(false)

const showInvitePopup = ref(false)

function toggleInvitePopup() {
    showInvitePopup.value = !showInvitePopup.value
}

const inviteCode = ref("test")

function togglePlatoonPopup(newEditMode = false) {
    editMode.value = newEditMode
    showPlatoonPopup.value = !showPlatoonPopup.value
}


const platoonName = ref("")
const platoonUserMails = ref<SelectOption[]>([])
const platoonManagerMails = ref<SelectOption[]>([])

const userSelectorOptions = ref<SelectOption[]>([
    {
        label: "hkleven6@gmail.com",
        value:"123"
    }
])

const qrcodeUrl = computed(() => {
    const toUrl = `${window.location.origin}/login?invite=${inviteCode.value}`
    return `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURI(toUrl)}`
})





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

            <Button icon="/icons/arrow_right.svg" theme="fill">Confirm</Button>
        </Flex>
    </Popup>

    <Popup v-if="showInvitePopup" @close="toggleInvitePopup" header="Invite">
        <Flex direction="column" gap="1rem">
            <Flex direction="column" gap="0.25rem">
                <p>Code</p>
                <TokenInput :token="inviteCode" :showRegenerate="true" :censor="true"/>
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