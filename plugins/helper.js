export function test(mes) {
  console.log(mes)
}

export async function objectSort(objects, key) {
  objects.sort(function(a, b) {
    if (a[key] > b[key]) {
      return 1;
    } else {
      return -1;
    }
  })
  return objects
}
