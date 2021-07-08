import { useQuery } from "react-query";
import { CompiledIdentityIndexFile } from "@idfyi/dto";
import { useIdentityAPIContext } from "./context";
import { QueryResult } from "./util/QueryResult";

export function useIdentity(
  identity: string,
): QueryResult<CompiledIdentityIndexFile> {
  const { client } = useIdentityAPIContext();
  const { isLoading, error, data } = useQuery<CompiledIdentityIndexFile, Error>(
    ["identity", identity],
    () => client.getIdentity(identity),
  );
  return { isLoading, error, data };
}
