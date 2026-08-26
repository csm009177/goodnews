/**
 * 환경 변수 유틸리티
 */

export function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

export function getOptionalEnvVar(key: string): string | undefined {
  return process.env[key];
}
