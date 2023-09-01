<script lang="ts">
import { DataTableColumns, NDataTable, NButton } from "naive-ui";
import { h, defineComponent } from "vue";
import axios from "axios";

type ProjectDetails = {
  community: string;
  district: string;
  details: string;
  status: number;
};

const projectStatus = [
  { id: 1, name: "ยื่นข้อเสนอโครงการ" },
  { id: 2, name: "กำลังพิจารณา" },
  { id: 3, name: "ปรับปรุงเอกสารเสนอโครงการ" },
  { id: 4, name: "ดำเนินการโครงการ" },
  { id: 5, name: "ระงับการดำเนินการโครงการ" },
  { id: 6, name: "ดำเนินการโครงการเสร็จสิ้น" },
];

export default {
  async setup() {
    const runtimeConfig = useRuntimeConfig();
    
    const createColumns = (): DataTableColumns<ProjectDetails> => {
      return [
        {
          title: "ชุมชน",
          key: "community",
          width: 150,
        },
        {
          title: "เขต",
          key: "district",
          width: 150,
        },
        {
          title: "รายละเอียด",
          key: "details",
          render(row) {
            let limit = 200;
            return row.details.length >= 200
              ? row.details.substring(0, limit - 3) + "..."
              : row.details;
          },
        },
        {
          title: "สถานะ",
          key: "status",
          width: 250,
          render(row) {
            return h(
              NButton,
              {
                strong: true,
                tertiary: true,
                type: "info",
                size: "small",
              },
              {
                default: () => {
                  const currentStatus = projectStatus.find(
                    (status) => row.status == status.id
                  );

                  return currentStatus?.name;
                },
              }
            );
          },
        },
      ];
    };

    async function getImage(filename: string): Promise<string> {
      try {
        const imageURL = `${runtimeConfig.public.baseApiUrl}api/images/${filename}`;

        const response = await axios.get<Blob>(imageURL, {
          headers: {
            Authorization: "Bearer " + runtimeConfig.tokenApi,
          },
          responseType: "blob",
        });

        const image = URL.createObjectURL(response.data);
        return image;
      } catch (error) {
        throw error;
      }
    }

    const columns = createColumns();
    const projects: Array<ProjectDetails> = await axios
      .get(`${runtimeConfig.public.baseApiUrl}api/project/`)
      .then((response) => {
        return response.data.data.map((project: any) => {
          return {
            community: project.communityname,
            district: project.districtname,
            details: project.description,
            status: project.status_id,
          };
        });
      });
    return {
      columns,
      projects,
      pagination: {
        pageSize: 10,
      },
    };
  },
  components: {
    NDataTable,
    NButton,
  },
};
</script>

<template>
  <Head>
    <Title>ชุมชนโปร่งใส - สมัครสมาชิก</Title>
  </Head>
  <NavBar />
  <div class="container">
    <n-data-table
      :columns="columns"
      :data="projects"
      :pagination="pagination"
      :max-height="500"
    />
  </div>
</template>
