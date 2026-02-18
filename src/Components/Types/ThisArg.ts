type ThisArg<Type> = unknown extends Type
    ? void
    : Type extends void | undefined
      ? void
      : Type;

export type { ThisArg };
