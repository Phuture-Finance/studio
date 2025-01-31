import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { ConvexContractFactory, ConvexCvxStaking } from '../contracts';
import { CONVEX_DEFINITION } from '../convex.definition';

const FARMS = [
  {
    address: '0xcf50b810e57ac33b91dcf525c6ddd9881b139332',
    stakedTokenAddress: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b', // CVX
    rewardTokenAddresses: ['0x62b9c7356a2dc64a1969e19c23e4f579f9810aa7'], // cvxCRV
  },
];

@Injectable()
export class EthereumConvexCvxStakingContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<ConvexCvxStaking> {
  appId = CONVEX_DEFINITION.id;
  groupId = CONVEX_DEFINITION.groups.cvxStaking.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'CVX Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConvexContractFactory) protected readonly contractFactory: ConvexContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): ConvexCvxStaking {
    return this.contractFactory.convexCvxStaking({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return FARMS;
  }

  getRewardRates({ contract }: GetDataPropsParams<ConvexCvxStaking, SingleStakingFarmDataProps>) {
    return contract.rewardRate();
  }

  getStakedTokenBalance({ contract, address }: GetTokenBalancesParams<ConvexCvxStaking, SingleStakingFarmDataProps>) {
    return contract.balanceOf(address);
  }

  getRewardTokenBalances({ contract, address }: GetTokenBalancesParams<ConvexCvxStaking, SingleStakingFarmDataProps>) {
    return contract.earned(address);
  }
}
