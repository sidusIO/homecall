// @generated by protoc-gen-es v1.8.0
// @generated from file homecall/v1alpha/settings.proto (package homecall.v1alpha, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { proto3 } from "@bufbuild/protobuf";

/**
 * DeviceSettings is a message that contains the settings for a device.
 *
 * @generated from message homecall.v1alpha.DeviceSettings
 */
export const DeviceSettings = /*@__PURE__*/ proto3.makeMessageType(
  "homecall.v1alpha.DeviceSettings",
  () => [
    { no: 1, name: "auto_answer", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 2, name: "auto_answer_delay_seconds", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
  ],
);