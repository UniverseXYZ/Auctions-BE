import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class Tokens {
  constructor(private configService: ConfigService) {}
  getTokens() {
    return {
      ETH: {
        decimals: 18,
      },
      USDC: {
        // USDC Rinkeby Token has 18 decimals, mainnet has 6
        decimals: this.configService.get("network_chain_id") === "1" ? 6 : 18,
      },
      DAI: {
        decimals: 18,
      },
      XYZ: {
        decimals: 18,
      },
      WETH: {
        decimals: 18,
      },
    };
  }
}
