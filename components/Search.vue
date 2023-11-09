<template>
    <form class="search row w-flex x-center y-center padding8 relative" @submit="search(searchInput)">
        <input type="text" v-model="searchInput" class="snetInput input" :placeholder="'Search ' + searchType">
        <button type="submit" class="icon"><img src="../assets/images/app/search.png"></button>
    </form>
</template>
<script>
    export default {
        name:'search',
        props: {
            search: Function,
            searchType: String
        },
        data() {
            return {
                searchInput: ''
            }
        }
    }
</script>
<style lang="scss" scoped>
    .search {
        .input {
            width: 100%;
        }
        .icon {
            position: absolute;
            cursor: pointer;
            background: none;
            border: 0;
            right: 15px;

            img {
                height: 15px;
            }
        }
    }
</style>


