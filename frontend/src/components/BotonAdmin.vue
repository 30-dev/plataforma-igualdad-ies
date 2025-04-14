<template>
    <router-link :to="to" class="boton-admin">
        <slot name="icono" />
        {{ label }}
    </router-link>
</template>

<script setup>
defineProps({
    to: String,
    label: String,
})
</script>

<style scoped>
.boton-admin {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 8px 16px;
    background-color: #fff;

    color: #000;
    color: var(--secondary-color);
    border-radius: 4px;
    text-decoration: none;
    outline: 1px solid var(--primary-color);
    transition: background-color 0.2s ease-in-out;
}

.boton-admin.router-link-active,
.boton-admin:hover {
    color: #fff;
    background: linear-gradient(45deg, #213547, #d2d2d2);
}
</style>
