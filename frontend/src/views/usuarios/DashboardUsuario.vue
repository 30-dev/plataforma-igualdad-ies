<template>
    <div class="dashboard-wrapper">
        <header class="dashboard-header">
            <div class="user-info">
                <h1 class="dashboard-title">Bienvenido, {{ nombreUsuario }}</h1>

            </div>
            <button class="logout-button" @click="cerrarSesion">
                Cerrar sesión
            </button>
        </header>

        <main>
            <div>
                <p class="institucion-label">
                    {{ nombreInstitucion }}<br />
                    <strong>({{ codigoInstitucion }})</strong>
                </p>
            </div>
            <div class="dashboard-content">



                <div class="card" v-for="card in cards" :key="card.titulo">
                    <h2>{{ card.titulo }}</h2>
                    <p>{{ card.descripcion }}</p>
                    <button class="card-button" @click="irA(card.ruta)">Entrar</button>
                </div>
            </div>
        </main>

    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const nombreUsuario = ref('Usuario')
const nombreInstitucion = ref('Institución desconocida')
const codigoInstitucion = ref('')
const institucionData = ref(null)

const cards = computed(() => [
    {
        titulo: '9 Dimensiones',
        descripcion: 'Accede a los apartados del diagnóstico institucional.',
        ruta: `/dimensiones/${codigoInstitucion.value}`
    },
    {
        titulo: 'Resultados 9 Dimensiones',
        descripcion: 'Revisa los resultados.',
        ruta: `/resultados-dimensiones/${codigoInstitucion.value}`
    },
    {
        titulo: 'Levantamiento de Encuestas',
        descripcion: 'Participa en los instrumentos de diagnóstico.',
        ruta: `/comunidad-encuestas/${codigoInstitucion.value}`
    },
    {
        titulo: 'Autodiagnóstico',
        descripcion: 'Accede a los resultados del autodiagnóstico participativo.',
        ruta: `/autodiagnostico/${codigoInstitucion.value}`
    }
])

const irA = (ruta) => {
    router.push(ruta)
}

onMounted(async () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'))
    if (usuario?.nombre) {
        nombreUsuario.value = usuario.nombre
    }

    const codigoGuardado = usuario?.institucion_id
    if (codigoGuardado) {
        codigoInstitucion.value = codigoGuardado

        try {
            const resInstitucion = await axios.get(`https://obtenerinstitucion-34rbmbolyq-uc.a.run.app/?id=${codigoGuardado}`)
            console.log("Institución encontrada:", resInstitucion.data)

            institucionData.value = resInstitucion.data
            nombreInstitucion.value = resInstitucion.data.institucion?.nombre || 'Institución desconocida'
        } catch (error) {
            console.error('Error al obtener la institución:', error)
        }
    }
})

const cerrarSesion = () => {
    localStorage.clear()
    router.push('/')
}
</script>

<style scoped>
.dashboard-wrapper {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
}

.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    border-bottom: 1px solid #ccc;
    padding-bottom: 16px;
}

.dashboard-title {
    font-size: 24px;
    font-weight: bold;
    color: #213547;
    margin-bottom: 8px;
}

.institucion-label {
    font-size: 16px;
    color: #555;
    margin-top: 0;
    line-height: 1.3;
}

.logout-button {
    display: flex;
    gap: 8px;
    justify-content: center;
    padding: 8px 16px;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    background: linear-gradient(135deg, #292929, #5a5554);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
}

.logout-button:hover {
    background: linear-gradient(135deg, #5a5554, #292929);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.dashboard-content {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.card {
    padding: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
    text-align: center;
}

.card h2 {
    margin-bottom: 8px;
    font-size: 18px;
    color: #213547;
}

.card p {
    color: #555;
    font-size: 14px;
}

.card-button {
    margin-top: 8px;
    padding: 8px 16px;
    background: linear-gradient(135deg, #007bff, #0056b3);
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: 0.3s ease;
}

.card-button:hover {
    background: linear-gradient(135deg, #0056b3, #007bff);
}

@media screen and (max-width: 425px) {
    .dashboard-header {
        flex-direction: column;
    }

    .logout-button {
        background: #fff;
        color: #292929;
        margin-top: 10px;
        border: 1px solid #d2d2d2;
        justify-self: end;
        align-self: normal;
    }
}
</style>
