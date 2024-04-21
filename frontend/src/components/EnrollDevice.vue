<script setup lang="ts">
import { officeClient } from '@/clients';
import QrcodeVue from 'qrcode.vue'
import { onDeactivated, onMounted, onUnmounted } from 'vue';

interface Enrollment {
  enrollmentKey: string;
  deviceId: string;
}

const props = defineProps<{
    enrollment: Enrollment;
}>()

// Define emit enrolled
const emit = defineEmits({
    enrolled(deviceId: string) {
        return deviceId
    },
    close() {
        return true
    }
})

const abort = new AbortController();

const waitForEnrollment = async (): Promise<string> => {
    const devices = officeClient.waitForEnrollment({
        deviceId: props.enrollment.deviceId
    }, { signal: abort.signal })

    for await (const res of devices) {
        abort.abort()
        return res.device?.id || ''
    }

    return waitForEnrollment()
}

onMounted(async () => {
    const deviceId = await waitForEnrollment()
    emit('enrolled', deviceId)
})

onUnmounted(() => {
    abort.abort()
})
</script>

<template>
    <div class="qrcode-container">
        <p class="qrcode-container__desc">
            Skanna QR-koden med enheten.
        </p>

        <qrcode-vue
            :value="enrollment.enrollmentKey"
            :size="300"
            level="H"
        />

        <button @click="emit('close')">
            Avbryt
        </button>
    </div>
</template>

<style lang="scss" scoped>
.qrcode-container {
    display: flex;
    flex-direction: column;
    align-items: center;

    &__desc {
        margin-bottom: 2rem;
        text-align: center;
    }
}
</style>