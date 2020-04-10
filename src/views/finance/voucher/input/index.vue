<template>
  <div class="app-container">
    <edit-table></edit-table>
  </div>
</template>

<script>
import EditTable from "@/components/EditTable";
export default {
  name: "voucher-input",
  components: {
    EditTable
  },
  data() {
    return {};
  },
  created(){
    console.log(12312)
  },
  methods: {}
};
</script>