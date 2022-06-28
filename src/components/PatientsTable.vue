<template>
    <div v-if="loading" class="loading">
        <base-loading></base-loading>
    </div>
    <div v-else class="table_container">
        <div class="table_container__search">
            <div class="search__item">
                <v-text-field v-model="globalFilter" prepend-icon="mdi-magnify" label="Digite para buscar..." solo color="#ffc297" clearable></v-text-field>
            </div>
            <div class="search__item">
                <div class="item__sub">
                    <v-autocomplete prepend-icon="mdi-clipboard-text-search" color="#ffc297" v-model="selectedName" :items="names" dense chips small-chips label="Nome" multiple solo clearable></v-autocomplete>
                </div>

                <div class="item__sub">
                    <v-autocomplete prepend-icon="mdi-earth" color="#ffc297" v-model="selectedNacionalidade" :items="nacionalidades" dense chips small-chips label="Nacionalidade" multiple solo clearable></v-autocomplete>
                </div>
                <div class="item__sub">
                    <v-autocomplete prepend-icon="mdi-account  " color="#ffc297" v-model="selectedGender" :items="genders" dense chips small-chips label="Gender" multiple solo clearable></v-autocomplete>
                </div>
            </div>
        </div>
        <v-data-table class="table_container__table elevation-1" :headers="headers" :items="patients" item-key="name" :items-per-page="5">
            <template v-slot:[`item.actions`]="{ item }">
                <td class="table__action">
                    <a class="porto-button"><v-icon @click="openUser(item)">mdi-eye</v-icon></a>
                </td>
            </template>
        </v-data-table>

        <v-btn :loading="loading" color="#ffc297" @click="loadMore">
            Load more
            <v-icon right dark> mdi-reload </v-icon>
        </v-btn>

        <v-dialog v-model="userDialog" width="500">
            <detailed-user :user="selectedUser" :url="actualUrl"></detailed-user>
        </v-dialog>
    </div>
</template>

<script>
    import BaseLoading from "./BaseLoading.vue";
    import DetailedUser from "./DetailedUser.vue";

    export default {
        components: {
            BaseLoading,
            DetailedUser,
        },
        data() {
            return {
                loading: false,
                globalFilter: null,

                selectedName: [],
                selectedNacionalidade: [],
                selectedGender: [],

                pageController: 1,

                headers: [
                    { text: "Name", align: "start", value: "name", width: "30%" },
                    { text: "Gender", value: "gender", width: "30%" },
                    { text: "Birth", value: "birth", width: "30%" },
                    { text: "Actions", value: "actions", align: "center" },
                ],

                userDialog: false,

                selectedUser: null,
                userParameter: null,

                actualUrl: null,
            };
        },
        watch: {
            userDialog() {
                if (this.userDialog === false) {
                    this.clearURL();
                }
            },
        },
        computed: {
            patients() {
                return this.$store.getters.allPatients.filter((e) => {
                    let name_or_birth_in_global_filter = this.globalFilter === null ? true : e.name.toLowerCase().includes(this.globalFilter.toLowerCase()) || e.birth.toLowerCase().includes(this.globalFilter.toLowerCase());
                    let name_in_selected_names = this.selectedName.length > 0 ? this.selectedName.includes(e.name) : true;
                    let nacionalidade_in_selected_nacionalidade = this.selectedNacionalidade.length > 0 ? this.selectedNacionalidade.includes(e.nat) : true;
                    let gender_in_selected_gender = this.selectedGender.length > 0 ? this.selectedGender.includes(e.gender) : true;

                    return name_or_birth_in_global_filter && name_in_selected_names && nacionalidade_in_selected_nacionalidade && gender_in_selected_gender;
                });
            },

            names() {
                return this.$store.getters.allPatients.map((e) => e.name);
            },

            nacionalidades() {
                return this.$store.getters.allPatients.map((e) => e.nat);
            },

            genders() {
                return this.$store.getters.allPatients.map((e) => e.gender);
            },
        },

        mounted() {
            this.getPatients(this.pageController);

            let url_string = window.location.href;
            let url = new URL(url_string);
            this.actualUrl = url_string;
            this.userParameter = url.searchParams.get("user");
        },

        methods: {
            getPatients(pag) {
                this.loading = true;
                this.$axios
                    .get(`https://randomuser.me/api/?page=${pag}&results=50&seed=abc`)
                    .then((res) => {
                        let temp = res.data.results;

                        temp.forEach((e) => {
                            e.name = e.name.first + " " + e.name.last;

                            e.birth = new Date(e.dob.date).toLocaleDateString();
                        });

                        console.log(temp);

                        this.savePatients(temp);

                        if (this.userParameter !== null) {
                            this.loadUser(this.userParameter);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },

            savePatients(data) {
                this.$store.commit("savePatients", data);

                this.loading = false;
            },

            loadMore() {
                this.pageController++;
                this.getPatients(this.pageController);
            },

            openUser(user) {
                window.history.pushState({}, "Pharma Inc", window.location.origin + "?user=" + user.login.username);

                let url_string = window.location.href;
                let url = new URL(url_string);

                this.actualUrl = url_string;

                this.userParameter = url.searchParams.get("user");

                if (this.userParameter !== null) {
                    this.loadUser(this.userParameter);
                }
            },

            loadUser(user) {
                this.selectedUser = this.patients.find((e) => e.login.username === user);

                console.log("this.selectedUser");
                console.log(this.selectedUser);

                this.userDialog = true;
            },

            clearURL() {
                this.userParameter = null;
                window.history.pushState({}, "Pharma Inc", window.location.origin);
            },
        },
    };
</script>

<style scoped>
    .table_container {
        width: 100%;
        margin-top: 80px;
        padding: 50px;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .table_container__search {
        margin-bottom: 30px;
        width: 100%;
        flex-wrap: wrap;
        display: flex;

        flex-direction: column;
        align-items: center;
    }

    .search__item {
        width: 700px;
        display: flex;
    }

    .item__sub {
        margin: 0 10px;
    }

    .loading {
        margin-top: 300px;
        width: 100%;
    }

    .table_container__table {
        width: 100%;
        margin-bottom: 30px;
    }

    .table__action {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
