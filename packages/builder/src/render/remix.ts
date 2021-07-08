import { CompiledRemix, Remix } from "@idfyi/dto";

export function renderRemix(remix: Remix): CompiledRemix {
  return {
    license: remix.license,
    page: {
      type: remix.page.type,
      name: remix.page.name,
      url: remix.page.url,
    },
  };
}
