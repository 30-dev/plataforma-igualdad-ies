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

                    <header class="card-header">
                        <span class="headline">{{ card.headline }}</span>
                        <h2>{{ card.titulo }}</h2>
                    </header>

                    <div class="card-description">
                        <p>{{ card.descripcion }}</p>
                    </div>
                    <button class="card-button" @click="irA(card.ruta)">
                        Entrar
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
                            <g fill="none">
                                <path fill="#fff" d="M4 11.25a.75.75 0 0 0 0 1.5zm0 1.5h16v-1.5H4z" opacity="0.5" />
                                <path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    d="m14 6l6 6l-6 6" />
                            </g>
                        </svg>
                    </button>
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
        headline: 'Autodiagnóstico',
        titulo: 'de 9 Dimensiones',
        descripcion: 'Explora y responde los apartados del diagnóstico de igualdad de género en tu institución.',
        ruta: `/dimensiones/${codigoInstitucion.value}`
    },
    {

        headline: 'Resultados',
        titulo: 'Autodiagnóstico de 9 Dimensiones',
        descripcion: 'Consulta el nivel de cumplimiento y áreas de oportunidad en las 9 dimensiones evaluadas.',
        ruta: `/resultados-dimensiones/${codigoInstitucion.value}`
    },
    {
        headline: 'Autodiagnóstico',
        titulo: 'encuestas a la comunidad escolar',
        descripcion: 'Consulta los enlaces para que la comunidad participe y revisa los resultados obtenidos en las encuestas sobre igualdad de género.',
        ruta: `/comunidad-encuestas/${codigoInstitucion.value}`
    },
    {
        headline: 'Autodiagnóstico',
        titulo: 'Participativo',
        descripcion: 'Si ya implmentaste el proceso participativo con la comunidad educativa, responde esta sección.',
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
    border-radius: 4spx;
    background-color: #fff !important;
    text-align: center;
}

.card-header {
    display: flex;
    flex-direction: column;
    gap: 2px;
    justify-content: center;
    align-items: center;
    margin: 0 auto 0 auto;
    width: 100%;
    min-height: 70px;
}




.headline {
    font-size: 16px;
    line-height: 18px;
    font-weight: 700;
    color: #213547;
}

.card-header h2 {
    margin: 0 0 4px 0;
    line-height: 19px;
    font-size: 18px;
    color: #213547;
}


.card-description {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 125px;
    max-height: 125px;
    width: 100%;

}

@media screen and (min-width: 425px) {
    .card-description {
        min-height: 125px;
        max-height: 125px;

    }

}

.card p {
    margin: 4px auto 8px auto;
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
