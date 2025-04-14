<template>
    <div class="skeleton-wrapper">
        <div class="skeleton-line title"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
    </div>
</template>

<script setup>
// No necesita props por ahora, pero se le pueden agregar si después quieres variar
</script>

<style scoped>
.skeleton-wrapper {
    margin-bottom: 24px;
    padding: 12px 0;
}

.skeleton-line {
    height: 16px;
    background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite;
    border-radius: 6px;
    margin-bottom: 8px;
}

.skeleton-line.title {
    width: 80%;
    height: 18px;
}

.skeleton-line.short {
    width: 40%;
}

@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }

    100% {
        background-position: 200% 0;
    }
}
</style>
