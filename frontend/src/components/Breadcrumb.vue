<template>
    <nav class="breadcrumb">
        <router-link to="/admin/dashboard">← Regresar al Panel de Administración</router-link>
    </nav>
</template>

<style scoped>
.breadcrumb {
    margin-bottom: 16px;
}

.breadcrumb a {
    color: var(--primary-color, #213547);
    text-decoration: none;
    font-weight: 600;
}

.breadcrumb a:hover {
    text-decoration: underline;
}
</style>
