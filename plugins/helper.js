
export function makeToast(mes) {
  const id = String(Math.floor(100 * Math.random()))
  this.$bvToast.toast(mes, {
    autoHideDelay: 5000,
    variant: "info",
    noCloseButton: true,
    id: id,
  })
  return id
}
