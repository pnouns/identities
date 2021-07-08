import { useQuery } from "react-query";
import { IdentityListName } from "@idfyi/client";
import { CompiledIdentityList } from "@idfyi/dto";
import { useIdentityAPIContext } from "./context";
import { QueryResult } from "./util/QueryResult";

export function useIdentityList(
  list: IdentityListName = "all",
): QueryResult<CompiledIdentityList> {
  const { client } = useIdentityAPIContext();
  const { isLoading, error, data } = useQuery<CompiledIdentityList, Error>(
    ["identityList", list],
    () => client.getIdentityList(list),
  );
  return { isLoading, error, data };
}
