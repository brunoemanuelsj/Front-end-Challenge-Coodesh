<template>
    <v-card v-if="user === undefined || user === null">
        <v-card-title class="text-h5 grey lighten-2"> Usuário não encontrado! </v-card-title>

        <v-card-text> Usuário solicitado não está na lista de pacientes. Tente carregar mais registros.</v-card-text>
    </v-card>

    <v-card class="user" v-else>
        <div class="user__imageContainer">
            <img :src="user.picture.large" alt="user image" class="user__image" />
        </div>

        <h1 class="user__name">{{ this.user.name }}</h1>

        <ul class="user_info">
            <li>
                <div class="title">Email</div>
                <div class="item">{{ this.user.email }}</div>
            </li>
            <li>
                <div class="title">Gênero</div>
                <div class="item">{{ this.user.gender }}</div>
            </li>
            <li>
                <div class="title">Data de nascimento</div>
                <div class="item">{{ this.user.birth }}</div>
            </li>
            <li>
                <div class="title">Telefone</div>
                <div class="item">{{ this.user.phone }}</div>
            </li>
            <li>
                <div class="title">Nacionalidade</div>
                <div class="item">{{ this.user.nat }}</div>
            </li>
            <li>
                <div class="title">Endereço</div>
                <div class="item">{{ this.user.location.city + ", " + this.user.location.country }}</div>
            </li>
            <li>
                <div class="title">ID</div>
                <div class="item">{{ this.user.login.username }}</div>
            </li>
            <li>
                <div class="title">URL</div>
                <div class="item">{{ this.url }}</div>
            </li>
        </ul>
    </v-card>
</template>

<script>
    export default {
        props: {
            user: Object,
            url: String,
        },

        mounted() {},
    };
</script>

<style scoped>
    .user__imageContainer {
        padding: 40px 0 20px 0;
        width: 100%;
        display: flex;
        justify-content: center;
    }
    .user__image {
        border-radius: 50%;
    }

    .user__name {
        text-align: center;
        width: 100%;
        font-size: 2rem;

        margin-bottom: 40px;
    }

    .user_info {
        list-style: none;
        padding: 0px;
    }

    .user_info li {
        padding: 4px 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .user_info li:nth-child(odd) {
        background: rgb(246, 246, 246);
    }

    .item {
        margin-left: 40px;
    }
</style>
