export interface IMedication {
  id: number;
  name: string;
  indications: string;
  inclusionCriteria: string;
  exclusionCriteria: string;
  form: string;
  route: string;
  dose: string;
  sideEffects: string;
  adviceIfTaken: string;
  adviceIfDeclined: string;
  policyDate?: string | null;
}
