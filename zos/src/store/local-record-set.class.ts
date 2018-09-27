import {inject} from 'inversify';
import {MERKLE_TYPES} from '../infrastructure/merkle/di';
import {APP_CONFIG_TYPES} from '../apps/di';

export class LocalRecordSet {
   constructor(
      @inject(MERKLE_TYPES.MerkleCalculator) private readonly MerkleCalculator,
      @inject(MERKLE_TYPES.DigestIdentityService) private readonly DigestIdentityService,
      @inject(APP_CONFIG_TYPES.Deployment) private readonly DeploymentConfig,
   ) {
      this.localMappedRoot = "/var/lib/data/lottoVault";
      this.relativeActivityPath = ".";
   }

   public populateDirectoryStructure() {
      // Get a DFS traversal and map names through the identity service, checking as you
      // go for directory existence and other maintenance chores.
   }
}