import React, {
    createContext,
    useContext,
  } from "react";
  import { QueryClient, QueryClientProvider } from "react-query";
  import { IdentityFYIClient } from "@idfyi/client";
  
  export interface IdentityAPIContext {
    url: string;
    client: IdentityFYIClient;
  }
  
  const identityContext = createContext<IdentityAPIContext>({
    url: "https://identities.fyi/",
    client: new IdentityFYIClient(),
  });
  
  const queryClient = new QueryClient();
  
  export const IdentityAPIProvider: React.FC<{
    url?: string,
  }> = ({
    url: providedUrl,
    children,
  }) => {
    const url = providedUrl ?? "https://identities.fyi/";
    const val: IdentityAPIContext = {
      url,
      client: new IdentityFYIClient({
        url,
      }),
    };
    return (
      <QueryClientProvider client={queryClient}>
        <identityContext.Provider value={val}>
          {children}
        </identityContext.Provider>
      </QueryClientProvider>
    );
  };
  
  export function useIdentityAPIContext(): IdentityAPIContext {
    return useContext(identityContext);
  }
  