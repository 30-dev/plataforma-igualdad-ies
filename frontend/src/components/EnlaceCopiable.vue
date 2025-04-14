<template>
    <div class="caja-enlace">
        <input :value="texto" readonly />
        <button @click="copiar">
            <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24">
                <path fill="white"
                    d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1m3 4H8a2 2 0 0 0-2 2v16h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m0 18H8V7h11v16Z" />
            </svg>
            <transition name="fade">
                <span v-if="copiado" class="tooltip">¡Enlace copiado!</span>
            </transition>
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    texto: String
})

const copiado = ref(false)

const copiar = async () => {
    try {
        await navigator.clipboard.writeText(props.texto)
        copiado.value = true
        setTimeout(() => (copiado.value = false), 2000)
    } catch (err) {
        console.error('No se pudo copiar', err)
    }
}
</script>

<style scoped>
.caja-enlace {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    flex-wrap: nowrap;
    /* 👈 evita que salte */
    overflow: hidden;
}

.caja-enlace input {
    flex: 1;
    padding: 6px 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background-color: #f1f1f1;
    color: #333;
    cursor: default;
    /* min-width: 220px; */
}

.caja-enlace button {
    position: relative;
    padding: 6px 10px;
    border: none;
    border-radius: 6px;
    background-color: #007bff;
    color: white;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
}

/* 🧩 Tooltip */
.tooltip {
    position: absolute;
    top: -36px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: #fff;
    padding: 4px 10px;
    font-size: 13px;
    border-radius: 4px;
    white-space: nowrap;
    z-index: 10;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

/* ✨ Animación fade */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@media (max-width: 420px) {
    .caja-enlace {
        /* flex-direction: column; */
        align-items: stretch;
        gap: 4px;
    }

    .caja-enlace input {
        width: 100%;
        min-width: auto;
    }

    .caja-enlace button {
        align-self: flex-end;
    }
}
</style>
