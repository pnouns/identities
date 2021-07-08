import "reflect-metadata";
import fetch from "cross-fetch";
import { ClassType, transformAndValidate } from "class-transformer-validator";
import {
  CompiledIdentityIndexFile,
  CompiledIdentityList,
} from "@idfyi/dto";

export type IdentityListName
  = "all"
  | "homepage";

export interface IdentityClientOptions {
  url?: string;
}

export class IdentityFYIClient {

  private readonly url: string;

  public constructor(config: IdentityClientOptions = {}) {
    this.url = config.url ?? "https://identity.fyi/";
  }

  public getIdentityList(list: IdentityListName): Promise<CompiledIdentityList> {
    return this.get(`${list}.identities.json`, CompiledIdentityList);
  }

  public getIdentity(identity: string): Promise<CompiledIdentityIndexFile> {
    return this.get(`${identity}/index.json`, CompiledIdentityIndexFile);
  }

  public async get<T extends object>(url: string, cls: ClassType<T>): Promise<T> {
    const res = await fetch(`${this.url}${url}`);
    const body = res.json();
    const parsed = await transformAndValidate<T>(cls, body);
    if(Array.isArray(parsed)) {
      throw new ReferenceError(`Got back an array from ${this.url}${url}`);
    }
    return parsed;
  }

}
