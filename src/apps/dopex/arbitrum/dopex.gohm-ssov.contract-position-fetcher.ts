import { Injectable } from '@nestjs/common';

import { GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { Network } from '~types/network.interface';

import { DopexSsovContractPositionFetcher, DopexSsovDataProps } from '../common/dopex.ssov.contract-position-fetcher';
import { DopexGOhmSsov } from '../contracts';
import { DOPEX_DEFINITION } from '../dopex.definition';

@Injectable()
export class ArbitrumDopexGOhmSsovContractPositionFetcher extends DopexSsovContractPositionFetcher<DopexGOhmSsov> {
  appId = DOPEX_DEFINITION.id;
  groupId = DOPEX_DEFINITION.groups.gohmSsov.id;
  network = Network.ARBITRUM_MAINNET;
  groupLabel = 'SSOVs';

  getContract(address: string): DopexGOhmSsov {
    return this.contractFactory.dopexGOhmSsov({ address, network: this.network });
  }

  getSsovDefinitions() {
    return [
      // gOHM December Epoch (Legacy)
      {
        address: '0x89836d5f178141aaf013412b12abd754802d2318',
        depositTokenAddress: '0x8d9ba570d6cb60c7e3e0f31343efe75ab8e65fb1',
      },
      // gOHM January Epoch (Legacy)
      {
        address: '0x460f95323a32e26c8d32346abe73eb94d7db08d6',
        depositTokenAddress: '0x8d9ba570d6cb60c7e3e0f31343efe75ab8e65fb1',
      },
      // gOHM February Epoch (Active)
      {
        address: '0x54552cb564f4675bceda644e47de3e35d1c88e1b',
        depositTokenAddress: '0x8d9ba570d6cb60c7e3e0f31343efe75ab8e65fb1',
      },
    ];
  }

  getTotalEpochStrikeDepositBalance({
    contract,
    contractPosition,
  }: GetTokenBalancesParams<DopexGOhmSsov, DopexSsovDataProps>) {
    const { epoch, strike } = contractPosition.dataProps;
    return contract.totalEpochStrikeGohmBalance(epoch, strike);
  }

  async getTotalEpochStrikeRewardBalances(_params: GetTokenBalancesParams<DopexGOhmSsov, DopexSsovDataProps>) {
    return [];
  }
}
