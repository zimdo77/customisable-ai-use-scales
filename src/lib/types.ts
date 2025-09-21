export type RubricStatus = "active" | "archived" | "update-available";

export interface Rubric {
  id: string;
  name: string;
  subjectCode: string;        // e.g. "COMP30023"
  rowCount: number;           // number of rubric rows
  version: number;            // instance version
  templateId?: string | null; // if derived
  templateVersion?: number;   // template version the instance was created from
  updatedAt: string;          // ISO date string
  status: RubricStatus;
  ownerId: string;            // current user id (fake for now)
  shared?: boolean;
}
