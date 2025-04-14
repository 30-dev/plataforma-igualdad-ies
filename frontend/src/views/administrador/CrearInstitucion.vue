<template>
    <div class="wrapper">
        <div class="crear-institucion">
            <Breadcrumb />
            <h2>Crear Institución</h2>
            <form @submit.prevent="crearInstitucion">
                <input v-model="nombre" placeholder="Nombre de la institución" required />
                <input v-model="email_contacto" type="email" placeholder="Email de contacto" required />

                <select v-model="estado" @change="cargarMunicipios" required>
                    <option disabled value="">Selecciona un estado</option>
                    <option v-for="estadoItem in estados" :key="estadoItem.ESTADO_ID" :value="estadoItem.ESTADO">
                        {{ estadoItem.ESTADO }}
                    </option>
                </select>

                <select v-model="ciudad" required :disabled="municipios.length === 0">
                    <option disabled value="">Selecciona un municipio</option>
                    <option v-for="municipioItem in municipios" :key="municipioItem.MUNICIPIO_ID"
                        :value="municipioItem.MUNICIPIO">
                        {{ municipioItem.MUNICIPIO }}
                    </option>
                </select>

                <!-- Botón con degradado y alineación a la derecha -->
                <button type="submit">Crear Institución</button>
            </form>
        </div>
        <!-- MODAL al final, pero dentro del wrapper -->
        <ModalFull :visible="modalVisible" :status="modalStatus" closable @close="modalVisible = false">
            <template #default>
                <h3 v-if="modalStatus === 'loading'">Creando institución...</h3>

                <div v-else-if="modalStatus === 'success'">
                    <h3>¡Institución creada con éxito!</h3>
                    <p>El código asignado es: <strong>{{ codigoCreado }}</strong></p>
                </div>

                <div v-else-if="modalStatus === 'error'">
                    <h3>Error al crear la institución</h3>
                    <p>Por favor intenta nuevamente.</p>
                </div>
            </template>
        </ModalFull>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../../firebase"
import Breadcrumb from '../../components/Breadcrumb.vue'
import ModalFull from '../../components/ModalFull.vue'

const modalVisible = ref(false)
const modalStatus = ref("loading") // "loading" | "success" | "error"
const codigoCreado = ref("")
const nombre = ref('')
const email_contacto = ref('')
const estado = ref('')
const ciudad = ref('')

const estados = ref([])
const municipios = ref([])
const user = ref(null)

const PROXY_ESTADOS = 'https://proxydipomexestados-34rbmbolyq-uc.a.run.app'
const PROXY_MUNICIPIOS = 'https://proxydipomexmunicipios-34rbmbolyq-uc.a.run.app'
const CREAR_INSTITUCION_URL = 'https://us-central1-igualdad-ies.cloudfunctions.net/crearInstitucion'

onMounted(async () => {
    onAuthStateChanged(auth, (firebaseUser) => {
        user.value = firebaseUser
    })

    try {
        const res = await axios.get(PROXY_ESTADOS)
        estados.value = res.data.estados
    } catch (error) {
        console.error('Error al cargar estados:', error)
        alert('Ocurrió un error al cargar los estados.')
    }
})

const cargarMunicipios = async () => {
    ciudad.value = ''
    const estadoSeleccionado = estados.value.find(e => e.ESTADO === estado.value)
    if (!estadoSeleccionado) return

    try {
        const res = await axios.get(PROXY_MUNICIPIOS, {
            params: { id_estado: estadoSeleccionado.ESTADO_ID }
        })
        municipios.value = res.data.municipios
    } catch (error) {
        console.error('Error al cargar municipios:', error)
        alert('Ocurrió un error al cargar municipios.')
    }
}

const crearInstitucion = async () => {
    modalVisible.value = true
    modalStatus.value = "loading"
    codigoCreado.value = ""

    try {
        const res = await axios.post(CREAR_INSTITUCION_URL, {
            nombre: nombre.value,
            email_contacto: email_contacto.value,
            ubicacion: {
                ciudad: ciudad.value,
                estado: estado.value
            },
            encuestas: [],
            usuarios: []
        })

        // ¡AQUÍ está el truco! Esperamos un pelito y luego actualizamos:
        setTimeout(() => {
            modalStatus.value = "success"
            codigoCreado.value = res.data.id || "SIN-CÓDIGO"
        }, 800)

        // Limpiar
        nombre.value = ''
        email_contacto.value = ''
        estado.value = ''
        ciudad.value = ''
        municipios.value = []

    } catch (error) {
        console.error(error)

        setTimeout(() => {
            modalStatus.value = "error"
        }, 800)
    }
}

</script>

<style scoped>
.wrapper {
    width: 100%;
    height: 90%;
    /* outline: 1px solid red; */
}

.crear-institucion {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 500px;
    padding: 24px;
    /* outline: 1px solid red; */
    overflow: hidden;
}

.crear-institucion form {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

input,
select {
    padding: 8px 12px;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 16px;
}

button[type="submit"] {
    align-self: flex-end;
    padding: 10px 20px;
    font-weight: 600;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    color: #213547;
    background: linear-gradient(135deg, #d2d2d2, #b5b5b5);
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

button[type="submit"]:hover {
    background: linear-gradient(135deg, #b5b5b5, #d2d2d2);
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}
</style>
