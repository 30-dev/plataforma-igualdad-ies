<template>
    <div class="wrapper">
        <div class="crear-usuario">
            <Breadcrumb />
            <h2>Crear Usuario</h2>
            <form @submit.prevent="crearUsuario">
                <select v-model="institucionSeleccionada" required @change="actualizarNombreInstitucion">
                    <option disabled value="">Selecciona el código de institución</option>
                    <option v-for="institucion in instituciones" :key="institucion.id" :value="institucion.id">
                        {{ institucion.id }}
                    </option>
                </select>

                <input :value="nombreInstitucion" disabled placeholder="Nombre de la institución" />

                <input v-model="nombre" placeholder="Nombre del usuario" required />
                <input v-model="email" type="email" placeholder="Correo electrónico" required />
                <input v-model="password" type="password" placeholder="Contraseña" required />
                <input v-model="confirmPassword" type="password" placeholder="Confirmar contraseña" required />

                <p v-if="passwordError" class="error">{{ passwordError }}</p>

                <select v-model="rol" required>
                    <option disabled value="">Selecciona un rol</option>
                    <option value="admin">Administrador</option>
                    <option value="usuario">Usuario</option>
                </select>

                <button type="submit">Crear Usuario</button>
            </form>
        </div>

        <ModalFull :visible="modalVisible" :status="modalStatus" closable @close="modalVisible = false">
            <template #default>
                <h3 v-if="modalStatus === 'loading'">Creando usuario...</h3>

                <div v-else-if="modalStatus === 'success'">
                    <h3>¡Usuario creado con éxito!</h3>
                    <p>Ahora puede iniciar sesión con su correo y contraseña asignados.</p>
                </div>

                <div v-else-if="modalStatus === 'error'">
                    <h3>Error al crear usuario</h3>
                    <p>Por favor intenta nuevamente.</p>
                </div>
            </template>
        </ModalFull>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Breadcrumb from '../../components/Breadcrumb.vue'
import ModalFull from '../../components/ModalFull.vue'

const instituciones = ref([])
const institucionSeleccionada = ref('')
const nombreInstitucion = ref('')
const nombre = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const rol = ref('')
const passwordError = ref('')

const modalVisible = ref(false)
const modalStatus = ref("loading")

const obtenerInstituciones = async () => {
    try {
        const res = await fetch("https://obtenerinstituciones-34rbmbolyq-uc.a.run.app")
        const data = await res.json()
        instituciones.value = data.instituciones
    } catch (error) {
        console.error("Error al obtener instituciones", error)
    }
}

const actualizarNombreInstitucion = () => {
    const encontrada = instituciones.value.find(inst => inst.id === institucionSeleccionada.value)
    nombreInstitucion.value = encontrada ? encontrada.nombre : ''
}

const crearUsuario = async () => {
    passwordError.value = ''

    if (password.value !== confirmPassword.value) {
        passwordError.value = 'Las contraseñas no coinciden'
        return
    }

    modalVisible.value = true
    modalStatus.value = 'loading'

    try {
        const res = await fetch("https://crearusuario-34rbmbolyq-uc.a.run.app", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nombre.value,
                email: email.value,
                password: password.value,
                rol: rol.value,
                institucion_id: institucionSeleccionada.value
            })
        })

        if (!res.ok) throw new Error('Error al crear usuario')

        modalStatus.value = 'success'
        limpiarFormulario()
    } catch (error) {
        console.error(error)
        modalStatus.value = 'error'
    }
}

const limpiarFormulario = () => {
    institucionSeleccionada.value = ''
    nombreInstitucion.value = ''
    nombre.value = ''
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
    rol.value = ''
}

onMounted(obtenerInstituciones)
</script>

<style scoped>
.wrapper {
    width: 100%;
    height: 90%;
}

.crear-usuario {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 500px;
    padding: 24px;
    overflow: hidden;
}

.crear-usuario form {
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

.error {
    color: #e74c3c;
    font-size: 14px;
    font-weight: 500;
    margin-top: -6px;
    margin-bottom: 8px;
}
</style>
