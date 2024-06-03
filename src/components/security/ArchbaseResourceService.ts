import { ArchbaseRemoteApiClient, ArchbaseRemoteApiService } from "components/service";
import { ResourceDto } from "./SecurityDomain";

export abstract class ArchbaseResourceService extends ArchbaseRemoteApiService<ResourceDto, string> {
  constructor(client: ArchbaseRemoteApiClient) {
    super(client)
  }
}