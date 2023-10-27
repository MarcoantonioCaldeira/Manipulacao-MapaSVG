<template>
  <div id="footer" ref="footer">
    <h4>© TI-Gestor Software LTDA 2023</h4>
  </div>
</template>

<script>
export default {
  name: 'FooterComponent'
};
</script>

<style scoped>
#footer {
  width: 100%;
  height: 300px;
  background-color: #2980b9;
}

h4 {
  flex-direction: column;
  font-family: Arial, Helvetica, sans-serif;
  margin: auto;
  padding-top: 250px;
  font-weight: 800;
  color: #CECCCC;
  text-align: center;
  justify-content: center;
  align-items: center;
}
</style>
