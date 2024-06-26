import * as SecureStore from 'expo-secure-store';
import { clearCredentials, setupCredentials}  from "./auth";
import { deviceClient } from './api';

interface EnrollmentData {
  deviceId: string;
  enrollmentKey: string;
  instanceUrl: string;
  audience: string;
}

interface DeviceSettings {
  autoAnswer: boolean;
  autoAnswerDelaySeconds: bigint;
}

/**
 * Checks if the given data is an EnrollmentData object.
 *
 * @param data - The data to check
 * @returns True if the data is an EnrollmentData object, false otherwise
 */
function isEnrollmentData(data: any): data is EnrollmentData {
  return (
    typeof data === 'object' &&
    typeof data.deviceId === 'string' &&
    typeof data.enrollmentKey === 'string' &&
    typeof data.instanceUrl === 'string' &&
    typeof data.audience === 'string'
  );
}

/**
 * Enrolls the device with the given data.
 *
 * @param data - The enrollment data
 * @returns True if the device was enrolled, false otherwise
 */
async function enroll(data: EnrollmentData): Promise<boolean> {
  const publicKey = await setupCredentials(data.deviceId, data.instanceUrl, data.audience);

  try {
    // Enroll the device.
    const res = await deviceClient(data.instanceUrl).enroll({
      publicKey: publicKey,
      enrollmentKey: data.enrollmentKey,
    });

    if(!res.settings) {
      return false;
    }

    // Store the device settings in localStorage
    await storeSettings(res.settings);

    return true;
  } catch (e) {
    await clearCredentials();
    return false;
  }
  return true;
}

/**
 * Stores the device settings.
 *
 * @param settings - The device settings to store
 */
async function storeSettings(settings: DeviceSettings) {
  await SecureStore.setItemAsync('io.sidus.homecall.deviceSettings', JSON.stringify(settings));
}

/**
 * Gets the device settings.
 *
 * @returns The device settings or false if the settings are not found
 */
async function getSettings(): Promise<DeviceSettings | boolean> {
  const settings = await SecureStore.getItemAsync('io.sidus.homecall.deviceSettings');

  if(!settings) {
    return false;
  }

  return JSON.parse(settings);
}

export {
  enroll,
  EnrollmentData,
  isEnrollmentData,
  getSettings
}
