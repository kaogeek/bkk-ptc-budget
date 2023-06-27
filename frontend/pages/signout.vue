<template>
    <div>
        <NavBar/>
    </div>
</template>
<script>
export default {
  mounted() {
    if (process.client) {
      window.sessionStorage.clear();
      this.$router.push('/')
    }
  },
};
</script>