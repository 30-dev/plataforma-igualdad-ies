<template>
    <div class="login-wrapper">
        <div class="login-container animation-fade">
            <h1 class="login-title">
                Distintivo Genera Igualdad para Universidades e Instituciones de Educación Superior
            </h1>
            <h2 class="login-description">Bienvenido, ingresa tus credenciales.</h2>
            <form @submit.prevent="loginAdmin" class="login-form">
                <input v-model="email" type="email" placeholder="Correo electrónico" class="input-field" />
                <input v-model="password" type="password" placeholder="Contraseña" class="input-field" />
                <button type="submit" class="login-button">
                    Continuar
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px">
                        <g fill="none">
                            <path d="M24 0v24H0V0z" />
                            <path fill="currentColor"
                                d="m14.707 5.636l5.657 5.657a1 1 0 0 1 0 1.414l-5.657 5.657a1 1 0 0 1-1.414-1.414l3.95-3.95H4a1 1 0 1 1 0-2h13.243l-3.95-3.95a1 1 0 1 1 1.414-1.414" />
                        </g>
                    </svg>
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"
import { auth } from "../../firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "vue-router"

const email = ref("")
const password = ref("")
const router = useRouter()

const loginAdmin = async () => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
        const token = await userCredential.user.getIdToken()

        // 🔐 Guardar en localStorage lo que el router necesita
        localStorage.setItem("auth-token", token)
        localStorage.setItem("uid", userCredential.user.uid)
        localStorage.setItem("admin", "true")

        router.push("/admin/dashboard")
    } catch (error) {
        console.error("Error al iniciar sesión:", error)
        alert("Error al iniciar sesión. Revisa tus credenciales.")
    }
}
</script>

<style scoped>
.login-wrapper {
    display: flex;
    justify-content: center;
    align-items: top;
    height: auto;
    background-color: #fff;
    padding: 0 24px;
    border-radius: 8px;
    outline: 1px solid #d1d1d1;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
        rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}

.login-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    max-width: 420px;
    padding: 32px;
}

.login-title {
    font-family: var(--font-title);
    font-size: 24px;
    color: var(--primary-color);
    text-align: left;
    margin-bottom: 8px;
}

.login-description {
    font-size: 16px;
    text-align: left;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.input-field {
    height: 48px;
    padding: 0 16px;
    font-size: 16px;
    border: 1px solid #d1d1d1;
    border-radius: 4px;
    transition: border-color 0.2s ease-in;
}

.input-field:focus {
    outline: none;
    border-color: var(--primary-color);
}

.login-button {
    display: flex;
    gap: 16px;
    justify-content: center;
    align-items: center;
    height: 48px;
    padding: 0 24px;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    background-color: var(--primary-color);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease-in;
}

.login-button:hover {
    background-color: #205867;
}

.animation-fade {
    opacity: 0;
    animation: fadeInUp 0.8s ease-out forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (min-width: 720px) {
    .login-container {
        padding: 48px;
    }

    .login-title {
        font-size: 28px;
    }

    .login-wrapper {
        outline: none;
    }
}

@media (max-width: 471px) {
    .login-container {
        padding: 12px;
    }

    .login-title {
        font-size: 20px;
        line-height: 26px;
    }

    .login-wrapper {
        outline: none;
        box-shadow: none;
    }
}
</style>
