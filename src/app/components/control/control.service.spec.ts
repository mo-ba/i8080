import {TestBed} from '@angular/core/testing';

import {ControlService} from './control.service';

describe('ControlService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [ControlService]
    }));

    it('should be created', () => {
        const service: ControlService = TestBed.get(ControlService);
        expect(service).toBeTruthy();
    });
});
