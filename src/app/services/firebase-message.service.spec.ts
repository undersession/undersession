import { TestBed } from '@angular/core/testing';

import { FirebaseMessageService } from './firebase-message.service';

describe('FirebaseMessageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirebaseMessageService = TestBed.get(FirebaseMessageService);
    expect(service).toBeTruthy();
  });
});
