export interface AnalysisResult {
  label_main: 'Normal' | 'Abnormal' | 'Cannot Dx';
  quality: 'Good' | 'Bad';
  probs: {
    p_bad: number;
    tau_bad: number;
    p_reject: number;
    tau_reject: number;
    p_abnormal?: number;
    tau_abnormal?: number;
  };
  routing: {
    is_cannotdx: boolean;
    force_diagnose: boolean;
    reason: string;
  };
  features?: {
    names: string[];
    raw: number[];
    zscore: number[];
  };
  assets: {
    letterbox: string;
    gradcam_gate_reject: string;
    gradcam_gate_bad: string;
    gradcam_dx2?: string;
  };
  meta: {
    orig_w: number;
    orig_h: number;
    new_w: number;
    new_h: number;
    pad_left: number;
    pad_top: number;
    pad_right: number;
    pad_bottom: number;
    scale: number;
  };
  // UI additions
  timestamp: number;
  filename: string;
  apiBaseUrl: string;
  forcedDiagnose?: boolean;
}

export interface DebugInfo {
  gate: {
    timm: string;
    tau_bad: number;
    tau_reject: number;
    feat_norm: boolean;
  };
  dx2: {
    timm: string;
    temperature: number;
    tta_mode: string;
    tau: number;
  };
  input: {
    letterbox: number;
    model_input: number;
  };
}

export interface Settings {
  autoForce: boolean;
}
