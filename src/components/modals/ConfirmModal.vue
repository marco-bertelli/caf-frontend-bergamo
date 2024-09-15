<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" style="padding: 0">
    <q-card class="confirm-cart br-md q-pa-md">
      <div class="row items-center justify-between full-width q-ma-none q-pa-none">
        <span class="text-bold text-lg">{{title}}</span>
        <q-btn flat round dense icon="close" v-close-popup @click="onDialogHide"/>
      </div>
      <div class="content q-mt-lg">
        <div class="q-ma-none text-md-lg text-light-bold">
          {{ text }}
        </div>
      </div>
      <div class="row justify-between items-center q-mt-md">
        <div>
          <q-btn :label="$t('common.cancel')" v-close-popup flat color="primary"/>
        </div>
        <div>
          <q-btn :label="$t('common.confirm')" @click="confirm" :loading="loading" flat style="text-decoration: underline"/>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>

import { useDialogPluginComponent } from 'quasar'

export default {
  name: 'ConfirmModal',
  props: {
    title: String,
    text: String,
    onConfirm: Function,
    onSuccess: Function,
    onFailed: Function
  },
  emits: [
    ...useDialogPluginComponent.emits
  ],
  setup () {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
    return { dialogRef, onDialogHide, onOKClick () { onDialogOK() }, onCancelClick: onDialogCancel }
  },
  data () {
    return {
      loading: false,
      loadingCancel: false
    }
  },
  methods: {
    async confirm () {
      try {
        this.loading = true
        await this.onConfirm()
        this.onSuccess && this.onSuccess()
        this.loading = false
        this.onOKClick()
      } catch (e) {
        this.onFailed(e)
        console.debug({ e })
        this.hide()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex: 1;
  // padding-inline: 2rem;
  justify-content: center;
  flex-direction: column;
}
.toolbar {
  height: 4rem;
}
.btn-cart {
  height: 3.5rem;
}
.confirm-modal {
  height: auto;
  width: 30rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 10rem;
}
</style>
