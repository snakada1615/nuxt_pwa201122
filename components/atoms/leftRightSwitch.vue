<template>
  <b-row>
    <b-col class="d-flex align-items-end flex-column px-1">Per meal</b-col>
    <b-col class="d-flex align-items-start flex-column px-1">
      <b-form-checkbox switch id="check01">Per day</b-form-checkbox>
    </b-col>
  </b-row>
</template>

<style>
  .custom-control-label:before{
    background-color:red;
  }
  .custom-checkbox .custom-control-input:checked~.custom-control-label::before{
    background-color:black;
  }
</style>
