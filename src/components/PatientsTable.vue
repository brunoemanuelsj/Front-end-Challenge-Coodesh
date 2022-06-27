<template>
    <div v-if="loading" class="loading">
        <base-loading></base-loading>
    </div>
    <div v-else class="table_container">
        <div class="table_container__search">
            <div class="search__item">
                <v-text-field v-model="globalFilter" prepend-icon="mdi-magnify" label="Digite para buscar..." solo color="#ffc297"></v-text-field>
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
        <v-data-table class="table_container__table elevation-1" :headers="headers" :items="patients" item-key="name" :items-per-page="5"></v-data-table>

        <v-btn :loading="loading" color="#ffc297" @click="loadMore">
            Load more
            <v-icon right dark> mdi-reload </v-icon>
        </v-btn>
    </div>
</template>

<script>
    import BaseLoading from "./BaseLoading.vue";

    export default {
        components: {
            BaseLoading,
        },
        data() {
            return {
                loading: false,
                globalFilter: "",

                selectedName: [],
                selectedNacionalidade: [],
                selectedGender: [],

                pageController: 1,

                headers: [
                    {
                        text: "Name",
                        align: "start",
                        sortable: true,
                        value: "name",
                    },
                    { text: "Gender", value: "gender" },
                    { text: "Birth", value: "birth" },
                    { text: "Actions", value: "" },
                ],
            };
        },
        computed: {
            patients() {
                return this.$store.getters.allPatients.filter((e) => {
                    let nameOrBirthInGlobalFilter = e.name.toLowerCase().includes(this.globalFilter.toLowerCase()) || e.birth.toLowerCase().includes(this.globalFilter.toLowerCase());
                    let nameInSelectedNames = this.selectedName.length > 0 ? this.selectedName.includes(e.name) : true;
                    let nacionalidadeInSelectedNacionalidade = this.selectedNacionalidade.length > 0 ? this.selectedNacionalidade.includes(e.nat) : true;
                    let genderInSelectedGender = this.selectedGender.length > 0 ? this.selectedGender.includes(e.gender) : true;
                    return nameOrBirthInGlobalFilter && nameInSelectedNames && nacionalidadeInSelectedNacionalidade && genderInSelectedGender;
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
</style>
