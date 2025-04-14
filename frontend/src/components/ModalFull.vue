<template>
    <transition name="fade">
        <div v-if="visible" class="modal-overlay" @keydown.esc="handleEsc" tabindex="0">
            <div class="modal-content" :class="status">
                <div class="modal-icon" v-if="status">
                    <span v-if="status === 'loading'">⏳</span>
                    <span v-else-if="status === 'success'">✅</span>
                    <span v-else-if="status === 'error'">❌</span>
                </div>

                <slot name="default">
                    <p>Cargando...</p>
                </slot>

                <button v-if="closable" class="cerrar-modal" @click="$emit('close')">
                    Cerrar
                </button>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
    visible: Boolean,
    status: {
        type: String,
        default: null // 'loading' | 'success' | 'error'
    },
    closable: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['close'])

function handleEsc(e) {
    if (props.visible && props.closable) {
        emit('close')
    }
}

onMounted(() => {
    document.addEventListener('keydown', handleEsc)
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleEsc)
})
</script>

<style scoped>
/* Transición */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Fondo del modal */
.modal-overlay {
    position: fixed;
    z-index: 9999;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Contenedor del modal */
.modal-content {
    background: white;
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    max-width: 400px;
    width: 90%;
    text-align: center;
    position: relative;
    outline: none;
}

.modal-content.loading {
    border-top: 5px solid #213547;
}

.modal-content.success {
    border-top: 5px solid #2ecc71;
}

.modal-content.error {
    border-top: 5px solid #e74c3c;
}

.modal-icon {
    font-size: 32px;
    margin-bottom: 12px;
}

/* Botón cerrar */
.cerrar-modal {
    margin-top: 24px;
    padding: 10px 20px;
    background-color: var(--primary-color, #213547);
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.cerrar-modal:hover {
    background-color: #1a4a5a;
}
</style>
