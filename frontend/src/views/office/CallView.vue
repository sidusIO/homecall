<script setup lang="ts">
// There doesn't seem to be any TS support for Jitsi Meet.
import { officeClient } from '@/clients';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth0 } from '@auth0/auth0-vue';

const { getAccessTokenSilently } = useAuth0();
const router = useRouter()
const deviceId = useRoute().params.deviceId as string

onMounted(async () => {
  document.querySelector('body')?.classList.add('remove-feedback')

  const token = await getAccessTokenSilently();
  const auth = {
    headers: {
      Authorization: 'Bearer ' + token
    }
  }

  const res = await officeClient.startCall({
    deviceId: deviceId
  }, auth)

  //@ts-ignore - Jitsi is not typed.
  const api = new JitsiMeetExternalAPI('8x8.vc', {
    roomName: res.jitsiRoomId,
    jwt: res.jitsiJwt,
    parentNode: document.querySelector('#meeting'),
    height: '100%',
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
    router.push('/dashboard')
  })
});
</script>

<template>
  <div class="meeting-container">
    <div id="meeting"></div>
  </div>
</template>

<style lang="scss">
// Hide the feedback button.
.remove-feedback {
  #sentry-feedback {
    display: none;
  }
}
</style>

<style lang="scss" scoped>
#meeting {
  height: 100vh;
  width: 100%;
  overflow: hidden;
}
</style>
