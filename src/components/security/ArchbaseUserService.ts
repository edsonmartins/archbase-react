import { ArchbaseRemoteApiClient, ArchbaseRemoteApiService } from "components/service";
import { UserDto } from "./SecurityDomain";

export abstract class ArchbaseUserService extends ArchbaseRemoteApiService<UserDto, string> {
  constructor(client: ArchbaseRemoteApiClient) {
    super(client)
  }
}