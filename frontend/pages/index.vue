<script setup lang="ts">
import { NConfigProvider, GlobalThemeOverrides } from "naive-ui";

// const runtimeConfig = useRuntimeConfig();

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: "#ef4d4e",
  },
};
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div>
      <Head>
        <Title>ชุมชนโปร่งใส - หน้าหลัก</Title>
      </Head>
      <NavBar />
      <ProjectList />
      <Footer />
    </div>
  </n-config-provider>
</template>
