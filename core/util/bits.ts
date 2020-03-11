export const NIBBLE_MAX = 15;
export const NIBBLE_LENGTH = 4;
export const NIBBLE_CARRY_BIT = 16;

export const BYTE_MAX = 255;

export const BYTE_HIGH_BITS = NIBBLE_MAX << 4;

export const AUX_BIT = NIBBLE_CARRY_BIT;

export const BYTE_CARRY_BIT = 256;

export const BYTE_LENGTH = 8;

export const WORD_LENGTH = AUX_BIT;

export const WORD_CARY_BIT = 1 << AUX_BIT;

export const WORD_MAX = WORD_CARY_BIT - 1;

export const WORD_HIGH_BITS = WORD_CARY_BIT - 1;

export const WORD_LOW_BITS = BYTE_MAX;

export const DECIMAL_MAX_DIGIT = 9;

export const DECIMAL_ADJUST = 6;

