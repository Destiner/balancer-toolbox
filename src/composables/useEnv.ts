interface EnvironmentVariables {
  providerKey: string;
}

function useEnv(): EnvironmentVariables {
  const env = (import.meta as ImportMeta).env;
  return {
    providerKey: env.VITE_PROVIDER_KEY || '',
  };
}

export default useEnv;
