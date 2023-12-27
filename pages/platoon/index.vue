<script setup lang="ts">
// Redirect to the first platoon

const user = await useAndVerifyLogin()

if (user.value == null) {
    await navigateTo("/login")
}

const availible = await serverFunction("platoonGetAvailible", {
    token: user.value!.token
})

if (isServerError(availible)) { 
    alert("You are not in any platoon. Please contact your platoon leader to get an invite code.") 
    await navigateTo("/admin")
}
else navigateTo(`/platoon/${availible.id}`)
</script>

<template>

</template>

<style scoped lang="scss">

</style>