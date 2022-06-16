import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class NftsService {
  constructor(private httpService: HttpService) {}

  async getNfts(url: string): Promise<any> {
    return await firstValueFrom(this.httpService.get(url));
  }
}
