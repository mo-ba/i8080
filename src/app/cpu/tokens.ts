import {InjectionToken} from '@angular/core';

const MEMORY = new InjectionToken<string>('memory');
const REGISTER = new InjectionToken<string>('register');
const FETCH = new InjectionToken<string>('fetch');
const DECODE = new InjectionToken<string>('decode');
const EXECUTE = new InjectionToken<string>('execute');
const PROCESSOR = new InjectionToken<string>('processor');

export const TOKEN = {
    MEMORY,
    REGISTER,
    FETCH,
    DECODE,
    EXECUTE,
    PROCESSOR,
};
