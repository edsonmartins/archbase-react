import { ArchbaseRemoteApiClient, ArchbaseRemoteApiService } from "components/service";
import { GroupDto } from "./SecurityDomain";

export abstract class ArchbaseGroupService extends ArchbaseRemoteApiService<GroupDto, string> {
  constructor(client: ArchbaseRemoteApiClient) {
    super(client)
  }
}