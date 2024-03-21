import { defineAbility } from '@casl/ability';

export default defineAbility((can, cannot) => {
  can('manage', 'admin');
  can('manage', 'rh');
  can('manage', 'csa');
  can('crud', 'rh');
  can('view','admin');
  can('view','csa');
  can('submit2','csa');
  can('submit3','admin');
  can('submit1','rh');
  cannot('updateuser', 'rh');
  cannot('updateuser', 'csa');
  cannot('submit2','rh');
  cannot('submit3','rh');
  cannot('submit1', 'csa');
  cannot('submit3', 'csa');
  cannot('submit1', 'admin');
  cannot('submit2', 'admin');
  cannot('crud', 'csa');
  cannot('crud', 'admin');
});