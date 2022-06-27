<template>
    <v-app>
        <div class="main">
            <header class="main__header">
                <img class="main__logo" src="./assets/images/logo.png" alt="logo_pharma_inc" />
                <menu class="main__menu">
                    <v-icon>mdi-menu</v-icon>
                </menu>
            </header>

            <v-main class="main_content">
                <PatientsTable />
            </v-main>
        </div>
    </v-app>
</template>

<script>
    import PatientsTable from "./components/PatientsTable";

    export default {
        name: "App",

        components: {
            PatientsTable,
        },

        data: () => ({
            //
        }),
    };
</script>

<style scoped>
    .main {
        height: 100vh;
        width: 100%;
        display: grid;
        grid-template-areas:
            "m-header"
            "m-content";

        grid-template-rows: 100px 1fr;
    }

    .main__header {
        grid-area: m-header;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #fff4ec;
        box-shadow: rgba(0, 0, 0, 0.024) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 1px 0px 0px, rgba(0, 0, 0, 0.03) 0px 0px 8px 0px, rgba(0, 0, 0, 0.1) 0px 20px 30px 0px;
    }

    .main_content {
        grid-area: m-content;
    }

    .main__logo {
        width: 170px;
    }

    .main__menu {
        padding: 50px;
        cursor: pointer;
    }
</style>
