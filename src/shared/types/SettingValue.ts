export type SettingValue = string | number | boolean;

export interface SettingsMap {
  [settingId: string]: SettingValue;
}
