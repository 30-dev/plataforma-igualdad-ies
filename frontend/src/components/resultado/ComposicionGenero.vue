<!-- /components/resultado/ComposicionGenero.vue -->
<template>
    <section class="composicion">
        <h3>Composición por género (dimensión 4)</h3>

        <div class="cards">
            <div v-for="(bloque, id) in datos" :key="id" class="card">
                <h4 class="titulo">{{ bloque.pregunta }}</h4>
                <div class="contenido">
                    <div v-for="fila in bloque.filas" :key="fila.etiqueta" class="fila">
                        <p class="etiqueta">{{ fila.etiqueta }}</p>
                        <div class="valores">
                            <span>Mujeres {{ fila.valores.mujeres ?? 0 }}</span>
                            <span>Hombres {{ fila.valores.hombres ?? 0 }}</span>
                            <span>Diferencia {{ fila.diferencia ?? 0 }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
defineProps({
    datos: Object
})
</script>

<style scoped>
.composicion {
    margin-top: 32px;
}

.cards {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}

.card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    background: #f9f9f9;
    width: 100%;
    max-width: 400px;
}

.titulo {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 12px;
    color: #333;
}

.contenido .fila {
    margin-bottom: 8px;
}

.etiqueta {
    font-weight: 600;
    color: #555;
}

.valores {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 14px;
}
</style>
