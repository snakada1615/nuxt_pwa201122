<template>
  <b-container class="py-2" style="max-width: 540px;">
    <div v-if="$nuxt.isOnline">
      <b-card-group deck>
        <b-card bg-variant="gray-100" border-variant="info" class="mt-3 px-0 mx-1" footer-tag="footer">
          <div>fetch <span class="text-danger">latest version </span>
            of application
          </div>
          <template #footer class="px-0 py-0">
            <b-button block @click="unRegister" class="mx-0 my-0" variant="info" size="sm">update app</b-button>
          </template>
        </b-card>
        <b-card bg-variant="gray-100" border-variant="info" class="mt-3 px-0 mx-1" footer-tag="footer">
          <div><span class="text-danger">remove </span>
            all user data to refresh database
          </div>
          <template #footer class="px-0 py-0">
            <b-button @click="deleteDb" class="mx-0 my-0" size="sm" block
                      variant="info" :disabled="$store.state.loginStatus !== 1"
            >delete user data
            </b-button>
          </template>
        </b-card>
        <b-card bg-variant="gray-100" border-variant="info" class="mt-3 px-0 mx-1" footer-tag="footer">
          <div><span class="text-danger">remove </span>
            registered user from application
          </div>
          <template #footer class="px-0 py-0">
            <b-button @click="deleteUser" class="mx-0 my-0" size="sm" block
                      variant="info" :disabled="$store.state.loginStatus !== 1"
            >remove user
            </b-button>
          </template>
        </b-card>
      </b-card-group>
      <b-card-group deck>
        <b-card bg-variant="gray-100" border-variant="info" class="mt-3 px-0 mx-1" footer-tag="footer">
          <div><span class="text-danger">change</span> Food Composition Table</div>
          <template #footer class="px-0 py-0">
            <b-button block to="selectFct" class="mx-0 my-0" variant="info"
                      :disabled="$store.state.loginStatus !== 1" size="sm"
            >select FCT
            </b-button>
          </template>
        </b-card>
        <b-card bg-variant="gray-100" border-variant="info" class="mt-3 px-0 mx-1" footer-tag="footer">
          <div><span class="text-danger">import</span> new Food Composition Table</div>
          <template #footer class="px-0 py-0">
            <b-button block to="importFCT" class="mx-0 my-0"
                      variant="info" size="sm" :disabled="$store.state.loginStatus !== 1"
            >import FCT
            </b-button>
          </template>
        </b-card>
        <b-card bg-variant="gray-100" border-variant="info" class="mt-3 px-0 mx-1" footer-tag="footer">
          <div><span class="text-danger">edit</span> current Food Composition Table</div>
          <template #footer class="px-0 py-0">
            <b-button block to="editFctMain" class="mx-0 my-0" variant="info"
                      size="sm" :disabled="$store.state.loginStatus !== 1"
            >edit FCT
            </b-button>
          </template>
        </b-card>
      </b-card-group>
      <b-card-group deck>
        <b-card bg-variant="gray-100" border-variant="info" class="mt-3 px-0 mx-1" footer-tag="footer">
          <div><span class="text-danger">change</span> workspace</div>
          <template #footer class="px-0 py-0">
            <b-button block to="changeWorkspace" class="mx-0 my-0" variant="info"
                      size="sm" :disabled="$store.state.loginStatus !== 1"
            >change WS
            </b-button>
          </template>
        </b-card>
        <b-card bg-variant="gray-100" border-variant="info" class="mt-3 px-0 mx-1" footer-tag="footer">
          <div><span class="text-danger">message board</span></div>
          <template #footer class="px-0 py-0">
            <b-button block to="messages" class="mx-0 my-0" variant="info"
                      size="sm" :disabled="$store.state.loginStatus !== 1"
            >send message
            </b-button>
          </template>
        </b-card>
      </b-card-group>
      <h6 v-if="$store.state.loginStatus !== 1" class="text-warning">you need to login first to use all the
        functions</h6>
    </div>
    <div v-if="!$nuxt.isOnline">this function is available when network connection is available</div>
  </b-container>
</template>

<script>
  import PouchDB from "pouchdb";
  import {pouchDeleteDoc} from "../plugins/pouchHelper";

  export default {
    methods: {
      unRegister() {
        const vm = this
        navigator.serviceWorker.getRegistrations().then(function (registrations) {
          for (let registration of registrations) {
            registration.unregister()
          }
        }).then(function () {
          vm.$store.dispatch('logout')
          //location.reload()
          vm.$router.push('/')
        }).catch(err => {
          vm.$nuxt.error(err)
        })
      },
      deleteDb() {
        const vm = this
        vm.$store.dispatch('removeUserDoc', {
          dbName: vm.$store.getters.userDb,
          docId: vm.$store.getters.currentPouchID,
          url: vm.$store.cloudantUrl
        }).then(function () {
          vm.$store.dispatch('logout')
          vm.$router.push('/')
        }).catch(function (err) {
          $nuxt.error(err)
        })
      },
      deleteUser() {
        const vm = this
        vm.$store.dispatch('removeUser').then(function () {
          vm.$store.dispatch('removeUserDoc', {
            dbName: vm.$store.getters.userDb,
            docId: vm.$store.getters.currentPouchID,
            url: vm.$store.cloudantUrl
          }).then(function () {
            vm.$store.dispatch('removeUserInfo', vm.$store.state.user.email).then(function () {
              vm.$store.dispatch('logout').then(function () {
                vm.$router.push('/')
              })
            })
          })
        }).catch(function (err) {
          console.log(err)
          throw err
        })
      },
    },
  }
</script>
