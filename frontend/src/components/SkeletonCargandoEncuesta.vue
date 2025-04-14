<template>
    <div class="skeleton-wrapper">
        <div class="icono">
            <slot name="icon">
                <!-- Ícono por defecto -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32px" fill="currentColor">
                    <path
                        d="M13.586 2A2 2 0 0 1 15 2.586L19.414 7A2 2 0 0 1 20 8.414V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2ZM12 4H6v16h12V10h-4.5A1.5 1.5 0 0 1 12 8.5zm3 10a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2zm-5-4a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2Zm4-5.586V8h3.586z" />
                </svg>
            </slot>
        </div>
        <p class="mensaje">Cargando encuesta</p>
    </div>
</template>

<style scoped>
.skeleton-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 70vh;
    text-align: center;
    animation: pulse 1.5s infinite;
    color: #666;
}

.icono {
    margin-bottom: 12px;
}

.mensaje {
    font-size: 1.2rem;
}

@keyframes pulse {
    0% {
        opacity: 0.3;
    }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0.3;
    }
}
</style>
