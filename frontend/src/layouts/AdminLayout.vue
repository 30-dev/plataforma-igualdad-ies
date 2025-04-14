<template>
    <div class="admin-layout">
        <header class="admin-header">
            <div class="container">
                <strong>Administrador</strong>
                <div class="user-info" v-if="userEmail">

                    <button @click="logout" class="logout-button">Cerrar sesión</button>
                </div>
            </div>
        </header>

        <main class="admin-main">
            <div class="admin-wrapper">

                <router-view />
                <div class="container-sesion">
                    <span>Sesión iniciada como: <b>{{ userEmail }}</b></span>
                </div>

            </div>
        </main>
    </div>
</template>

<script setup>
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, onMounted } from "vue";
import { auth } from "../firebase.js";
import { useRouter } from "vue-router";

const userEmail = ref("");
const router = useRouter();

onMounted(() => {
    onAuthStateChanged(auth, (user) => {
        userEmail.value = user?.email || "";
    });
});

const logout = async () => {
    try {
        await signOut(auth);
        localStorage.removeItem("auth-token");
        router.push("/admin/ingresar");
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        alert("Ocurrió un error al cerrar sesión.");
    }
};
</script>

<style scoped>
.admin-layout {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
    justify-items: center;
    align-content: center;
    flex-direction: column;
    background-color: white;
    text-align: left;
    z-index: 9999;
}

.admin-header {
    background-color: #fff;
    color: #205867;
    border-bottom: 1px solid #205867;
    padding: 12px 24px;
    font-family: var(--font-title);
    display: flex;
    align-items: center;
    flex-shrink: 0;
}

.container {
    width: 100%;
    /* max-width: 1280px; */
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 16px;
}

.logout-button {
    padding: 6px 12px;
    border: 1px solid #d2d2d2;
    background-color: transparent;
    color: #205867;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.logout-button:hover {
    background-color: #205867;
    color: white;
}

.admin-main {
    flex-grow: 1;
    overflow-y: auto;
    padding: 32px;
}

.admin-wrapper {
    padding: 8px;
    height: 100%;
    overflow-y: scroll;
}

.container-sesion {
    display: flex;
    justify-content: end;
    margin: auto 32px 0 0;

}
</style>
