<template>
    <div class="card">
        <div class="icono">
            <img :src="dimension.icono" alt="Icono" />
        </div>

        <div class="info">
            <h2 class="titulo">{{ dimension.nombre }}</h2>
            <p class="descripcion">{{ dimension.descripcion }}</p>
        </div>

        <div class="acciones" :class="{ centrado: !dimension.respondida }">
            <template v-if="dimension.respondida">
                <button @click="irAVista('editar')">Editar</button>
            </template>
            <template v-else>
                <button class="responder" @click="irAVista('responder')">Responder</button>
            </template>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const props = defineProps({
    dimension: Object
})

const irAVista = (modo) => {
    router.push(`/dimensiones/${props.dimension.codigoInstitucion}/${props.dimension.id}?modo=${modo}`)
}

</script>

<style scoped>
.card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /* border: 1px solid #ccc; */
    border-radius: 10px;
    padding: 16px;
    background: #fff;
    /* box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08); */
    height: 100%;
}

.icono {
    display: flex;
    justify-content: center;
    margin-bottom: 12px;
}

.icono img {
    width: 56px;
    height: 56px;
    object-fit: contain;
}

.info {
    text-align: center;
    margin-bottom: 16px;
}

.titulo {
    font-size: 18px;
    margin-bottom: 6px;
}

.descripcion {
    font-size: 14px;
    color: #555;
}

.acciones {
    display: flex;
    gap: 10px;
    margin-top: auto;
}

.acciones.centrado {
    justify-content: center;
}

button {
    flex: 1;
    padding: 8px 14px;
    font-size: 14px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin-bottom: 100px;
    background-color: #eeeeee;
    transition: background 0.2s;
}

button:hover {
    background-color: #dddddd;
}

.responder {
    background-color: #0077cc;
    color: white;
}

.responder:hover {
    background-color: #005fa3;
}

/* 📱 Responsivo */
@media (max-width: 600px) {
    button {
        width: 100%;
    }

    .acciones {
        flex-direction: column;
        align-items: stretch;
    }
}
</style>
