<script setup lang="ts">
// There doesn't seem to be any TS support for Jitsi Meet.
import { officeClient } from '@/clients';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()
const deviceId = useRoute().params.deviceId as string

onMounted(async () => {
  const res = await officeClient.startCall({
    deviceId: deviceId
  })

  //@ts-ignore - Jitsi is not typed.
  const api = new JitsiMeetExternalAPI('8x8.vc', {
    roomName: res.jitsiRoomId,
    jwt: res.jitsiJwt,
    parentNode: document.querySelector('#meeting'),
    height: '100vh',
    configOverwrite: {
      prejoinConfig: {
        enabled: false
      },
      toolbarButtons: [ 'hangup', 'microphone', 'camera' ],
      toolbarConfig: {
        alwaysVisible: true,
      },
      hideConferenceSubject: true,
      hideConferenceTimer: true,
      filmstrip: {
        disableResizable: true,
      }
    },
    interfaceConfigOverwrite: {
      MOBILE_APP_PROMO: false,
    }
  });

  // If meeting is closed
  api.addEventListener('readyToClose', () => {
    router.push('/')
  })
});
</script>

<template>
  <div>
    <div id="meeting"></div>
  </div>
</template>

<style scoped>
#meeting {
  width: 100%;
  height: 100%;
}
</style>
