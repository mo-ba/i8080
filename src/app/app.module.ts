import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {CpuModule} from './cpu/cpu.module';
import {RegisterModule} from './components/register/register.module';
import {MemoryModule} from './components/memory/memory.module';
import {ControlModule} from './components/control/control.module';
import {OperationModule} from './components/operation/operation.module';
import {MonacoEditorModule, NgxMonacoEditorConfig} from 'ngx-monaco-editor';
import {AssemblerModule} from './components/assembler/assembler.module';

export function onMonacoLoad() {

    console.log((window as any).monaco);

    // Register a new language
    monaco.languages.register({id: 'mySpecialLanguage'});

// Register a tokens provider for the language
    monaco.languages.setMonarchTokensProvider('mySpecialLanguage', {


        keywords: [
            'DAA', 'STC', 'CMC', 'CMA', 'RLC', 'RAL', 'RRC', 'RAR',
            'ADD', 'ADC', 'SUB', 'SBB', 'ANA', 'XRA', 'ORA', 'CMP',
            'ADI', 'ACI', 'SUI', 'SBI', 'ANI', 'XRI', 'ORI', 'CPI',
            'INR', 'DCR', 'DAD', 'INX', 'DCX', 'LXI', 'LDAX', 'LDA',
            'STAX', 'STA', 'SHLD', 'LHLD', 'XTHL', 'SPHL', 'XCHG', 'PCHL',
            'MOV', 'MVI', 'PUSH', 'POP', 'NOP', 'HLT', 'RET', 'RNZ',
            'RZ', 'RNC', 'RC', 'RPO', 'RPE', 'RP', 'RM', 'JMP', 'JNZ',
            'JZ', 'JNC', 'JC', 'JPO', 'JPE', 'JP', 'JM', 'CALL', 'CNZ',
            'CZ', 'CNC', 'CC', 'CPO', 'CPE', 'CP', 'CM'],

        registers: [
            'A', 'B', 'C', 'D', 'E', 'H',  'L', 'M', 'PSW']
        ,
        tokenizer: {
            root: [
                [/[a-zA-Z][a-zA-Z0-9]+:/, 'label'],
                [/[a-fA-F0-9]+[H]/, 'number'],
                [/[0-1]+[B]/, 'number'],
                [/[0-9]+/, 'number'],
                [/[A-Z]+/, {
                    cases: {
                        '@keywords': 'operation',
                        '@registers': 'register',
                        '@default': 'param'
                    }
                }],
                [/[a-zA-Z0-9]+/, {
                    cases: {
                        '@default': 'param'
                    }
                }],
                [/;.*/, 'comment'],
            ]
        }
    } as any);

// Define a new theme that contains only rules that match this language
    monaco.editor.defineTheme('myCoolTheme', {
        base: 'vs',
        inherit: true,
        rules: [
            {token: 'number', foreground: '7586ff'},
            {token: 'comment', foreground: '777777'},
            {token: 'param', foreground: '008800'},
            {token: 'register', foreground: '555555'},
            {token: 'operation', foreground: 'a31515', fontStyle: 'bold'},
            {token: 'label', foreground: '008800'},
        ]
    }as any);


}

const monacoConfig: NgxMonacoEditorConfig = {
    baseUrl: 'assets',
    defaultOptions: {scrollBeyondLastLine: false},
    onMonacoLoad
};

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        CpuModule,
        RegisterModule,
        MemoryModule,
        ControlModule,
        OperationModule,
        MonacoEditorModule.forRoot(monacoConfig),
        AssemblerModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
