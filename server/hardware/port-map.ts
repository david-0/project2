export const enum Port {
  DI_1,
  DI_2,
  DI_3,
  DI_4,
  DI_5,
  DI_6,
  DI_7,
  DI_8,
  DO_1,
  DO_2,
  DO_3,
  DO_4,
  DO_5,
  DO_6,
  DO_7,
  DO_8,
  AI_1,
  AI_2,
  AI_3,
  AI_4
}

export const digitalInputs: Port[] = [Port.DI_1, Port.DI_2, Port.DI_3, Port.DI_4, Port.DI_5, Port.DI_6, Port.DI_7, Port.DI_8];

export const digitalOutputs: Port[] = [Port.DO_1, Port.DO_2, Port.DO_3, Port.DO_4, Port.DO_5, Port.DO_6, Port.DO_7, Port.DO_8];

export const analogInputs: Port[] = [Port.AI_1, Port.AI_2, Port.AI_3, Port.AI_4];
