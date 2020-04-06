import {InjectionToken} from '@angular/core';

export const TOKEN = (() => {
    const OBSERVABLE = (() => {
        const MEMORY = new InjectionToken<string>('memory_obs');
        const REGISTER = new InjectionToken<string>('register_obs');
        const DECODE = new InjectionToken<string>('decode_obs');
        return {MEMORY, REGISTER, DECODE};
    })();


    const MEMORY = new InjectionToken<string>('memory');
    const REGISTER = new InjectionToken<string>('register');
    const FETCH = new InjectionToken<string>('fetch');
    const DECODE = new InjectionToken<string>('decode');
    const EXECUTE = new InjectionToken<string>('execute');
    const PROCESSOR = new InjectionToken<string>('processor');

    return {MEMORY, REGISTER, FETCH, DECODE, EXECUTE, PROCESSOR, OBSERVABLE};
})();

