<template>
    <div class="login-wrapper">
        <div class="login-form animation-fade">
            <header>
                <h1 class="login-title">
                    Distintivo Genera Igualdad para Universidades e Instituciones de Educación Superior
                </h1>
            </header>

            <h2 class="login-description">Bienvenido a la plataforma</h2>
            <p class="login-instructions">
                Ingresa el código de usuario proporcionado por tu institución y tu contraseña para acceder a la
                plataforma.
            </p>

            <form @submit.prevent="loginUsuario" class="login-form-inner">
                <input v-model="codigo" placeholder="Código de usuario (ej. LUIS-6OPX)" required />
                <input v-model="clave" type="password" placeholder="Contraseña" required />
                <p v-if="error" class="error">{{ error }}</p>
                <button type="submit">Entrar</button>
            </form>

            <div class="login-extra">
                <h3>¿Problemas para ingresar?</h3>
                <p>
                    Si no tienes tu código o contraseña, contacta a tu institución o al soporte técnico
                    a través del correo <a href="mailto:contacto@simetriamx.org">contacto@simetriamx.org</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const codigo = ref('')
const clave = ref('')
const error = ref('')

const loginUsuario = async () => {
    error.value = ''
    try {
        // 1. Login de usuario
        const res = await axios.post("https://loginusuario-34rbmbolyq-uc.a.run.app", {
            id: codigo.value,
            password: clave.value
        })

        const usuario = res.data?.usuario
        const token = res.data?.token

        if (usuario?.id && token) {
            localStorage.setItem('uid', usuario.id)
            localStorage.setItem('token', token)
            localStorage.setItem('usuario', JSON.stringify(usuario))

            // 2. Obtener nombre de la institución desde su ID
            try {
                const resInstitucion = await axios.get(`https://obtenerinstitucion-34rbmbolyq-uc.a.run.app/?id=${usuario.institucion_id}`)
                console.log("Institución encontrada:", resInstitucion.data)

                // Verifica si viene como "nombre" o en otro nivel
                const nombreInstitucion = resInstitucion.data?.nombre || resInstitucion.data?.result?.nombre || 'Institución desconocida'
                localStorage.setItem('institucion_nombre', nombreInstitucion)
            } catch (err) {
                console.warn("No se pudo cargar el nombre de la institución", err)
                localStorage.setItem('institucion_nombre', 'Institución desconocida')
            }

            router.push('/dashboard')
        } else {
            throw new Error("Respuesta inválida")
        }
    } catch (err) {
        console.error(err)
        error.value = "Credenciales incorrectas o error de servidor"
    }
}
</script>

<style scoped>
.login-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #fff;
    padding: 0 16px;
    transform: translateY(-25px);
}

.login-form {
    max-width: 480px;
    width: 100%;
    padding: 48px 32px;
    border-radius: 8px;
    background-color: white;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    outline: 1px solid #d2d2d2;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.login-title {
    font-size: clamp(22px, 2vw, 28px);
    font-weight: 500;
    font-family: var(--font-title);
    color: #2c2c2c;
    margin-bottom: 24px;
    line-height: 1.2;
}

.login-description {
    font-size: clamp(16px, 1.2vw, 20px);
    color: #0056B3;
    font-weight: 600;
    margin-bottom: 8px;
}

.login-instructions {
    font-size: clamp(14px, 1.2vw, 18px);
    font-weight: 500;
    color: #585858;
    margin-bottom: 16px;
}

.login-form-inner {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

input {
    height: 42px;
    padding: 8px;
    font-size: 16px;
    border-radius: 4px;
    border: 1px solid #ccc;
    background-color: #fff;
    color: #2c2c2c;
}

button[type="submit"] {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 42px;
    padding: 8px;
    background-color: #0056B3;
    color: #fff;
    font-weight: 600;
    letter-spacing: 1px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
}

button[type="submit"]:hover {
    background-color: #003c82;
}

.error {
    color: #F24726;
    font-size: 14px;
    font-weight: 600;
    margin-top: 4px;
}

.login-extra {
    margin-top: auto;
    background-color: #9cd2eb80;
    padding: 16px;
    border-radius: 4px;
}

.login-extra h3 {
    font-weight: 600;
    margin-bottom: 8px;
}

.login-extra p {
    font-size: 14px;
    color: #585858;
    font-weight: 500;
    line-height: 1.3;
}

.login-extra a {
    color: #0056B3;
}

.animation-fade {
    animation: fadeIn 0.8s ease-out forwards;
    opacity: 0;
}

@keyframes fadeIn {
    0% {
        opacity: 0;
        transform: translateY(10px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

@media screen and (max-width:425px) {
    .login-wrapper {
        padding: 0;
    }

    .login-form {
        background-color: white;
        box-shadow: none;
        outline: none;
        gap: 8px;
        text-align: left;
    }
}
</style>
