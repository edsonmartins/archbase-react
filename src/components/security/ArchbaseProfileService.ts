import { ArchbaseRemoteApiClient, ArchbaseRemoteApiService } from "components/service";
import { ProfileDto } from "./SecurityDomain";

export abstract class ArchbaseProfileService extends ArchbaseRemoteApiService<ProfileDto, string> {
  constructor(client: ArchbaseRemoteApiClient) {
    super(client)
  }
}