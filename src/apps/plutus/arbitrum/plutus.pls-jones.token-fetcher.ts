import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Erc20 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { Network } from '~types/network.interface';

import { PlutusContractFactory } from '../contracts';
import PLUTUS_DEFINITION from '../plutus.definition';

@Injectable()
export class ArbitrumPlutusPlsJonesTokenFetcher extends AppTokenTemplatePositionFetcher<Erc20> {
  appId = PLUTUS_DEFINITION.id;
  groupId = PLUTUS_DEFINITION.groups.plsJones.id;
  network = Network.ARBITRUM_MAINNET;
  groupLabel = 'plsJONES';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PlutusContractFactory) protected readonly contractFactory: PlutusContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.erc20({ address, network: this.network });
  }

  async getAddresses() {
    return ['0xe7f6c3c1f0018e4c08acc52965e5cbff99e34a44'];
  }

  async getUnderlyingTokenAddresses() {
    return ['0xe8ee01ae5959d3231506fcdef2d5f3e85987a39c'];
  }
}
