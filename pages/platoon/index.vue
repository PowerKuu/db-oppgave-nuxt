<script setup lang="ts">
// Redirect to the first platoon

const user = await useAndVerifyLogin()

if (user.value == null) {
    await navigateTo("/login")
}

const id = serverFunction("platoonGetAvailible", {
    token: user.value!.token
})

if (isServerError(id)) alert("You are not in any platoon. Please contact your platoon leader to get an invite code.")
else navigateTo(`/platoon/${id}`)
</script>

<template>

</template>

<style scoped lang="scss">

</style>