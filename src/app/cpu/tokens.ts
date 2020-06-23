import {InjectionToken} from '@angular/core';

const OBSERVABLE = (() => {
    const MEMORY = new InjectionToken<string>('memory_obs');
    const REGISTER = new InjectionToken<string>('register_obs');
    const DECODE = new InjectionToken<string>('decode_obs');
    return {MEMORY, REGISTER, DECODE};
})();
const ABSTRACT = (() => {
    const MEMORY = new InjectionToken<string>('memory_abstract');
    const REGISTER = new InjectionToken<string>('register_abstract');
    const FETCH = new InjectionToken<string>('fetch');
    const DECODE = new InjectionToken<string>('decode_abstract');
    const EXECUTE = new InjectionToken<string>('execute_abstract');
    const PROCESSOR = new InjectionToken<string>('processor_abstract');

    return {
        MEMORY,
        REGISTER,
        FETCH,
        DECODE,
        EXECUTE,
        PROCESSOR,
    };
})();
export const TOKEN = (() => {


    const ASSEMBLER = new InjectionToken<string>('assembler');
    const PARSER = new InjectionToken<string>('parser');
    const MEMORY = new InjectionToken<string>('memory');
    const REGISTER = new InjectionToken<string>('register');
    const FETCH = new InjectionToken<string>('fetch');
    const DECODE = new InjectionToken<string>('decode');
    const EXECUTE = new InjectionToken<string>('execute');
    const PROCESSOR = new InjectionToken<string>('processor');

    return {
        PARSER,
        ASSEMBLER,
        MEMORY,
        REGISTER,
        FETCH,
        DECODE,
        EXECUTE,
        PROCESSOR,
        OBSERVABLE,
        ABSTRACT
    };
})();

