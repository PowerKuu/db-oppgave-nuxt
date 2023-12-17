<script setup lang="ts">
import type { User } from "@prisma/client"
import { useStorage } from "@vueuse/core"


const email = ref("")
const password = ref("")

const fullName = ref("")
const birthDate = ref("")

const route = useRoute()

const invite = route.query.invite as string

const registerMode = ref(false)

const userStore = useJsonStorage<User | null>("user", null)

if (userStore.value != null) {
    const newUser = await serverFunction("userVerify", userStore.value.token)

    if (isServerError(newUser)) userStore.value = null
    else done(newUser)
}


async function done(user: User) {
    if (invite) {
        await serverFunction("userJoinPlatoon", {
            token: user.token,
            inviteCode: invite
        })
    }

    userStore.value = user

    if (user.admin == true) {
        return navigateTo("/admin")
    } else {
        return navigateTo("/platoon")
    }
}


async function login() {
    const user = await serverFunction("userLogin", {
        email: email.value,
        password: password.value
    })

    if (user == 404) {
        registerMode.value = true
        return
    }

    if (user == 401) {
        email.value = ""
        password.value = ""

        alert("Wrong password")
        return
    }

    if (isServerError(user)) {
        alert("Unknown error")
        return
    }

    done(user)
}

async function register() {
    const user = await serverFunction("userCreate", {
        email: email.value,
        password: password.value,
        name: fullName.value,
        birthdate: birthDate.value
    })

    if (isServerError(user)) {
        alert("Unknown error")
        return
    }

    done(user)
}
</script>

<template>
    <Popup v-if="!registerMode" header="Login" :hideClose="true">
        <Flex direction="column" gap="1rem">
            <Flex direction="column" gap="0.25rem">
                <p>E-mail</p>
                <input v-model="email" type="email" placeholder="Email"/>
            </Flex>

            <Flex direction="column" gap="0.25rem">
                <p>Password</p>
                <input v-model="password" type="password" placeholder="Password"/>
            </Flex>

            <Button @click="login" icon="/icons/arrow_right.svg" theme="fill">Login</Button>
        </Flex>
    </Popup>

    <Popup v-if="registerMode" header="Register" :hideClose="true">
        <Flex direction="column" gap="1rem">
            <Flex direction="column" gap="0.25rem">
                <p>Full name</p>
                <input v-model="fullName" type="text" placeholder="Full name"/>
            </Flex>

            <Flex direction="column" gap="0.25rem">
                <p>Birthdate</p>
                <input v-model="birthDate" type="date" placeholder="Birthdate"/>
            </Flex>

            <Button @click="register" icon="/icons/arrow_right.svg" theme="fill">Register</Button>
            <p @click="registerMode = false" class="link">Back</p>
        </Flex>
    </Popup>
</template>

<style scoped lang="scss">
.link {
    color: var(--primary);
    font-size: 0.9rem;
    text-decoration: underline;
    cursor: pointer;
}
</style>